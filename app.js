(function () {
  var PLAYLIST_URL = "https://wantmymtv.xyz/public/mtv-playlists.json";
  var DEFAULT_CHANNEL = "80s";
  var FAVORITES_CHANNEL = "My MTV Favs";

  var playlists = null;
  var channels = [];
  var channelIdx = 0;
  var videoIdx = 0;
  var state = loadState();

  var player = null;
  var ytReady = false;
  var lastKeyTs = 0;
  var okLongPressTimer = null;
  var okLongPressHandled = false;
  var playWatchdog = null;
  var userInteracted = false;
  var playlistsReady = false;
  var PLAYLIST_CACHE_KEY = "wmmtv-playlists-v1";
  var INTERLEAVE_POOL_KEYS = ["commercials", "amp"];
  var SEQUENTIAL_CHANNEL_PATTERNS = ["live aid"];

  var titleBar = document.getElementById("titleBar");
  var artistEl = document.getElementById("artist");
  var titleEl = document.getElementById("title");
  var listLabelEl = document.getElementById("listLabel");
  var playerEl = document.getElementById("player");
  var loadingOverlay = document.getElementById("loadingOverlay");
  var lastDirection = 1;

  /* ===== Logging & Error Handling ===== */

  var DEBUG_MODE = false; // Set to false in production
  var errorLog = [];
  var failedVideos = {}; // Blacklist of video IDs that failed to play
  var MAX_ERROR_LOG_SIZE = 50;
  var BLACKLIST_KEY = "wmmtv-blacklist-v1";
  var BLACKLIST_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

  function log() {
    if (!DEBUG_MODE) return;
    var args = Array.prototype.slice.call(arguments);
    var timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log.apply(console, ['[MTV ' + timestamp + ']'].concat(args));
  }

  function logError(message, data) {
    var entry = {
      timestamp: new Date().toISOString(),
      message: message,
      data: data
    };
    errorLog.push(entry);
    if (errorLog.length > MAX_ERROR_LOG_SIZE) {
      errorLog.shift();
    }
    log('ERROR:', message, data);

    // Store in localStorage for debugging
    try {
      localStorage.setItem('wmmtv-error-log', JSON.stringify(errorLog.slice(-20)));
    } catch (e) {}
  }

  function showNotification(message, duration) {
    duration = duration || 3000;

    // Remove existing notification
    var existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();

    // Create notification element
    var notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(function() {
      notification.classList.add('show');
    }, 10);

    // Remove after duration
    setTimeout(function() {
      notification.classList.remove('show');
      setTimeout(function() {
        notification.remove();
      }, 300);
    }, duration);
  }

  function getYouTubeErrorMessage(errorCode) {
    switch(errorCode) {
      case 2: return 'Invalid video parameter';
      case 5: return 'HTML5 player error';
      case 100: return 'Video not found or removed';
      case 101: return 'Video not allowed to embed';
      case 150: return 'Video not allowed to embed';
      default: return 'Unknown error (' + errorCode + ')';
    }
  }

  /* ===== Persistent Blacklist ===== */

  function loadBlacklist() {
    try {
      var raw = localStorage.getItem(BLACKLIST_KEY);
      if (!raw) return {};
      var blacklist = JSON.parse(raw);
      var now = Date.now();
      var cleaned = {};
      // Remove entries older than 7 days
      for (var id in blacklist) {
        if (blacklist[id] && blacklist[id].timestamp) {
          if (now - blacklist[id].timestamp < BLACKLIST_MAX_AGE) {
            cleaned[id] = blacklist[id];
          }
        }
      }
      return cleaned;
    } catch (e) {
      log('Failed to load blacklist', e);
      return {};
    }
  }

  function saveBlacklist() {
    try {
      localStorage.setItem(BLACKLIST_KEY, JSON.stringify(failedVideos));
      log('Blacklist saved', { count: Object.keys(failedVideos).length });
    } catch (e) {
      log('Failed to save blacklist', e);
    }
  }

  function isVideoBlacklisted(videoId) {
    return failedVideos[videoId] ? true : false;
  }

  /* ===== Loading Overlay ===== */

  function showLoading() {
    if (loadingOverlay) {
      loadingOverlay.classList.remove('hidden');
      log('Loading overlay shown');
    }
  }

  function hideLoading() {
    if (loadingOverlay) {
      loadingOverlay.classList.add('hidden');
      log('Loading overlay hidden');
    }
  }

  /* ===== Helpers ===== */

  function now() { return Date.now(); }

  function pageOrigin() {
    if (window.location && window.location.origin) return window.location.origin;
    if (window.location && window.location.protocol && window.location.host) {
      return window.location.protocol + "//" + window.location.host;
    }
    return "";
  }

  function safeChannels(obj) {
    var out = [];
    for (var k in obj) if (obj[k] && obj[k].length) out.push(k);
    out.sort();
    return out;
  }

  function currentChannel() {
    return channels[channelIdx] || DEFAULT_CHANNEL;
  }

  function currentList() {
    return playlistForChannel(currentChannel());
  }

  function clampVideo() {
    var l = currentList().length;
    if (!l) videoIdx = 0;
    else if (videoIdx < 0) videoIdx = l - 1;
    else if (videoIdx >= l) videoIdx = 0;
  }

  function loadState() {
    var fallback = {
      channel: DEFAULT_CHANNEL,
      positions: {},
      shuffles: {},
      interleaves: {},
      favorites: []
    };
    if (!window.localStorage) return fallback;
    try {
      var raw = localStorage.getItem("wmmtv-state-v1");
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return fallback;
      parsed.positions = parsed.positions || {};
      parsed.shuffles = parsed.shuffles || {};
      parsed.interleaves = parsed.interleaves || {};
      parsed.favorites = parsed.favorites || [];
      parsed.channel = parsed.channel || DEFAULT_CHANNEL;
      return parsed;
    } catch (err) {
      return fallback;
    }
  }

  function saveState() {
    if (!window.localStorage) return;
    try {
      localStorage.setItem("wmmtv-state-v1", JSON.stringify(state));
    } catch (err) {}
  }

  function buildChannels(obj) {
    var out = safeChannels(obj);
    if (out.indexOf(FAVORITES_CHANNEL) === -1) out.push(FAVORITES_CHANNEL);
    return out;
  }

  function normalizePlaylistEntry(entry) {
    if (!entry) return { videos: [], order: "" };
    if (Array.isArray(entry)) {
      return { videos: entry, order: "" };
    }
    if (typeof entry === "object") {
      var videos = entry.videos || entry.list || entry.items || [];
      var name = entry.name || entry.title || "";
      var order = entry.order || entry.mode || "";
      var interleave = entry.interleave || entry.mix || entry.inserts || null;
      var wantsRandom = entry.shuffle || entry.random;
      if (!order && wantsRandom) order = "random";
      if (order === "random" || order === "shuffle") order = "random";
      if (order === "sequential") order = "sequential";
      return { videos: videos, order: order, name: name, interleave: interleave };
    }
    return { videos: [], order: "" };
  }

  function playlistForChannel(channel) {
    if (!playlists) return [];
    if (channel === FAVORITES_CHANNEL) return state.favorites || [];
    var rawEntry = playlists[channel];
    var entry = normalizePlaylistEntry(rawEntry);
    var list = entry.videos || [];
    if (!list.length) return [];
    var wantsRandom = entry.order === "random";
    var wantsSequential = entry.order === "sequential";
    if (!wantsRandom && !wantsSequential) {
      wantsRandom = shouldShuffleChannel(channel, entry);
      wantsSequential = !wantsRandom;
    }
    if (wantsRandom) {
      var order = ensureShuffle(channel, list.length);
      list = order.map(function (idx) { return list[idx]; });
    }
    var interleave = normalizeInterleave(rawEntry, entry.interleave, channel);
    return interleave ? interleaveList(channel, list, interleave) : list;
  }

  function normalizeInterleave(rawEntry, normalizedConfig, channel) {
    if (channel && isInterleavePoolChannel(channel)) return null;
    if (!rawEntry || typeof rawEntry !== "object") rawEntry = null;
    var config = normalizedConfig || (rawEntry && (rawEntry.interleave || rawEntry.mix || rawEntry.inserts)) || null;
    var pools = [];
    var source = config && typeof config === "object" ? config : rawEntry;
    pools = buildInterleavePools(source);
    if (!pools.length) {
      pools = buildInterleavePools(playlists);
    }
    if (!pools.length) return null;
    var minInterval = (source && (source.minInterval || source.minInsert || source.min)) || null;
    var maxInterval = (source && (source.maxInterval || source.maxInsert || source.max)) || null;
    var every = source && (source.every || source.insertEvery) || null;
    if (every && !minInterval && !maxInterval) {
      minInterval = every;
      maxInterval = every;
    }
    minInterval = minInterval || 5;
    maxInterval = maxInterval || 7;
    if (maxInterval < minInterval) maxInterval = minInterval;
    return { pools: pools, minInterval: minInterval, maxInterval: maxInterval };
  }

  function buildInterleavePools(source) {
    if (!source || typeof source !== "object") return [];
    var pools = [];
    for (var i = 0; i < INTERLEAVE_POOL_KEYS.length; i++) {
      var key = INTERLEAVE_POOL_KEYS[i];
      var raw = source[key];
      var items = listFromPoolEntry(raw);
      if (items.length) pools.push({ name: key, items: items });
    }
    return pools;
  }

  function listFromPoolEntry(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "object") {
      var entry = normalizePlaylistEntry(raw);
      return entry.videos || [];
    }
    return [];
  }

  function isInterleavePoolChannel(channel) {
    var name = String(channel || "").toLowerCase();
    for (var i = 0; i < INTERLEAVE_POOL_KEYS.length; i++) {
      if (name === INTERLEAVE_POOL_KEYS[i]) return true;
    }
    return false;
  }

  function shouldShuffleChannel(channel, entry) {
    var label = String((entry && (entry.name || "")) || channel || "").toLowerCase();
    for (var i = 0; i < SEQUENTIAL_CHANNEL_PATTERNS.length; i++) {
      if (label.indexOf(SEQUENTIAL_CHANNEL_PATTERNS[i]) !== -1) return false;
    }
    return true;
  }

  function interleaveList(channel, list, interleave) {
    if (!interleave || !interleave.pools.length) return list;
    var signature = computeInterleaveSignature(list, interleave);
    var meta = state.interleaves[channel];
    if (!meta || meta.signature !== signature) {
      meta = {
        signature: signature,
        seed: Math.floor(Math.random() * 1000000000)
      };
      state.interleaves[channel] = meta;
      saveState();
    }
    var rng = seededRandom(meta.seed);
    var out = [];
    var sinceInsert = 0;
    var nextInsert = randomBetween(interleave.minInterval, interleave.maxInterval, rng);
    for (var i = 0; i < list.length; i++) {
      out.push(list[i]);
      sinceInsert++;
      if (sinceInsert >= nextInsert) {
        var insert = pickInsert(interleave.pools, rng);
        if (insert) out.push(insert);
        sinceInsert = 0;
        nextInsert = randomBetween(interleave.minInterval, interleave.maxInterval, rng);
      }
    }
    return out;
  }

  function computeInterleaveSignature(list, interleave) {
    var hash = 5381;
    hash = hashItems(list, hash);
    for (var i = 0; i < interleave.pools.length; i++) {
      hash = hashString(interleave.pools[i].name, hash);
      hash = hashItems(interleave.pools[i].items, hash);
    }
    hash = hashNumber(interleave.minInterval, hash);
    hash = hashNumber(interleave.maxInterval, hash);
    return String(hash >>> 0);
  }

  function hashItems(items, hash) {
    for (var i = 0; i < items.length; i++) {
      hash = hashString(String(items[i]), hash);
    }
    return hash;
  }

  function hashString(value, hash) {
    for (var i = 0; i < value.length; i++) {
      hash = ((hash << 5) + hash) + value.charCodeAt(i);
    }
    return hash;
  }

  function hashNumber(value, hash) {
    return hashString(String(value), hash);
  }

  function seededRandom(seed) {
    var value = seed;
    return function () {
      value = (value * 1664525 + 1013904223) % 4294967296;
      return value / 4294967296;
    };
  }

  function randomBetween(min, max, rng) {
    var span = max - min + 1;
    return min + Math.floor(rng() * span);
  }

  function pickInsert(pools, rng) {
    var pool = pools[Math.floor(rng() * pools.length)];
    if (!pool || !pool.items.length) return "";
    return pool.items[Math.floor(rng() * pool.items.length)];
  }

  function currentListLabel() {
    var channel = currentChannel();
    if (channel === FAVORITES_CHANNEL) return FAVORITES_CHANNEL.toUpperCase();
    if (!playlists) return channel.toUpperCase();
    var entry = normalizePlaylistEntry(playlists[channel]);
    var name = entry.name || channel;
    return String(name).toUpperCase();
  }

  function ensureShuffle(channel, length) {
    var order = state.shuffles[channel];
    if (!Array.isArray(order) || order.length !== length) {
      order = [];
      for (var i = 0; i < length; i++) order.push(i);
      for (var j = order.length - 1; j > 0; j--) {
        var k = Math.floor(Math.random() * (j + 1));
        var tmp = order[j];
        order[j] = order[k];
        order[k] = tmp;
      }
      state.shuffles[channel] = order;
      saveState();
    }
    return order;
  }

  function storedPosition(channel) {
    var pos = state.positions[channel];
    return (typeof pos === "number" && pos >= 0) ? pos : 0;
  }

  function syncState() {
    var channel = currentChannel();
    state.channel = channel;
    state.positions[channel] = videoIdx;
    saveState();
  }

  function toggleFavorite() {
    var list = currentList();
    if (!list.length) return;
    var currentVideo = list[videoIdx];
    if (!currentVideo) return;
    var favorites = state.favorites || [];
    if (currentChannel() === FAVORITES_CHANNEL) {
      var removeIdx = favorites.indexOf(currentVideo);
      if (removeIdx !== -1) {
        favorites.splice(removeIdx, 1);
        log('Removed from favorites', { videoId: currentVideo });
        showNotification('❌ Removed from favorites', 2000);
      }
      state.favorites = favorites;
      saveState();
      if (!favorites.length) return;
      if (videoIdx >= favorites.length) videoIdx = favorites.length - 1;
      playCurrent();
      return;
    }
    if (favorites.indexOf(currentVideo) === -1) {
      favorites.push(currentVideo);
      state.favorites = favorites;
      saveState();
      log('Added to favorites', { videoId: currentVideo, totalFavorites: favorites.length });
      showNotification('⭐ Added to favorites (' + favorites.length + ')', 2000);
    } else {
      log('Already in favorites', { videoId: currentVideo });
      showNotification('⚠️ Already in favorites', 2000);
    }
    showTitleBar();
  }

  /* ===== Title bar ===== */

  function parseTitle(raw) {
    if (!raw) return { artist: "", title: "" };
    var parts = raw.split(" - ");
    if (parts.length >= 2) {
      return {
        artist: parts[0].trim(),
        title: parts.slice(1).join(" - ").trim()
      };
    }
    return { artist: "", title: raw };
  }

  function showTitleBar() {
    titleBar.classList.add("show");
    clearTimeout(showTitleBar._t);
    showTitleBar._t = setTimeout(function () {
      titleBar.classList.remove("show");
    }, 6000);
  }

  function showError(message) {
    if (!titleBar) return;
    if (listLabelEl) listLabelEl.textContent = "BŁĄD";
    if (artistEl) artistEl.textContent = "";
    if (titleEl) titleEl.textContent = message || "Wystąpił błąd";
    showTitleBar();
  }

  function updateTitle() {
    if (!player || !player.getVideoData) return;
    var data = player.getVideoData();
    var parsed = parseTitle(data.title || "");
    artistEl.textContent = parsed.artist;
    titleEl.textContent = parsed.title;
    if (listLabelEl) listLabelEl.textContent = currentListLabel();
    showTitleBar();
  }

  function setPlayerVisible(isVisible) {
    if (!playerEl) return;
    var iframe = playerEl.querySelector("iframe");
    // Keep container always visible to avoid YouTube API issues
    playerEl.style.visibility = "visible";
    playerEl.style.opacity = isVisible ? "1" : "0";

    // Use ONLY opacity on iframe (not visibility:hidden) to prevent breaking autoplay
    // YouTube requires iframe visibility:visible for autoplay to work
    if (iframe) {
      iframe.style.visibility = "visible"; // Always visible for YouTube autoplay
      iframe.style.opacity = isVisible ? "1" : "0";
    }
  }

  /* ===== YouTube ===== */

  window.onYouTubeIframeAPIReady = function () {
    ytReady = true;
    maybeStart();
  };

  function createOrLoad(videoId) {
    if (!ytReady || !videoId) return;

    clearTimeout(playWatchdog);

    // Overlay is already shown by navigation functions (nextVideo, prevVideo, etc.)
    // This ensures error messages are hidden before YouTube starts loading

    // Ensure player is visible before loading - required for YouTube autoplay
    setPlayerVisible(true);

    if (player && player.loadVideoById) {
      player.loadVideoById(videoId);
      startWatchdog();
      return;
    }

    player = new YT.Player("player", {
      videoId: videoId,
      width: "1920",
      height: "1080",
      host: "https://www.youtube-nocookie.com",
      playerVars: {
        autoplay: 1,
        mute: 1,
        controls: 0,
        rel: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        showinfo: 0,
        modestbranding: 1,
        playsinline: 1,
        origin: pageOrigin()
      },
      events: {
        onReady: function (e) {
          // Delay playVideo() slightly to ensure Tizen TV player is ready
          setTimeout(function() {
            e.target.playVideo();
          }, 100);
          // NOTE: NIE unmutować tutaj! YouTube blokuje autoplay jeśli player
          // jest odmutowany przed rozpoczęciem odtwarzania. Unmute jest w onStateChange PLAYING.
          startWatchdog();

          // TRIPLE SEEK - pomijanie reklam YouTube (wzorowane na wantmymtv.xyz)
          setTimeout(function() {
            if (player && player.getPlayerState) {
              var state = player.getPlayerState();
              if (state === 1 || state === 2) {
                var currentTime = player.getCurrentTime();
                player.seekTo(currentTime, true);
              }
            }
          }, 500);

          setTimeout(function() {
            if (player && player.getPlayerState) {
              var state = player.getPlayerState();
              if (state === 1 || state === 2) {
                var currentTime = player.getCurrentTime();
                player.seekTo(currentTime, true);
              }
            }
          }, 1000);

          setTimeout(function() {
            if (player && player.getPlayerState) {
              var state = player.getPlayerState();
              if (state === 1 || state === 2) {
                var currentTime = player.getCurrentTime();
                player.seekTo(currentTime, true);
              }
            }
          }, 1500);
        },
        onStateChange: function (e) {
          if (e.data === YT.PlayerState.PLAYING) {
            clearTimeout(playWatchdog);
            hideLoading(); // Hide loading overlay when video starts playing
            e.target.unMute();
            if (e.target.setVolume) e.target.setVolume(100);
            setPlayerVisible(true);
            updateTitle();
          }
          if (e.data === YT.PlayerState.ENDED) nextVideo();
        },
        onError: function (event) {
          var list = currentList();
          var badVideoId = list[videoIdx] || 'unknown';
          var errorCode = event.data;
          var errorMessage = getYouTubeErrorMessage(errorCode);

          // Log the error (silent - no user notification to avoid spam)
          logError('Video playback error', {
            videoId: badVideoId,
            errorCode: errorCode,
            errorMessage: errorMessage,
            channel: currentChannel(),
            videoIndex: videoIdx
          });

          // Add to persistent blacklist (survives page refresh)
          failedVideos[badVideoId] = {
            errorCode: errorCode,
            timestamp: now()
          };
          saveBlacklist();

          // Loading overlay already hides YouTube error, no need to hide player
          // Just skip to next video based on direction
          if (lastDirection < 0) prevVideo();
          else nextVideo();
        }
      }
    });
  }

  function startWatchdog() {
    playWatchdog = setTimeout(function () {
      nextVideo();
    }, 15000); // Increased from 8s to 15s for Tizen TV
  }

  /* ===== Navigation ===== */

  function playCurrent() {
    var list = currentList();
    if (!list.length) {
      logError('No videos in current playlist', { channel: currentChannel() });
      return;
    }
    clampVideo();
    var videoId = list[videoIdx];

    // Skip blacklisted videos
    if (failedVideos[videoId]) {
      log('Skipping blacklisted video:', videoId);
      nextVideo();
      return;
    }

    log('Playing video', {
      channel: currentChannel(),
      videoIndex: videoIdx,
      totalVideos: list.length,
      videoId: videoId
    });

    createOrLoad(videoId);
    syncState();
  }

  function nextVideo() {
    showLoading(); // Show overlay BEFORE loading starts
    lastDirection = 1;
    videoIdx++;
    playCurrent();
  }

  function prevVideo() {
    showLoading(); // Show overlay BEFORE loading starts
    lastDirection = -1;
    videoIdx--;
    playCurrent();
  }

  function channelUp() {
    showLoading(); // Show overlay BEFORE loading starts
    channelIdx = (channelIdx - 1 + channels.length) % channels.length;
    videoIdx = storedPosition(currentChannel());
    log('Channel UP', { channel: currentChannel(), channelIdx: channelIdx });
    showNotification('📺 ' + currentListLabel(), 2000);
    playCurrent();
  }

  function channelDown() {
    showLoading(); // Show overlay BEFORE loading starts
    channelIdx = (channelIdx + 1) % channels.length;
    videoIdx = storedPosition(currentChannel());
    log('Channel DOWN', { channel: currentChannel(), channelIdx: channelIdx });
    showNotification('📺 ' + currentListLabel(), 2000);
    playCurrent();
  }

  function togglePause() {
    if (!player) return;
    var s = player.getPlayerState();
    if (s === YT.PlayerState.PLAYING) player.pauseVideo();
    else player.playVideo();
    showTitleBar();
  }

  /* ===== Remote ===== */

  if (document.body) {
    document.body.tabIndex = -1;
    document.body.classList.add("splash-active");
  }

  if (playerEl) {
    playerEl.addEventListener("click", function () {
      setTimeout(function () {
        if (document.body) document.body.focus();
      }, 0);
    });
  }

  document.addEventListener("keydown", function (e) {
    userInteracted = true;
    if (player && player.unMute) player.unMute();
    var t = now();
    if (t - lastKeyTs < 120) return;
    lastKeyTs = t;

    var keyCode = e.keyCode;

    switch (keyCode) {
      // Arrow keys
      case 38: channelUp(); break;           // Arrow Up
      case 40: channelDown(); break;         // Arrow Down
      case 37: prevVideo(); break;           // Arrow Left
      case 39: nextVideo(); break;           // Arrow Right

      // Media remote keys - Play/Pause
      case 415: togglePause(); break;        // MediaPlay
      case 19: togglePause(); break;         // MediaPause
      case 463: togglePause(); break;        // PlayPause (Samsung)
      case 10252: togglePause(); break;      // PlayPause (LG WebOS)
      case 179: togglePause(); break;        // MediaPlayPause (generic)
      case 32: togglePause(); break;         // Space bar (fallback)

      // Media remote keys - Track Next/Previous
      case 417: nextVideo(); break;          // MediaTrackNext / MediaFastForward
      case 412: prevVideo(); break;          // MediaTrackPrevious / MediaRewind
      case 176: nextVideo(); break;          // MediaNextTrack (generic)
      case 177: prevVideo(); break;          // MediaPreviousTrack (generic)

      // Channel Up/Down (additional keycodes)
      case 427: channelUp(); break;          // ChannelUp (Samsung)
      case 428: channelDown(); break;        // ChannelDown (Samsung)
      case 33: channelUp(); break;           // PageUp (fallback)
      case 34: channelDown(); break;         // PageDown (fallback)

      // OK/Enter button (short press = pause, long press = favorite)
      case 13:
        if (!okLongPressTimer) {
          okLongPressHandled = false;
          okLongPressTimer = setTimeout(function () {
            okLongPressHandled = true;
            okLongPressTimer = null;
            toggleFavorite();
          }, 700);
        }
        break;

      // Back button (WebTV/Smart TV)
      case 461: // Back (Samsung Smart TV)
      case 10182: // Back (LG WebOS)
      case 8: // Backspace (fallback)
        e.preventDefault();
        log('Back button pressed - exiting app');
        try {
          if (typeof tizen !== 'undefined') {
            tizen.application.getCurrentApplication().exit();
          } else if (typeof webOS !== 'undefined') {
            webOS.platformBack();
          } else {
            window.history.back();
          }
        } catch (err) {
          log('Exit failed', err);
        }
        break;

      // Exit button (Tizen specific)
      case 10009:
        e.preventDefault();
        try { tizen.application.getCurrentApplication().exit(); } catch (_) {}
        break;

      // Color buttons (optional - for future features)
      case 403: // Red button
      case 404: // Green button
      case 405: // Yellow button
      case 406: // Blue button
        log('Color button pressed', { keyCode: keyCode });
        // Reserved for future features
        break;

      // Stop button
      case 413: // MediaStop
      case 178: // MediaStop (generic)
        togglePause();
        break;

      // Info/Details button
      case 457: // Info button (Samsung)
        showTitleBar();
        break;
    }
  });

  document.addEventListener("keyup", function (e) {
    if (e.keyCode !== 13) return;
    if (okLongPressTimer) {
      clearTimeout(okLongPressTimer);
      okLongPressTimer = null;
    }
    if (!okLongPressHandled) {
      togglePause();
    }
    okLongPressHandled = false;
  });

  document.addEventListener("tizenhwkey", function (e) {
    log('Tizen HW key', { keyName: e.keyName });

    if (e.keyName === "back") {
      e.preventDefault();
      log('Tizen back button - exiting app');
      try {
        tizen.application.getCurrentApplication().exit();
      } catch (err) {
        log('Tizen exit failed', err);
      }
    }
  });

  /* ===== Bootstrap ===== */

  function loadPlaylists(cb) {
    log('Loading playlists from', PLAYLIST_URL);

    var cached = loadCachedPlaylists();
    if (cached) {
      log('Using cached playlists');
      applyPlaylists(cached, cb, true);
    }

    var xhr = new XMLHttpRequest();
    xhr.open("GET", PLAYLIST_URL + "?t=" + now(), true);
    xhr.timeout = 8000;
    xhr.onload = function () {
      if (xhr.status < 200 || xhr.status >= 300) {
        logError("Failed to fetch playlists", { status: xhr.status, statusText: xhr.statusText });
        showError("Nie można pobrać playlist");
        schedulePlaylistRetry(cb);
        return;
      }
      try {
        var parsed = JSON.parse(xhr.responseText);
        if (!parsed || typeof parsed !== "object") throw new Error("Invalid playlists");
        log('Playlists loaded successfully', { channels: Object.keys(parsed).length });
        storeCachedPlaylists(parsed);
        applyPlaylists(parsed, cb, false);
      } catch (err) {
        logError("Failed to parse playlists", { error: err.message });
        showError("Błąd danych playlist");
        schedulePlaylistRetry(cb);
      }
    };
    xhr.onerror = function () {
      logError("Network error loading playlists");
      showError("Błąd sieci przy pobieraniu playlist");
      schedulePlaylistRetry(cb);
    };
    xhr.ontimeout = function () {
      logError("Timeout loading playlists", { timeout: xhr.timeout });
      showError("Przekroczono czas pobierania playlist");
      schedulePlaylistRetry(cb);
    };
    xhr.send();
  }

  function applyPlaylists(data, cb, fromCache) {
    playlists = data;
    channels = buildChannels(playlists);
    log('Applied playlists', {
      fromCache: fromCache,
      totalChannels: channels.length,
      channels: channels.join(', ')
    });

    if (!playlistsReady) {
      var preferredChannel = state.channel || DEFAULT_CHANNEL;
      channelIdx = Math.max(0, channels.indexOf(preferredChannel));
      videoIdx = storedPosition(currentChannel());
      playlistsReady = true;
      log('App ready', {
        startChannel: currentChannel(),
        startVideoIdx: videoIdx
      });
      hideSplash();
      cb();
      return;
    }
    if (!fromCache && channelIdx >= channels.length) {
      channelIdx = 0;
      log('Channel index reset', { newChannelIdx: channelIdx });
    }
  }

  function hideSplash() {
    if (document.body) document.body.classList.remove("splash-active");
  }

  function schedulePlaylistRetry(cb) {
    if (playlistsReady) return;
    setTimeout(function () {
      loadPlaylists(cb);
    }, 5000);
  }

  function loadCachedPlaylists() {
    if (!window.localStorage) return null;
    try {
      var raw = localStorage.getItem(PLAYLIST_CACHE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      return parsed;
    } catch (err) {
      return null;
    }
  }

  function storeCachedPlaylists(data) {
    if (!window.localStorage) return;
    try {
      localStorage.setItem(PLAYLIST_CACHE_KEY, JSON.stringify(data));
    } catch (err) {}
  }

  function maybeStart() {
    if (!ytReady || !playlists) return;
    playCurrent();
  }

  /* ===== Bootstrap ===== */

  // Load persistent blacklist from localStorage
  failedVideos = loadBlacklist();
  log('Blacklist loaded', { count: Object.keys(failedVideos).length });

  loadPlaylists(maybeStart);
})();
