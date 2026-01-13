"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// YouTube IFrame API with cache busting
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api?v=" + Date.now();
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
var allPlaylists = {};
var currentPlaylist = [];
var currentVideoIndex = 0;
var currentChannel = null;
var databaseLoaded = false;
var isPlayingCommercial = false;
var videosSinceLastCommercial = 0;
var lastCommercialPlayed = localStorage.getItem('lastCommercial') || null;
var videoBeforeCommercial = null;

// Playlist playback state
var isPlaylistMode = false;
var userPlaylistVideos = [];
var userPlaylistIndex = 0;

// Channel metadata - VH1 POP-UP VIDEO ADDED AFTER MTV2
var channelInfo = {
  '1stday': {
    name: 'MTV 1st Day',
    icon: '📺'
  },
  'liveaid': {
    name: 'LIVE AID 1985',
    icon: '🎸'
  },
  'grateful': {
    name: 'GRATEFUL FOR THE MUSIC',
    icon: '☠️'
  },
  'mtv2': {
    name: 'MTV2',
    icon: '📺'
  },
  'popupvideo': {
    name: 'VH1 Pop-Up Video',
    icon: '💭'
  },
  'sonidolatino': {
    name: 'SONIDO LATINO',
    icon: '🔥'
  },
  'amp': {
    name: 'AMP',
    icon: '🔊'
  },
  'trl': {
    name: 'TRL',
    icon: '🎤'
  },
  '120minutes': {
    name: '120 Minutes',
    icon: '🎸'
  },
  'unplugged': {
    name: 'MTV Unplugged',
    icon: '🔌'
  },
  '70s': {
    name: 'MTV 70s',
    icon: '🪩'
  },
  '80s': {
    name: 'MTV 80s',
    icon: '📼'
  },
  'raps': {
    name: 'Yo! MTV Raps',
    icon: '🎤'
  },
  '90s': {
    name: 'MTV 90s',
    icon: '💿'
  },
  '2000s': {
    name: 'MTV 2000s',
    icon: '💽'
  },
  '2010s': {
    name: 'MTV 2010s',
    icon: '📱'
  },
  '2020s': {
    name: 'MTV 2020s',
    icon: '🚀'
  },
  'metal': {
    name: 'Headbangers Ball',
    icon: '🤘'
  },
  'club': {
    name: 'CLUB MTV',
    icon: '🎧'
  },
  'all': {
    name: 'SHUFFLE ALL',
    icon: '🌀'
  }
};

// Load playlists from JSON file
function loadPlaylists() {
  return _loadPlaylists.apply(this, arguments);
}
function _loadPlaylists() {
  _loadPlaylists = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var response, data, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          _context.n = 1;
          return fetch('public/mtv-playlists.json');
        case 1:
          response = _context.v;
          if (!response.ok) {
            _context.n = 3;
            break;
          }
          _context.n = 2;
          return response.json();
        case 2:
          data = _context.v;
          allPlaylists = data;
          databaseLoaded = true;
          updateStats(data);
          return _context.a(2);
        case 3:
          _context.n = 5;
          break;
        case 4:
          _context.p = 4;
          _t = _context.v;
          console.log('Error loading playlists:', _t);
        case 5:
          return _context.a(2);
      }
    }, _callee, null, [[0, 4]]);
  }));
  return _loadPlaylists.apply(this, arguments);
}
function updateStats(data) {
  var statsEl = document.getElementById('stats');
  var totalVideos = 0;
  Object.keys(data).forEach(function (key) {
    if (key !== 'commercials' && key !== '1stday' && key !== 'grateful' && key !== 'liveaid') {
      totalVideos += data[key].length;
    }
  });
  var channelCount = Object.keys(data).filter(function (k) {
    return k !== 'commercials' && k !== '1stday' && k !== 'grateful' && k !== 'liveaid';
  }).length;
  statsEl.innerHTML = "\n        <h4>DATABASE LOADED</h4>\n        <p>\uD83D\uDCF9 Total Videos: ".concat(totalVideos.toLocaleString(), "</p>\n        <p>\uD83D\uDCFA Channels: ").concat(channelCount, "</p>\n        <p style=\"color: #0f0;\">\u2713 Ready to Rock</p>\n    ");
  var totalCountEl = document.getElementById('totalVideoCount');
  if (totalCountEl) {
    totalCountEl.textContent = totalVideos.toLocaleString();
  }
}
function renderChannels() {
  var channelsEl = document.getElementById('channels');
  channelsEl.innerHTML = '';

  // VH1 POP-UP VIDEO ADDED IN SORT ORDER AFTER MTV2
  var sortedKeys = ['1stday', 'liveaid', 'grateful', 'mtv2', 'popupvideo', 'sonidolatino', 'amp', 'trl', '120minutes', 'unplugged', '70s', '80s', '90s', '2000s', '2010s', '2020s', 'raps', 'metal', 'club', 'all'];
  sortedKeys.forEach(function (key) {
    var info = channelInfo[key];
    var btn = document.createElement('button');
    btn.className = 'channel-btn' + (key === '1stday' ? ' active' : '');
    btn.dataset.channel = key;
    var videoCount = 0;
    if (key === 'all') {
      videoCount = Object.keys(allPlaylists).reduce(function (total, k) {
        if (k !== 'commercials' && k !== '1stday' && k !== 'grateful' && k !== 'liveaid') {
          var _allPlaylists$k;
          return total + (((_allPlaylists$k = allPlaylists[k]) === null || _allPlaylists$k === void 0 ? void 0 : _allPlaylists$k.length) || 0);
        }
        return total;
      }, 0);
    } else {
      var _allPlaylists$key;
      videoCount = ((_allPlaylists$key = allPlaylists[key]) === null || _allPlaylists$key === void 0 ? void 0 : _allPlaylists$key.length) || 0;
    }
    if (key === '1stday') {
      btn.innerHTML = "\n                ".concat(info.icon, " ").concat(info.name, "\n                <span class=\"video-count\">").concat(videoCount, "</span>\n                <div class=\"channel-info-icon\" id=\"info-trigger\">\u2139</div>\n            ");
    } else {
      btn.innerHTML = "\n                ".concat(info.icon, " ").concat(info.name, "\n                <span class=\"video-count\">").concat(videoCount, "</span>\n            ");
    }
    btn.addEventListener('click', function () {
      document.querySelectorAll('.channel-btn').forEach(function (b) {
        return b.classList.remove('active');
      });
      btn.classList.add('active');
      loadChannel(key);
    });
    channelsEl.appendChild(btn);
  });
  currentChannel = '1stday';
}
function onYouTubeIframeAPIReady() {
  loadPlaylists().then(function () {
    renderChannels();
    if (currentChannel) {
      loadChannel(currentChannel);
    }
  });
}
function loadChannel(channel) {
  // Exit playlist mode when switching channels
  stopPlaylist();
  currentChannel = channel;
  videosSinceLastCommercial = 0;
  var sourcePlaylist = [];
  if (channel === 'all') {
    sourcePlaylist = [].concat(_toConsumableArray(allPlaylists['70s'] || []), _toConsumableArray(allPlaylists['80s'] || []), _toConsumableArray(allPlaylists['raps'] || []), _toConsumableArray(allPlaylists['90s'] || []), _toConsumableArray(allPlaylists['2000s'] || []), _toConsumableArray(allPlaylists['2010s'] || []), _toConsumableArray(allPlaylists['2020s'] || []));
  } else {
    sourcePlaylist = _toConsumableArray(allPlaylists[channel] || []);
  }

  // SPECIAL HANDLING FOR CHANNELS
  // LIVEAID - PLAY SEQUENTIALLY (NO SHUFFLE)
  // GRATEFUL - FIRST VIDEO PLAYS FIRST, REST SHUFFLE
  // 1STDAY - PLAY SEQUENTIALLY
  // TRL - CARSON DALY FIRST, THEN SHUFFLE
  // MTV2 - SHUFFLE RANDOMLY
  // POPUPVIDEO - SHUFFLE RANDOMLY
  // SONIDO LATINO - SHUFFLE RANDOMLY
  // AMP - SHUFFLE RANDOMLY
  if (channel === 'liveaid') {
    // LIVE AID 1985: Play in exact order - this is a historic concert setlist
    currentPlaylist = sourcePlaylist;
  } else if (channel === 'grateful') {
    // GRATEFUL: First video (Bob Weir intro) plays first, then shuffle the rest
    if (sourcePlaylist.length > 1) {
      var firstVideo = sourcePlaylist[0]; // Bob Weir intro
      var restOfVideos = shuffleArray(sourcePlaylist.slice(1)); // Shuffle the rest
      currentPlaylist = [firstVideo].concat(_toConsumableArray(restOfVideos));
    } else {
      currentPlaylist = sourcePlaylist;
    }
  } else if (channel === '1stday') {
    currentPlaylist = sourcePlaylist;
  } else if (channel === 'trl') {
    // TRL: First video (Carson Daly intro) plays first, then shuffle the rest
    if (sourcePlaylist.length > 1) {
      var _firstVideo = sourcePlaylist[0]; // Carson Daly intro
      var _restOfVideos = shuffleArray(sourcePlaylist.slice(1)); // Shuffle the countdown
      currentPlaylist = [_firstVideo].concat(_toConsumableArray(_restOfVideos));
    } else {
      currentPlaylist = sourcePlaylist;
    }
  } else if (channel === 'mtv2') {
    // MTV2 - SHUFFLE RANDOMLY
    currentPlaylist = shuffleArray(sourcePlaylist);
  } else if (channel === 'popupvideo') {
    // VH1 POP-UP VIDEO - SHUFFLE RANDOMLY
    currentPlaylist = shuffleArray(sourcePlaylist);
  } else if (channel === 'sonidolatino') {
    // SONIDO LATINO - SHUFFLE RANDOMLY
    currentPlaylist = shuffleArray(sourcePlaylist);
  } else if (channel === 'amp') {
    // AMP - SHUFFLE RANDOMLY
    currentPlaylist = shuffleArray(sourcePlaylist);
  } else {
    currentPlaylist = shuffleArray(sourcePlaylist);
  }
  currentVideoIndex = 0;
  if (player) {
    player.loadVideoById(currentPlaylist[0]);
    updateNowPlaying();
  } else {
    player = new YT.Player('player', {
      height: '100%',
      width: '100%',
      videoId: currentPlaylist[0],
      playerVars: {
        autoplay: 1,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3,
        fs: 1,
        playsinline: 1
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError
      }
    });
  }
}
function onPlayerReady(event) {
  document.getElementById('loading').style.display = 'none';
  event.target.playVideo();
  updateNowPlaying();
  setTimeout(function () {
    if (player && player.getPlayerState) {
      var state = player.getPlayerState();
      if (state === 1 || state === 2) {
        var currentTime = player.getCurrentTime();
        player.seekTo(currentTime, true);
      }
    }
  }, 500);
  setTimeout(function () {
    if (player && player.getPlayerState) {
      var state = player.getPlayerState();
      if (state === 1 || state === 2) {
        var currentTime = player.getCurrentTime();
        player.seekTo(currentTime, true);
      }
    }
  }, 1000);
  setTimeout(function () {
    if (player && player.getPlayerState) {
      var state = player.getPlayerState();
      if (state === 1 || state === 2) {
        var currentTime = player.getCurrentTime();
        player.seekTo(currentTime, true);
      }
    }
  }, 1500);
  var volumeSlider = document.getElementById('volumeSlider');
  player.setVolume(volumeSlider.value);
}
function onPlayerStateChange(event) {
  // Update metadata display when video starts playing
  if (event.data === YT.PlayerState.PLAYING) {
    updateNowPlaying();

    // Show MTV-style title overlay
    setTimeout(showVideoTitleOverlay, 1000);
  }
  if (event.data === YT.PlayerState.ENDED) {
    // Check if in playlist mode
    if (isPlaylistMode) {
      playNextPlaylistVideo();
    } else {
      playNextVideo();
    }
  }
}
function showVideoTitleOverlay() {
  // Don't show overlay for commercials
  if (isPlayingCommercial) return;
  if (!player || !player.getVideoData) return;
  try {
    var videoData = player.getVideoData();
    if (!videoData || !videoData.title) return;
    var title = videoData.title || '';
    var artist = videoData.author || '';
    if (!title) return;

    // Clean up title - remove VEVO and other cruft
    title = title.replace(/\s*\(Official Music Video\)/gi, '').replace(/\s*\[Official Music Video\]/gi, '').replace(/\s*-\s*VEVO$/i, '').replace(/VEVO\s*$/i, '').replace(/\s+/g, ' ').trim();

    // Clean up artist name too
    artist = artist.replace(/VEVO\s*$/i, '').replace(/\s+/g, ' ').trim();

    // Remove any existing overlay
    var existing = document.querySelector('.mtv-title-overlay');
    if (existing) existing.remove();

    // Create overlay
    var overlay = document.createElement('div');
    overlay.className = 'mtv-title-overlay';
    overlay.innerHTML = "\n            <div class=\"mtv-title-artist\">".concat(artist, "</div>\n            <div class=\"mtv-title-song\">").concat(title, "</div>\n        ");

    // Add to video player
    var tvScreen = document.querySelector('.tv-screen');
    if (tvScreen) {
      tvScreen.appendChild(overlay);

      // Fade in
      setTimeout(function () {
        return overlay.classList.add('show');
      }, 100);

      // Fade out after 6 seconds
      setTimeout(function () {
        overlay.classList.remove('show');
        setTimeout(function () {
          return overlay.remove();
        }, 1000);
      }, 6000);
    }
  } catch (e) {
    console.log('Could not show title overlay:', e);
  }
}
function onPlayerError(event) {
  var badVideoId = isPlaylistMode ? userPlaylistVideos[userPlaylistIndex] : currentPlaylist[currentVideoIndex];
  console.log("Error playing video ".concat(badVideoId, ": Error code ").concat(event.data, " - Auto-skipping..."));
  if (isPlaylistMode) {
    // Skip to next in user playlist
    playNextPlaylistVideo();
    return;
  }
  if (isPlayingCommercial) {
    console.log('Commercial failed to play, resuming playlist...');
    isPlayingCommercial = false;
    playNextVideo();
    return;
  }
  currentVideoIndex++;
  if (currentVideoIndex >= currentPlaylist.length) {
    currentVideoIndex = 0;
  }
  if (currentPlaylist.length > 0) {
    player.loadVideoById(currentPlaylist[currentVideoIndex]);
    setTimeout(function () {
      if (player && player.playVideo) {
        player.playVideo();
      }
    }, 500);
    updateNowPlaying();
  }
}
function playRandomCommercial() {
  if (!allPlaylists['commercials'] || allPlaylists['commercials'].length === 0) {
    console.log('No commercials available, skipping...');
    playNextVideo();
    return;
  }
  var commercials = allPlaylists['commercials'];
  videoBeforeCommercial = currentPlaylist[currentVideoIndex];
  if (commercials.length === 1) {
    var commercial = commercials[0];
    console.log('🎬 COMMERCIAL BREAK! Playing:', commercial);
    lastCommercialPlayed = commercial;
    localStorage.setItem('lastCommercial', commercial);
    isPlayingCommercial = true;
    videosSinceLastCommercial = 0;
    player.loadVideoById(commercial);
    setTimeout(function () {
      if (player && player.playVideo) {
        player.playVideo();
      }
    }, 500);
    return;
  }
  var randomCommercial;
  do {
    randomCommercial = commercials[Math.floor(Math.random() * commercials.length)];
  } while (randomCommercial === lastCommercialPlayed && commercials.length > 1);
  console.log('🎬 COMMERCIAL BREAK! Playing:', randomCommercial);
  console.log('   (Previous commercial was:', lastCommercialPlayed, ')');
  lastCommercialPlayed = randomCommercial;
  localStorage.setItem('lastCommercial', randomCommercial);
  isPlayingCommercial = true;
  videosSinceLastCommercial = 0;
  player.loadVideoById(randomCommercial);
  setTimeout(function () {
    if (player && player.playVideo) {
      player.playVideo();
    }
  }, 500);
}
function playNextVideo() {
  if (isPlayingCommercial) {
    console.log('Commercial ended, resuming playlist...');
    isPlayingCommercial = false;
    currentVideoIndex++;
    if (currentVideoIndex >= currentPlaylist.length) {
      currentVideoIndex = 0;
    }
    if (currentPlaylist[currentVideoIndex] === videoBeforeCommercial) {
      console.log('⚠️ DETECTED REPLAY BUG - Skipping forward one more');
      currentVideoIndex++;
      if (currentVideoIndex >= currentPlaylist.length) {
        currentVideoIndex = 0;
      }
    }
    videoBeforeCommercial = null;
    console.log("\u2705 Loading video after commercial: index ".concat(currentVideoIndex));
    player.loadVideoById(currentPlaylist[currentVideoIndex]);
    setTimeout(function () {
      if (player && player.playVideo) {
        player.playVideo();
      }
    }, 500);
    updateNowPlaying();
    return;
  }
  videosSinceLastCommercial++;
  var randomInterval = Math.floor(Math.random() * 2) + 3;
  if (videosSinceLastCommercial >= randomInterval) {
    console.log("\uD83D\uDCFA Injecting commercial after ".concat(videosSinceLastCommercial, " videos"));
    playRandomCommercial();
    return;
  }
  currentVideoIndex++;
  if (currentVideoIndex >= currentPlaylist.length) {
    if (currentChannel === '1stday') {
      loadChannel('80s');
      document.querySelectorAll('.channel-btn').forEach(function (b) {
        return b.classList.remove('active');
      });
      document.querySelector('[data-channel="80s"]').classList.add('active');
      return;
    } else if (currentChannel === '70s') {
      loadChannel('80s');
      document.querySelectorAll('.channel-btn').forEach(function (b) {
        return b.classList.remove('active');
      });
      document.querySelector('[data-channel="80s"]').classList.add('active');
      return;
    } else if (currentChannel === '80s') {
      loadChannel('90s');
      document.querySelectorAll('.channel-btn').forEach(function (b) {
        return b.classList.remove('active');
      });
      document.querySelector('[data-channel="90s"]').classList.add('active');
      return;
    } else if (currentChannel === '90s') {
      loadChannel('2000s');
      document.querySelectorAll('.channel-btn').forEach(function (b) {
        return b.classList.remove('active');
      });
      document.querySelector('[data-channel="2000s"]').classList.add('active');
      return;
    } else if (currentChannel === '2000s') {
      loadChannel('2010s');
      document.querySelectorAll('.channel-btn').forEach(function (b) {
        return b.classList.remove('active');
      });
      document.querySelector('[data-channel="2010s"]').classList.add('active');
      return;
    } else if (currentChannel === '2010s') {
      loadChannel('2020s');
      document.querySelectorAll('.channel-btn').forEach(function (b) {
        return b.classList.remove('active');
      });
      document.querySelector('[data-channel="2020s"]').classList.add('active');
      return;
    } else if (currentChannel === '2020s') {
      loadChannel('1stday');
      document.querySelectorAll('.channel-btn').forEach(function (b) {
        return b.classList.remove('active');
      });
      document.querySelector('[data-channel="1stday"]').classList.add('active');
      return;
    } else if (currentChannel === 'liveaid') {
      // LIVE AID - LOOP BACK TO START (PLAY IN ORDER AGAIN)
      currentPlaylist = _toConsumableArray(allPlaylists['liveaid'] || []);
      currentVideoIndex = 0;
    } else if (currentChannel === 'grateful') {
      // GRATEFUL DEAD - RESHUFFLE (keep first video at start)
      var sourcePlaylist = _toConsumableArray(allPlaylists['grateful'] || []);
      if (sourcePlaylist.length > 1) {
        var firstVideo = sourcePlaylist[0];
        var restOfVideos = shuffleArray(sourcePlaylist.slice(1));
        currentPlaylist = [firstVideo].concat(_toConsumableArray(restOfVideos));
      } else {
        currentPlaylist = sourcePlaylist;
      }
      currentVideoIndex = 0;
    } else if (currentChannel === 'mtv2') {
      // MTV2 - RESHUFFLE RANDOMLY
      currentPlaylist = shuffleArray(_toConsumableArray(allPlaylists['mtv2'] || []));
      currentVideoIndex = 0;
    } else if (currentChannel === 'popupvideo') {
      // VH1 POP-UP VIDEO - RESHUFFLE RANDOMLY
      currentPlaylist = shuffleArray(_toConsumableArray(allPlaylists['popupvideo'] || []));
      currentVideoIndex = 0;
    } else if (currentChannel === 'sonidolatino') {
      // SONIDO LATINO - RESHUFFLE RANDOMLY
      currentPlaylist = shuffleArray(_toConsumableArray(allPlaylists['sonidolatino'] || []));
      currentVideoIndex = 0;
    } else if (currentChannel === 'amp') {
      // AMP - RESHUFFLE RANDOMLY
      currentPlaylist = shuffleArray(_toConsumableArray(allPlaylists['amp'] || []));
      currentVideoIndex = 0;
    } else if (currentChannel === 'trl') {
      // TRL - RESHUFFLE RANDOMLY
      currentPlaylist = shuffleArray(_toConsumableArray(allPlaylists['trl'] || []));
      currentVideoIndex = 0;
    } else if (currentChannel === 'raps') {
      currentPlaylist = shuffleArray(_toConsumableArray(allPlaylists['raps'] || []));
      currentVideoIndex = 0;
    } else if (currentChannel === 'metal') {
      currentPlaylist = shuffleArray(_toConsumableArray(allPlaylists['metal'] || []));
      currentVideoIndex = 0;
    } else if (currentChannel === '120minutes') {
      // 120 MINUTES - RESHUFFLE RANDOMLY
      currentPlaylist = shuffleArray(_toConsumableArray(allPlaylists['120minutes'] || []));
      currentVideoIndex = 0;
    } else if (currentChannel === 'unplugged') {
      // UNPLUGGED - RESHUFFLE RANDOMLY
      currentPlaylist = shuffleArray(_toConsumableArray(allPlaylists['unplugged'] || []));
      currentVideoIndex = 0;
    } else if (currentChannel === 'club') {
      // CLUB MTV - RESHUFFLE RANDOMLY
      currentPlaylist = shuffleArray(_toConsumableArray(allPlaylists['club'] || []));
      currentVideoIndex = 0;
    } else {
      currentPlaylist = shuffleArray([].concat(_toConsumableArray(allPlaylists['70s'] || []), _toConsumableArray(allPlaylists['80s'] || []), _toConsumableArray(allPlaylists['raps'] || []), _toConsumableArray(allPlaylists['90s'] || []), _toConsumableArray(allPlaylists['2000s'] || []), _toConsumableArray(allPlaylists['2010s'] || []), _toConsumableArray(allPlaylists['2020s'] || [])));
      currentVideoIndex = 0;
    }
  }
  player.loadVideoById(currentPlaylist[currentVideoIndex]);
  updateNowPlaying();
}
function previousVideo() {
  if (isPlayingCommercial) {
    console.log('Cannot skip back during commercial');
    return;
  }
  if (isPlaylistMode) {
    playPreviousPlaylistVideo();
    return;
  }
  currentVideoIndex--;
  if (currentVideoIndex < 0) {
    currentVideoIndex = currentPlaylist.length - 1;
  }
  player.loadVideoById(currentPlaylist[currentVideoIndex]);
  updateNowPlaying();
}
function nextVideo() {
  if (isPlayingCommercial) {
    console.log('Skipping commercial...');
    isPlayingCommercial = false;
    videoBeforeCommercial = null;
    currentVideoIndex++;
    if (currentVideoIndex >= currentPlaylist.length) {
      currentVideoIndex = 0;
    }
    console.log("\u2705 Skipped commercial, loading video index ".concat(currentVideoIndex));
    player.loadVideoById(currentPlaylist[currentVideoIndex]);
    setTimeout(function () {
      if (player && player.playVideo) {
        player.playVideo();
      }
    }, 500);
    updateNowPlaying();
    return;
  }
  if (isPlaylistMode) {
    playNextPlaylistVideo();
    return;
  }
  playNextVideo();
}
function updateNowPlaying() {
  if (isPlaylistMode) {
    document.getElementById('current-video').textContent = "\uD83D\uDCFC Your Playlist (".concat(userPlaylistIndex + 1, "/").concat(userPlaylistVideos.length, ")");
  } else {
    var info = channelInfo[currentChannel];
    document.getElementById('current-video').textContent = "".concat(info.icon, " ").concat(info.name);
  }

  // Get video metadata from YouTube
  var displayText = isPlaylistMode ? "Video ".concat(userPlaylistIndex + 1, " of ").concat(userPlaylistVideos.length) : "Video ".concat(currentVideoIndex + 1, " of ").concat(currentPlaylist.length);
  if (player && player.getVideoData) {
    try {
      var videoData = player.getVideoData();
      if (videoData && videoData.title) {
        var title = videoData.title || '';
        var artist = videoData.author || '';
        if (title) {
          displayText = artist ? "".concat(artist, " - ").concat(title) : title;
        }
      }
    } catch (e) {
      console.log('Could not fetch video metadata:', e);
    }
  }
  document.getElementById('video-counter').textContent = displayText;
}
function shuffleArray(array) {
  var shuffled = _toConsumableArray(array);
  for (var i = shuffled.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var _ref = [shuffled[j], shuffled[i]];
    shuffled[i] = _ref[0];
    shuffled[j] = _ref[1];
  }
  return shuffled;
}
function openWelcomeModal() {
  document.getElementById('welcomeModal').classList.remove('hidden');
}
function closeWelcomeModal() {
  document.getElementById('welcomeModal').classList.add('hidden');
  localStorage.setItem('mtvRewindWelcomeSeen', 'true');
}
function closeMobileDonationModal() {
  document.getElementById('mobileDonationModal').classList.remove('show');
}
function showMobileDonationModal() {
  if (window.innerWidth < 1025) {
    setTimeout(function () {
      document.getElementById('mobileDonationModal').classList.add('show');
    }, 3000);
  }
}
var volumeSlider = document.getElementById('volumeSlider');
var volumePercentage = document.getElementById('volumePercentage');
var volumeIcon = document.querySelector('.volume-icon');
var isMuted = false;
var previousVolume = 70;
function updateVolume(volume) {
  if (player) {
    if (typeof player.setVolume === 'function') {
      player.setVolume(parseInt(volume));
    }
    if (player.getIframe && player.getIframe()) {
      var iframe = player.getIframe();
      if (iframe.contentWindow) {
        try {
          iframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'setVolume',
            args: [parseInt(volume)]
          }), '*');
        } catch (e) {}
      }
    }
  }
  volumePercentage.textContent = volume + '%';
  var percentage = volume / 100 * 100;
  volumeSlider.style.background = "linear-gradient(to right, #ffd700 0%, #ffd700 ".concat(percentage, "%, #333 ").concat(percentage, "%, #333 100%)");
  if (volume == 0) {
    volumeIcon.textContent = '🔇';
    isMuted = true;
  } else {
    volumeIcon.textContent = volume < 50 ? '🔉' : '🔊';
    isMuted = false;
  }
}
if (volumeSlider) {
  volumeSlider.addEventListener('input', function (e) {
    updateVolume(this.value);
  });
  volumeSlider.addEventListener('change', function (e) {
    updateVolume(this.value);
  });
  volumeSlider.addEventListener('touchstart', function (e) {});
  volumeSlider.addEventListener('touchmove', function (e) {
    updateVolume(this.value);
  });
  volumeSlider.addEventListener('touchend', function (e) {
    updateVolume(this.value);
  });
  volumeSlider.addEventListener('mouseup', function (e) {
    updateVolume(this.value);
  });
}
function toggleMute() {
  if (isMuted) {
    volumeSlider.value = previousVolume;
    if (player && player.setVolume) {
      player.setVolume(previousVolume);
    }
    volumePercentage.textContent = previousVolume + '%';
    volumeIcon.textContent = previousVolume < 50 ? '🔉' : '🔊';
    isMuted = false;
    var percentage = previousVolume / 100 * 100;
    volumeSlider.style.background = "linear-gradient(to right, #ffd700 0%, #ffd700 ".concat(percentage, "%, #333 ").concat(percentage, "%, #333 100%)");
  } else {
    previousVolume = volumeSlider.value;
    volumeSlider.value = 0;
    if (player && player.setVolume) {
      player.setVolume(0);
    }
    volumePercentage.textContent = '0%';
    volumeIcon.textContent = '🔇';
    isMuted = true;
    volumeSlider.style.background = "linear-gradient(to right, #ffd700 0%, #ffd700 0%, #333 0%, #333 100%)";
  }
}
var initialVolume = volumeSlider.value;
var initialPercentage = initialVolume / 100 * 100;
volumeSlider.style.background = "linear-gradient(to right, #ffd700 0%, #ffd700 ".concat(initialPercentage, "%, #333 ").concat(initialPercentage, "%, #333 100%)");

// FULLY BROKEN SLOT MACHINE COUNTER - TOO VIRAL TO TRACK
function updateCounterDisplay() {
  var counterEl = document.getElementById('visitor-count');
  if (!counterEl) return;

  // Create 7 individual spinning digits
  counterEl.innerHTML = '';
  counterEl.style.display = 'flex';
  counterEl.style.gap = '2px';
  counterEl.style.justifyContent = 'center';
  var _loop = function _loop() {
    var digitSpan = document.createElement('span');
    digitSpan.style.display = 'inline-block';
    digitSpan.style.minWidth = '1ch';
    digitSpan.style.textAlign = 'center';
    counterEl.appendChild(digitSpan);

    // Each digit spins at slightly different speed for chaos
    var speed = 80 + Math.random() * 100;
    setInterval(function () {
      var randomDigit = Math.floor(Math.random() * 10);
      digitSpan.textContent = randomDigit;

      // Random glitch colors
      var glitchRoll = Math.random();
      if (glitchRoll < 0.15) {
        // Darker glitch
        digitSpan.style.color = '#0a0';
        digitSpan.style.textShadow = '0 0 3px #0a0';
      } else if (glitchRoll < 0.25) {
        // Bright glitch
        digitSpan.style.color = '#0ff';
        digitSpan.style.textShadow = '0 0 8px #0ff';
      } else if (glitchRoll < 0.30) {
        // Red error glitch
        digitSpan.style.color = '#f00';
        digitSpan.style.textShadow = '0 0 5px #f00';
      } else {
        // Normal green
        digitSpan.style.color = '#0f0';
        digitSpan.style.textShadow = '0 0 5px #0f0';
      }
    }, speed);
  };
  for (var i = 0; i < 7; i++) {
    _loop();
  }
}

// Start the absolute chaos
updateCounterDisplay();

// Global tooltip for MTV 1st Day
var tooltip = document.createElement('div');
tooltip.className = 'global-tooltip';
tooltip.innerHTML = '<p>This is the true 1st full day of music videos from MTV\'s launch on 8/01/1981. Special thanks to <a href="https://www.npr.org/sections/therecord/2011/08/01/138988246/the-first-100-videos-played-on-mtv" target="_blank" rel="noopener noreferrer">NPR</a> for preserving this momentous day in music history.</p>';
document.body.appendChild(tooltip);
document.addEventListener('mouseover', function (e) {
  if (e.target.id === 'info-trigger' || e.target.closest('#info-trigger')) {
    tooltip.classList.add('show');
  }
});
document.addEventListener('mouseout', function (e) {
  if (e.target.id === 'info-trigger' || e.target.closest('#info-trigger')) {
    tooltip.classList.remove('show');
  }
});

// ============================================================================
// EASTER EGG PLAYLIST FEATURE WITH PLAYBACK
// ============================================================================

var logoClickCount = 0;
var logoClickTimer = null;
var TRIPLE_CLICK_DELAY = 500;
var SINGLE_CLICK_DELAY = 300;
function getCurrentVideoUrl() {
  if (!player || !player.getVideoData) return null;
  var videoData = player.getVideoData();
  if (!videoData || !videoData.video_id) return null;
  return "https://www.youtube.com/watch?v=".concat(videoData.video_id);
}
function addToPlaylist(url) {
  if (!url) {
    showNotification('❌ No video playing');
    return;
  }

  // Get current video metadata
  var title = null;
  var artist = null;
  if (player && player.getVideoData) {
    try {
      var videoData = player.getVideoData();
      if (videoData) {
        // Clean up title
        title = (videoData.title || '').replace(/\s*\(Official Music Video\)/gi, '').replace(/\s*\[Official Music Video\]/gi, '').replace(/\s*-\s*VEVO$/i, '').replace(/VEVO\s*$/i, '').replace(/\s+/g, ' ').trim();

        // Clean up artist
        artist = (videoData.author || '').replace(/VEVO\s*$/i, '').replace(/\s+/g, ' ').trim();
      }
    } catch (e) {
      console.log('Could not fetch video metadata for playlist:', e);
    }
  }
  var playlist = [];
  try {
    var stored = localStorage.getItem('mtvRewindPlaylist');
    if (stored) playlist = JSON.parse(stored);
  } catch (e) {
    console.error('Error loading playlist:', e);
  }

  // Check if already exists
  var existingIndex = playlist.findIndex(function (item) {
    return (typeof item === 'string' ? item : item.url) === url;
  });
  if (existingIndex !== -1) {
    showNotification('⚠️ Already in playlist');
    return;
  }

  // Add with metadata
  var displayTitle = artist && title ? "".concat(artist, " - ").concat(title) : title || null;
  playlist.push({
    url: url,
    title: displayTitle,
    artist: artist,
    videoTitle: title
  });
  try {
    localStorage.setItem('mtvRewindPlaylist', JSON.stringify(playlist));
    showNotification("\u2705 Saved! (".concat(playlist.length, " videos)"));
  } catch (e) {
    showNotification('❌ Failed to save');
  }
}
function openPlaylistModal() {
  var modal = document.getElementById('playlistModal');
  var overlay = document.getElementById('playlistOverlay');
  if (modal && overlay) {
    modal.style.display = 'flex';
    overlay.style.display = 'block';
    renderPlaylist();
  }
}
function closePlaylistModal() {
  var modal = document.getElementById('playlistModal');
  var overlay = document.getElementById('playlistOverlay');
  if (modal && overlay) {
    modal.style.display = 'none';
    overlay.style.display = 'none';
  }
}
function renderPlaylist() {
  var listEl = document.getElementById('playlistList');
  if (!listEl) return;
  var playlist = [];
  try {
    var stored = localStorage.getItem('mtvRewindPlaylist');
    if (stored) playlist = JSON.parse(stored);
  } catch (e) {}
  if (playlist.length === 0) {
    listEl.innerHTML = '<p style="text-align: center; color: #888; padding: 2rem;">No videos saved yet.<br>Triple-click the MTV logo to save!</p>';
    return;
  }
  listEl.innerHTML = playlist.map(function (item, index) {
    var _url$split$;
    // Handle both old format (string) and new format (object)
    var url = typeof item === 'string' ? item : item.url;
    var title = _typeof(item) === 'object' ? item.title : null;
    var videoId = ((_url$split$ = url.split('v=')[1]) === null || _url$split$ === void 0 ? void 0 : _url$split$.split('&')[0]) || '';
    var displayTitle = title || "Video ".concat(index + 1);
    return "\n            <div class=\"playlist-item\">\n                <span class=\"playlist-number\">".concat(index + 1, ".</span>\n                <div style=\"flex: 1;\">\n                    <a href=\"#\" onclick=\"playVideoFromPlaylist('").concat(videoId, "', ").concat(index, "); return false;\" style=\"font-size: 1.1rem; color: #ffd700; text-decoration: none; font-family: 'VT323', monospace; cursor: pointer; display: block;\">\n                        \u25B6\uFE0F ").concat(displayTitle, "\n                    </a>\n                </div>\n                <button onclick=\"editPlaylistTitle(").concat(index, ")\" style=\"background: transparent; border: none; color: #ffd700; cursor: pointer; font-size: 1.2rem; padding: 0.5rem; margin-right: 0.5rem;\" title=\"Edit\">\u270F\uFE0F</button>\n                <button onclick=\"removeFromPlaylist(").concat(index, ")\" style=\"background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: 1.2rem; padding: 0.5rem;\" title=\"Remove\">\u2715</button>\n            </div>\n        ");
  }).join('');
}

// Play single video from playlist
function playVideoFromPlaylist(videoId, index) {
  if (!player || !videoId) return;

  // Start playlist mode from this video
  startPlaylistMode(index);

  // Close the playlist modal
  closePlaylistModal();

  // Load and play the video
  player.loadVideoById(videoId);

  // Show notification
  showNotification('▶️ Playing from your playlist!');

  // Update the now playing display
  setTimeout(updateNowPlaying, 500);
}

// Play all videos in playlist
function playAllPlaylist() {
  var playlist = [];
  try {
    var stored = localStorage.getItem('mtvRewindPlaylist');
    if (stored) playlist = JSON.parse(stored);
  } catch (e) {
    return;
  }
  if (playlist.length === 0) {
    showNotification('❌ Playlist is empty');
    return;
  }

  // Start playlist mode from beginning
  startPlaylistMode(0);

  // Close modal and play first video
  closePlaylistModal();
  player.loadVideoById(userPlaylistVideos[0]);
  showNotification("\u25B6\uFE0F Playing all ".concat(userPlaylistVideos.length, " videos"));
  setTimeout(updateNowPlaying, 500);
}

// Start playlist playback mode
function startPlaylistMode() {
  var startIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var playlist = [];
  try {
    var stored = localStorage.getItem('mtvRewindPlaylist');
    if (stored) playlist = JSON.parse(stored);
  } catch (e) {
    return;
  }

  // Extract video IDs
  userPlaylistVideos = playlist.map(function (item) {
    var _url$split$2;
    var url = typeof item === 'string' ? item : item.url;
    return ((_url$split$2 = url.split('v=')[1]) === null || _url$split$2 === void 0 ? void 0 : _url$split$2.split('&')[0]) || '';
  }).filter(function (id) {
    return id;
  });
  if (userPlaylistVideos.length === 0) return;
  isPlaylistMode = true;
  userPlaylistIndex = startIndex;

  // Show stop button
  var stopBtn = document.querySelector('.stop-playlist-btn');
  if (stopBtn) stopBtn.classList.remove('hidden');
}

// Stop playlist playback mode
function stopPlaylist() {
  if (!isPlaylistMode) return;
  isPlaylistMode = false;
  userPlaylistVideos = [];
  userPlaylistIndex = 0;

  // Hide stop button
  var stopBtn = document.querySelector('.stop-playlist-btn');
  if (stopBtn) stopBtn.classList.add('hidden');
  showNotification('⏹️ Playlist stopped');

  // Reset display
  setTimeout(updateNowPlaying, 500);
}

// Play next video in user playlist
function playNextPlaylistVideo() {
  if (!isPlaylistMode || userPlaylistVideos.length === 0) return;
  userPlaylistIndex++;
  if (userPlaylistIndex >= userPlaylistVideos.length) {
    // Playlist finished
    showNotification('✅ Playlist complete!');
    stopPlaylist();
    // Return to normal channel playback
    if (currentPlaylist.length > 0) {
      player.loadVideoById(currentPlaylist[currentVideoIndex]);
      updateNowPlaying();
    }
    return;
  }

  // Play next video
  var nextVideoId = userPlaylistVideos[userPlaylistIndex];
  player.loadVideoById(nextVideoId);

  // Update display
  setTimeout(updateNowPlaying, 500);
}

// Play previous video in user playlist
function playPreviousPlaylistVideo() {
  if (!isPlaylistMode || userPlaylistVideos.length === 0) return;
  userPlaylistIndex--;
  if (userPlaylistIndex < 0) {
    userPlaylistIndex = userPlaylistVideos.length - 1;
  }

  // Play previous video
  var prevVideoId = userPlaylistVideos[userPlaylistIndex];
  player.loadVideoById(prevVideoId);

  // Update display
  setTimeout(updateNowPlaying, 500);
}
function removeFromPlaylist(index) {
  var playlist = [];
  try {
    var stored = localStorage.getItem('mtvRewindPlaylist');
    if (stored) playlist = JSON.parse(stored);
  } catch (e) {}
  playlist.splice(index, 1);
  try {
    localStorage.setItem('mtvRewindPlaylist', JSON.stringify(playlist));
    renderPlaylist();
    showNotification('✅ Removed from playlist');
  } catch (e) {
    showNotification('❌ Failed to remove');
  }
}
function editPlaylistTitle(index) {
  var playlist = [];
  try {
    var stored = localStorage.getItem('mtvRewindPlaylist');
    if (stored) playlist = JSON.parse(stored);
  } catch (e) {
    return;
  }
  var item = playlist[index];
  var currentTitle = _typeof(item) === 'object' ? item.title : null;
  var newTitle = prompt('Edit video title:', currentTitle || '');
  if (newTitle !== null && newTitle.trim() !== '') {
    // Update the item
    if (typeof item === 'string') {
      // Old format - convert to object
      playlist[index] = {
        url: item,
        title: newTitle.trim()
      };
    } else {
      // New format - just update title
      playlist[index].title = newTitle.trim();
    }
    try {
      localStorage.setItem('mtvRewindPlaylist', JSON.stringify(playlist));
      renderPlaylist();
      showNotification('✅ Title updated!');
    } catch (e) {
      showNotification('❌ Failed to update');
    }
  }
}
function copyPlaylist() {
  return _copyPlaylist.apply(this, arguments);
}
function _copyPlaylist() {
  _copyPlaylist = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var playlist, stored, playlistText, textarea, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          playlist = [];
          try {
            stored = localStorage.getItem('mtvRewindPlaylist');
            if (stored) playlist = JSON.parse(stored);
          } catch (e) {}
          if (!(playlist.length === 0)) {
            _context2.n = 1;
            break;
          }
          showNotification('❌ Playlist is empty');
          return _context2.a(2);
        case 1:
          // Format with titles if available
          playlistText = playlist.map(function (item, index) {
            var url = typeof item === 'string' ? item : item.url;
            var title = _typeof(item) === 'object' && item.title ? item.title : null;
            return title ? "".concat(index + 1, ". ").concat(title, " - ").concat(url) : url;
          }).join('\n');
          if (!(navigator.clipboard && navigator.clipboard.writeText)) {
            _context2.n = 5;
            break;
          }
          _context2.p = 2;
          _context2.n = 3;
          return navigator.clipboard.writeText(playlistText);
        case 3:
          showNotification("\u2705 Copied ".concat(playlist.length, " URLs!"));
          return _context2.a(2);
        case 4:
          _context2.p = 4;
          _t2 = _context2.v;
        case 5:
          try {
            textarea = document.createElement('textarea');
            textarea.value = playlistText;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showNotification("\u2705 Copied ".concat(playlist.length, " URLs!"));
          } catch (e) {
            showNotification('❌ Copy failed');
          }
        case 6:
          return _context2.a(2);
      }
    }, _callee2, null, [[2, 4]]);
  }));
  return _copyPlaylist.apply(this, arguments);
}
function clearPlaylist() {
  var playlist = [];
  try {
    var stored = localStorage.getItem('mtvRewindPlaylist');
    if (stored) playlist = JSON.parse(stored);
  } catch (e) {}
  if (playlist.length === 0) {
    showNotification('❌ Playlist already empty');
    return;
  }
  if (confirm("Clear all ".concat(playlist.length, " saved videos?"))) {
    localStorage.removeItem('mtvRewindPlaylist');
    renderPlaylist();
    showNotification('✅ Playlist cleared');
  }
}
function showNotification(message) {
  var existing = document.querySelector('.notification-toast');
  if (existing) existing.remove();
  var notification = document.createElement('div');
  notification.className = 'notification-toast show';
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(function () {
    notification.classList.remove('show');
    setTimeout(function () {
      return notification.remove();
    }, 300);
  }, 2000);
}
function setupLogoClickHandler() {
  var logo = document.querySelector('.mtv-logo');
  if (!logo) return;
  logo.addEventListener('click', function (e) {
    e.preventDefault();
    logoClickCount++;
    if (logoClickTimer) clearTimeout(logoClickTimer);
    if (logoClickCount === 3) {
      logoClickCount = 0;
      var currentUrl = getCurrentVideoUrl();
      addToPlaylist(currentUrl);
      return;
    }
    logoClickTimer = setTimeout(function () {
      if (logoClickCount === 1) openPlaylistModal();
      logoClickCount = 0;
    }, logoClickCount === 1 ? SINGLE_CLICK_DELAY : TRIPLE_CLICK_DELAY);
  });
}

// SCROLL FUNCTIONS FOR PLAYLIST
function scrollPlaylistUp() {
  var list = document.getElementById('playlistList');
  if (!list) return;
  list.scrollBy({
    top: -200,
    behavior: 'smooth'
  });
}
function scrollPlaylistDown() {
  var list = document.getElementById('playlistList');
  if (!list) return;
  list.scrollBy({
    top: 200,
    behavior: 'smooth'
  });
}
document.addEventListener('click', function (e) {
  var overlay = document.getElementById('playlistOverlay');
  if (e.target === overlay) closePlaylistModal();
});
document.addEventListener('DOMContentLoaded', function () {
  setupLogoClickHandler();
});
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(setupLogoClickHandler, 100);
}

// Keyboard shortcuts for next/prev (works everywhere)
document.addEventListener('keydown', function (e) {
  // Don't trigger if typing in an input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  // Arrow keys for next/prev
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    nextVideo();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    previousVideo();
  }
});
window.addEventListener('load', function () {
  var hasSeenWelcome = localStorage.getItem('mtvRewindWelcomeSeen');
  if (!hasSeenWelcome) {
    setTimeout(openWelcomeModal, 500);
  }
  showMobileDonationModal();
});
