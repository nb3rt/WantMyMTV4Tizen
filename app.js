(function () {
  // ===== Config =====
  var PLAYLIST_URL = "https://wantmymtv.xyz/public/mtv-playlists.json";
  var DEFAULT_CHANNEL = "80s";

  // ===== UI refs =====
  var dbgEl = document.getElementById("dbg");
  var statusEl = document.getElementById("status");

  function log() {
    try {
      var s = [].slice.call(arguments).join(" ");
      if (dbgEl) dbgEl.textContent = s + "\n" + dbgEl.textContent;
    } catch (e) {}
  }
  window.onerror = function (m, u, l, c) {
    log("ERR:", m, "@", l + ":" + c);
  };

  function setStatus(s) { if (statusEl) statusEl.textContent = s; }

  // ===== State =====
  var playlists = null;   // channel -> [videoIds]
  var channels = [];
  var channelIdx = 0;
  var videoIdx = 0;

  var ytReady = false;
  var player = null;
  var lastKeyTs = 0;

  function now() { return new Date().getTime(); }

  function safeGetChannelList(obj) {
    var keys = [];
    for (var k in obj) {
      if (!obj.hasOwnProperty(k)) continue;
      if (obj[k] && obj[k].length) keys.push(k);
    }
    if (!keys.length) {
      for (var k2 in obj) if (obj.hasOwnProperty(k2)) keys.push(k2);
    }
    keys.sort();
    return keys;
  }

  function setDefaultChannelIndex() {
    channelIdx = 0;
    for (var i = 0; i < channels.length; i++) {
      if (channels[i] === DEFAULT_CHANNEL) { channelIdx = i; break; }
    }
  }

  function currentChannel() {
    if (!channels.length) return DEFAULT_CHANNEL;
    if (channelIdx < 0) channelIdx = 0;
    if (channelIdx >= channels.length) channelIdx = channels.length - 1;
    return channels[channelIdx];
  }

  function currentList() {
    if (!playlists) return [];
    return playlists[currentChannel()] || [];
  }

  function clampVideoIndex() {
    var list = currentList();
    if (!list.length) { videoIdx = 0; return; }
    if (videoIdx < 0) videoIdx = list.length - 1;
    if (videoIdx >= list.length) videoIdx = 0;
  }

  function updateHUD(extra) {
    var ch = currentChannel();
    var list = currentList();
    var count = list.length || 0;
    var pos = count ? (videoIdx + 1) : 0;
    setStatus("Kanał: " + ch + " | " + pos + "/" + count + (extra ? (" | " + extra) : ""));
  }

  // ===== Load playlists (XHR, ES5) =====
  function loadPlaylistsXHR(cb) {
    updateHUD("Ładuję playlisty…");
    log("Loading playlists:", PLAYLIST_URL);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", PLAYLIST_URL + "?t=" + now(), true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          playlists = JSON.parse(xhr.responseText);
          channels = safeGetChannelList(playlists);
          setDefaultChannelIndex();
          videoIdx = 0;

          log("Playlists OK. Channels:", channels.length);
          updateHUD("Playlisty OK");
          cb(true);
        } catch (e) {
          log("Playlist JSON parse error:", e);
          updateHUD("Błąd JSON");
          cb(false);
        }
      } else {
        log("Playlist XHR failed. status=", xhr.status);
        updateHUD("Playlist load fail (" + xhr.status + ")");
        cb(false);
      }
    };

    try { xhr.send(null); } catch (e2) {
      log("Playlist XHR exception:", e2);
      updateHUD("Wyjątek XHR");
      cb(false);
    }
  }

  // ===== YouTube =====
  window.onYouTubeIframeAPIReady = function () {
    ytReady = true;
    log("YT API READY");
    maybeStart();
  };

  function createOrLoad(videoId) {
    if (!ytReady) return;
    if (!videoId) { updateHUD("Brak videoId"); return; }

    if (player && typeof player.loadVideoById === "function") {
      try {
        player.loadVideoById({ videoId: videoId });
        updateHUD("▶");
      } catch (e) {
        log("loadVideoById error:", e);
        updateHUD("Błąd loadVideoById");
      }
      return;
    }

    log("Creating YT.Player:", videoId);
    player = new YT.Player("player", {
      width: "1920",
      height: "1080",
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 1,
        rel: 0,
        playsinline: 1,
        modestbranding: 1,
        origin: location.origin
      },
      events: {
        onReady: function (e) {
          log("YT onReady");
          try { e.target.mute(); } catch (_) {}
          try { e.target.playVideo(); } catch (_) {}
          updateHUD("Gotowe");
        },
        onError: function (e) {
          log("YT onError code=", e.data);
          updateHUD("YT error " + e.data);
        },
        onStateChange: function (e) {
          log("YT state=", e.data);
        }
      }
    });
  }

  function playCurrent() {
    var list = currentList();
    if (!list.length) { updateHUD("Pusty kanał"); return; }
    clampVideoIndex();
    createOrLoad(list[videoIdx]);
  }

  function nextVideo() {
    var list = currentList();
    if (!list.length) { updateHUD("Pusty kanał"); return; }
    videoIdx++;
    clampVideoIndex();
    playCurrent();
  }

  function prevVideo() {
    var list = currentList();
    if (!list.length) { updateHUD("Pusty kanał"); return; }
    videoIdx--;
    clampVideoIndex();
    playCurrent();
  }

  function channelUp() {
    if (!channels.length) return;
    channelIdx--;
    if (channelIdx < 0) channelIdx = channels.length - 1;
    videoIdx = 0;
    updateHUD("Kanał ↑");
    playCurrent();
  }

  function channelDown() {
    if (!channels.length) return;
    channelIdx++;
    if (channelIdx >= channels.length) channelIdx = 0;
    videoIdx = 0;
    updateHUD("Kanał ↓");
    playCurrent();
  }

  function togglePausePlay() {
    if (!player) return;
    try {
      var st = player.getPlayerState ? player.getPlayerState() : null;
      if (st === 1) { player.pauseVideo(); updateHUD("⏸"); }
      else { player.playVideo(); updateHUD("▶"); }
    } catch (e) {
      log("toggle error:", e);
      updateHUD("Błąd pauza/play");
    }
  }

  // ===== Remote keys =====
  function handleKey(e) {
    var ts = now();
    if (ts - lastKeyTs < 120) return;
    lastKeyTs = ts;

    var code = e.keyCode;
    log("KEY:", code);

    if (code === 38) { channelUp(); return; }        // Up
    if (code === 40) { channelDown(); return; }      // Down
    if (code === 37) { prevVideo(); return; }        // Left
    if (code === 39) { nextVideo(); return; }        // Right
    if (code === 13) { togglePausePlay(); return; }  // OK/Enter

    // Play/Pause na niektórych pilotach
    if (code === 19 || code === 10252) { togglePausePlay(); return; }
    if (code === 415) { try { player && player.playVideo(); } catch(_){} updateHUD("▶"); return; }
    if (code === 413) { try { player && player.pauseVideo(); } catch(_){} updateHUD("⏸"); return; }

    // Back (Tizen)
    if (code === 10009) {
      updateHUD("Back");
      try { tizen.application.getCurrentApplication().exit(); } catch (_) {}
    }
  }
  document.addEventListener("keydown", handleKey);

  // ===== Bootstrap =====
  function maybeStart() {
    if (!playlists || !ytReady) return;
    updateHUD("Start");
    playCurrent();
  }

  loadPlaylistsXHR(function (ok) {
    if (!ok) log("Playlists failed (CORS/network).");
    maybeStart();
  });

  setTimeout(function () {
    log("WATCHDOG ytReady=", ytReady, "playlistsLoaded=", !!playlists);
  }, 5000);
})();
