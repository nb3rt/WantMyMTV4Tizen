(function () {
  var PLAYLIST_URL = "https://wantmymtv.xyz/public/mtv-playlists.json";
  var DEFAULT_CHANNEL = "80s";

  var playlists = null;
  var channels = [];
  var channelIdx = 0;
  var videoIdx = 0;

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
    return playlists ? (playlists[currentChannel()] || []) : [];
  }

  function clampVideo() {
    var l = currentList().length;
    if (!l) videoIdx = 0;
    else if (videoIdx < 0) videoIdx = l - 1;
    else if (videoIdx >= l) videoIdx = 0;
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
          e.target.mute();
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
    videoIdx = 0;
    playCurrent();
  }

  function channelDown() {
    channelIdx = (channelIdx + 1) % channels.length;
    videoIdx = 0;
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
      channelIdx = Math.max(0, channels.indexOf(DEFAULT_CHANNEL));
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
