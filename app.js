(function () {
  var PLAYLIST_URL = "https://wantmymtv.xyz/public/mtv-playlists.json";
  var DEFAULT_CHANNEL = "80s";

  var playlists = null;
  var channels = [];
  var channelIdx = 0;
  var videoIdx = 0;
  var state = loadState();

  var player = null;
  var ytReady = false;
  var lastKeyTs = 0;
  var playWatchdog = null;

  var titleBar = document.getElementById("titleBar");
  var artistEl = document.getElementById("artist");
  var titleEl = document.getElementById("title");

  /* ===== Helpers ===== */

  function now() { return Date.now(); }

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
    var fallback = { channel: DEFAULT_CHANNEL, positions: {}, shuffles: {} };
    if (!window.localStorage) return fallback;
    try {
      var raw = localStorage.getItem("wmmtv-state-v1");
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return fallback;
      parsed.positions = parsed.positions || {};
      parsed.shuffles = parsed.shuffles || {};
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

  function normalizePlaylistEntry(entry) {
    if (!entry) return { videos: [], order: "sequential" };
    if (Array.isArray(entry)) {
      return { videos: entry, order: "sequential" };
    }
    if (typeof entry === "object") {
      var videos = entry.videos || entry.list || entry.items || [];
      var order = entry.order || entry.mode || "";
      var wantsRandom = entry.shuffle || entry.random;
      if (!order && wantsRandom) order = "random";
      order = (order === "random" || order === "shuffle") ? "random" : "sequential";
      return { videos: videos, order: order };
    }
    return { videos: [], order: "sequential" };
  }

  function playlistForChannel(channel) {
    if (!playlists) return [];
    var entry = normalizePlaylistEntry(playlists[channel]);
    var list = entry.videos || [];
    if (!list.length) return [];
    if (entry.order === "random") {
      var order = ensureShuffle(channel, list.length);
      return order.map(function (idx) { return list[idx]; });
    }
    return list;
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

  function updateTitle() {
    if (!player || !player.getVideoData) return;
    var data = player.getVideoData();
    var parsed = parseTitle(data.title || "");
    artistEl.textContent = parsed.artist;
    titleEl.textContent = parsed.title;
    showTitleBar();
  }

  /* ===== YouTube ===== */

  window.onYouTubeIframeAPIReady = function () {
    ytReady = true;
    maybeStart();
  };

  function createOrLoad(videoId) {
    if (!ytReady || !videoId) return;

    clearTimeout(playWatchdog);

    if (player && player.loadVideoById) {
      player.loadVideoById(videoId);
      startWatchdog();
      return;
    }

    player = new YT.Player("player", {
      videoId: videoId,
      width: "1920",
      height: "1080",
      playerVars: {
        autoplay: 1,
        controls: 0,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        origin: location.origin
      },
      events: {
        onReady: function (e) {
          e.target.unMute();
          e.target.playVideo();
          startWatchdog();
        },
        onStateChange: function (e) {
          if (e.data === YT.PlayerState.PLAYING) {
            clearTimeout(playWatchdog);
            updateTitle();
          }
          if (e.data === YT.PlayerState.ENDED) nextVideo();
        },
        onError: function () {
          nextVideo(); // 🔒 zabezpieczenie
        }
      }
    });
  }

  function startWatchdog() {
    playWatchdog = setTimeout(function () {
      nextVideo();
    }, 8000);
  }

  /* ===== Navigation ===== */

  function playCurrent() {
    var list = currentList();
    if (!list.length) return;
    clampVideo();
    createOrLoad(list[videoIdx]);
    syncState();
  }

  function nextVideo() {
    videoIdx++;
    playCurrent();
  }

  function prevVideo() {
    videoIdx--;
    playCurrent();
  }

  function channelUp() {
    channelIdx = (channelIdx - 1 + channels.length) % channels.length;
    videoIdx = storedPosition(currentChannel());
    playCurrent();
  }

  function channelDown() {
    channelIdx = (channelIdx + 1) % channels.length;
    videoIdx = storedPosition(currentChannel());
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

  document.addEventListener("keydown", function (e) {
    var t = now();
    if (t - lastKeyTs < 120) return;
    lastKeyTs = t;

    switch (e.keyCode) {
      case 38: channelUp(); break;
      case 40: channelDown(); break;
      case 37: prevVideo(); break;
      case 39: nextVideo(); break;
      case 13: togglePause(); break;
      case 10009:
        try { tizen.application.getCurrentApplication().exit(); } catch (_) {}
        break;
    }
  });

  /* ===== Bootstrap ===== */

  function loadPlaylists(cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", PLAYLIST_URL + "?t=" + now(), true);
    xhr.onload = function () {
      playlists = JSON.parse(xhr.responseText);
      channels = safeChannels(playlists);
      var preferredChannel = state.channel || DEFAULT_CHANNEL;
      channelIdx = Math.max(0, channels.indexOf(preferredChannel));
      videoIdx = storedPosition(currentChannel());
      cb();
    };
    xhr.send();
  }

  function maybeStart() {
    if (!ytReady || !playlists) return;
    playCurrent();
  }

  loadPlaylists(maybeStart);
})();
