// YouTube IFrame API with cache busting
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api?v=" + Date.now();
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
let allPlaylists = {};
let currentPlaylist = [];
let currentVideoIndex = 0;
let currentChannel = null;
let databaseLoaded = false;
let isPlayingCommercial = false;
let videosSinceLastCommercial = 0;
let lastCommercialPlayed = localStorage.getItem('lastCommercial') || null;
let videoBeforeCommercial = null;

// Playlist playback state
let isPlaylistMode = false;
let userPlaylistVideos = [];
let userPlaylistIndex = 0;

// Channel metadata - VH1 POP-UP VIDEO ADDED AFTER MTV2
const channelInfo = {
    '1stday': { name: 'MTV 1st Day', icon: '📺' },
    'liveaid': { name: 'LIVE AID 1985', icon: '🎸' },
    'grateful': { name: 'GRATEFUL FOR THE MUSIC', icon: '☠️' },
    'mtv2': { name: 'MTV2', icon: '📺' },
    'popupvideo': { name: 'VH1 Pop-Up Video', icon: '💭' },
    'sonidolatino': { name: 'SONIDO LATINO', icon: '🔥' },
    'amp': { name: 'AMP', icon: '🔊' },
    'trl': { name: 'TRL', icon: '🎤' },
    '120minutes': { name: '120 Minutes', icon: '🎸' },
    'unplugged': { name: 'MTV Unplugged', icon: '🔌' },
    '70s': { name: 'MTV 70s', icon: '🪩' },
    '80s': { name: 'MTV 80s', icon: '📼' },
    'raps': { name: 'Yo! MTV Raps', icon: '🎤' },
    '90s': { name: 'MTV 90s', icon: '💿' },
    '2000s': { name: 'MTV 2000s', icon: '💽' },
    '2010s': { name: 'MTV 2010s', icon: '📱' },
    '2020s': { name: 'MTV 2020s', icon: '🚀' },
    'metal': { name: 'Headbangers Ball', icon: '🤘' },
    'club': { name: 'CLUB MTV', icon: '🎧' },
    'all': { name: 'SHUFFLE ALL', icon: '🌀' }
};

// Load playlists from JSON file
async function loadPlaylists() {
    try {
        const response = await fetch('public/mtv-playlists.json');
        if (response.ok) {
            const data = await response.json();
            allPlaylists = data;
            databaseLoaded = true;
            updateStats(data);
            return;
        }
    } catch (error) {
        console.log('Error loading playlists:', error);
    }
}

function updateStats(data) {
    const statsEl = document.getElementById('stats');
    let totalVideos = 0;
    Object.keys(data).forEach(key => {
        if (key !== 'commercials' && key !== '1stday' && key !== 'grateful' && key !== 'liveaid') {
            totalVideos += data[key].length;
        }
    });
    const channelCount = Object.keys(data).filter(k => k !== 'commercials' && k !== '1stday' && k !== 'grateful' && k !== 'liveaid').length;
    
    statsEl.innerHTML = `
        <h4>DATABASE LOADED</h4>
        <p>📹 Total Videos: ${totalVideos.toLocaleString()}</p>
        <p>📺 Channels: ${channelCount}</p>
        <p style="color: #0f0;">✓ Ready to Rock</p>
    `;
    
    const totalCountEl = document.getElementById('totalVideoCount');
    if (totalCountEl) {
        totalCountEl.textContent = totalVideos.toLocaleString();
    }
}

function renderChannels() {
    const channelsEl = document.getElementById('channels');
    channelsEl.innerHTML = '';
    
    // VH1 POP-UP VIDEO ADDED IN SORT ORDER AFTER MTV2
    const sortedKeys = ['1stday', 'liveaid', 'grateful', 'mtv2', 'popupvideo', 'sonidolatino', 'amp', 'trl', '120minutes', 'unplugged', '70s', '80s', '90s', '2000s', '2010s', '2020s', 'raps', 'metal', 'club', 'all'];
    
    sortedKeys.forEach((key) => {
        const info = channelInfo[key];
        const btn = document.createElement('button');
        btn.className = 'channel-btn' + (key === '1stday' ? ' active' : '');
        btn.dataset.channel = key;
        
        let videoCount = 0;
        if (key === 'all') {
            videoCount = Object.keys(allPlaylists).reduce((total, k) => {
                if (k !== 'commercials' && k !== '1stday' && k !== 'grateful' && k !== 'liveaid') {
                    return total + (allPlaylists[k]?.length || 0);
                }
                return total;
            }, 0);
        } else {
            videoCount = allPlaylists[key]?.length || 0;
        }
        
        if (key === '1stday') {
            btn.innerHTML = `
                ${info.icon} ${info.name}
                <span class="video-count">${videoCount}</span>
                <div class="channel-info-icon" id="info-trigger">ℹ</div>
            `;
        } else {
            btn.innerHTML = `
                ${info.icon} ${info.name}
                <span class="video-count">${videoCount}</span>
            `;
        }
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('.channel-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadChannel(key);
        });
        
        channelsEl.appendChild(btn);
    });
    
    currentChannel = '1stday';
}

function onYouTubeIframeAPIReady() {
    loadPlaylists().then(() => {
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
    
    let sourcePlaylist = [];
    if (channel === 'all') {
        sourcePlaylist = [
            ...(allPlaylists['70s'] || []),
            ...(allPlaylists['80s'] || []),
            ...(allPlaylists['raps'] || []),
            ...(allPlaylists['90s'] || []),
            ...(allPlaylists['2000s'] || []),
            ...(allPlaylists['2010s'] || []),
            ...(allPlaylists['2020s'] || [])
        ];
    } else {
        sourcePlaylist = [...(allPlaylists[channel] || [])];
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
            const firstVideo = sourcePlaylist[0]; // Bob Weir intro
            const restOfVideos = shuffleArray(sourcePlaylist.slice(1)); // Shuffle the rest
            currentPlaylist = [firstVideo, ...restOfVideos];
        } else {
            currentPlaylist = sourcePlaylist;
        }
    } else if (channel === '1stday') {
        currentPlaylist = sourcePlaylist;
    } else if (channel === 'trl') {
        // TRL: First video (Carson Daly intro) plays first, then shuffle the rest
        if (sourcePlaylist.length > 1) {
            const firstVideo = sourcePlaylist[0]; // Carson Daly intro
            const restOfVideos = shuffleArray(sourcePlaylist.slice(1)); // Shuffle the countdown
            currentPlaylist = [firstVideo, ...restOfVideos];
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
    
    setTimeout(() => {
        if (player && player.getPlayerState) {
            const state = player.getPlayerState();
            if (state === 1 || state === 2) {
                const currentTime = player.getCurrentTime();
                player.seekTo(currentTime, true);
            }
        }
    }, 500);
    
    setTimeout(() => {
        if (player && player.getPlayerState) {
            const state = player.getPlayerState();
            if (state === 1 || state === 2) {
                const currentTime = player.getCurrentTime();
                player.seekTo(currentTime, true);
            }
        }
    }, 1000);
    
    setTimeout(() => {
        if (player && player.getPlayerState) {
            const state = player.getPlayerState();
            if (state === 1 || state === 2) {
                const currentTime = player.getCurrentTime();
                player.seekTo(currentTime, true);
            }
        }
    }, 1500);
    
    const volumeSlider = document.getElementById('volumeSlider');
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
        const videoData = player.getVideoData();
        if (!videoData || !videoData.title) return;
        
        let title = videoData.title || '';
        let artist = videoData.author || '';
        
        if (!title) return;
        
        // Clean up title - remove VEVO and other cruft
        title = title
            .replace(/\s*\(Official Music Video\)/gi, '')
            .replace(/\s*\[Official Music Video\]/gi, '')
            .replace(/\s*-\s*VEVO$/i, '')
            .replace(/VEVO\s*$/i, '')
            .replace(/\s+/g, ' ')
            .trim();
        
        // Clean up artist name too
        artist = artist
            .replace(/VEVO\s*$/i, '')
            .replace(/\s+/g, ' ')
            .trim();
        
        // Remove any existing overlay
        const existing = document.querySelector('.mtv-title-overlay');
        if (existing) existing.remove();
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'mtv-title-overlay';
        overlay.innerHTML = `
            <div class="mtv-title-artist">${artist}</div>
            <div class="mtv-title-song">${title}</div>
        `;
        
        // Add to video player
        const tvScreen = document.querySelector('.tv-screen');
        if (tvScreen) {
            tvScreen.appendChild(overlay);
            
            // Fade in
            setTimeout(() => overlay.classList.add('show'), 100);
            
            // Fade out after 6 seconds
            setTimeout(() => {
                overlay.classList.remove('show');
                setTimeout(() => overlay.remove(), 1000);
            }, 6000);
        }
    } catch (e) {
        console.log('Could not show title overlay:', e);
    }
}

function onPlayerError(event) {
    const badVideoId = isPlaylistMode ? 
        userPlaylistVideos[userPlaylistIndex] : 
        currentPlaylist[currentVideoIndex];
    
    console.log(`Error playing video ${badVideoId}: Error code ${event.data} - Auto-skipping...`);
    
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
        
        setTimeout(() => {
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
    
    const commercials = allPlaylists['commercials'];
    
    videoBeforeCommercial = currentPlaylist[currentVideoIndex];
    
    if (commercials.length === 1) {
        const commercial = commercials[0];
        console.log('🎬 COMMERCIAL BREAK! Playing:', commercial);
        lastCommercialPlayed = commercial;
        localStorage.setItem('lastCommercial', commercial);
        isPlayingCommercial = true;
        videosSinceLastCommercial = 0;
        
        player.loadVideoById(commercial);
        
        setTimeout(() => {
            if (player && player.playVideo) {
                player.playVideo();
            }
        }, 500);
        return;
    }
    
    let randomCommercial;
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
    
    setTimeout(() => {
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
        
        console.log(`✅ Loading video after commercial: index ${currentVideoIndex}`);
        
        player.loadVideoById(currentPlaylist[currentVideoIndex]);
        
        setTimeout(() => {
            if (player && player.playVideo) {
                player.playVideo();
            }
        }, 500);
        
        updateNowPlaying();
        return;
    }
    
    videosSinceLastCommercial++;
    
    const randomInterval = Math.floor(Math.random() * 2) + 3;
    if (videosSinceLastCommercial >= randomInterval) {
        console.log(`📺 Injecting commercial after ${videosSinceLastCommercial} videos`);
        playRandomCommercial();
        return;
    }
    
    currentVideoIndex++;
    
    if (currentVideoIndex >= currentPlaylist.length) {
        if (currentChannel === '1stday') {
            loadChannel('80s');
            document.querySelectorAll('.channel-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('[data-channel="80s"]').classList.add('active');
            return;
        } else if (currentChannel === '70s') {
            loadChannel('80s');
            document.querySelectorAll('.channel-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('[data-channel="80s"]').classList.add('active');
            return;
        } else if (currentChannel === '80s') {
            loadChannel('90s');
            document.querySelectorAll('.channel-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('[data-channel="90s"]').classList.add('active');
            return;
        } else if (currentChannel === '90s') {
            loadChannel('2000s');
            document.querySelectorAll('.channel-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('[data-channel="2000s"]').classList.add('active');
            return;
        } else if (currentChannel === '2000s') {
            loadChannel('2010s');
            document.querySelectorAll('.channel-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('[data-channel="2010s"]').classList.add('active');
            return;
        } else if (currentChannel === '2010s') {
            loadChannel('2020s');
            document.querySelectorAll('.channel-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('[data-channel="2020s"]').classList.add('active');
            return;
        } else if (currentChannel === '2020s') {
            loadChannel('1stday');
            document.querySelectorAll('.channel-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('[data-channel="1stday"]').classList.add('active');
            return;
        } else if (currentChannel === 'liveaid') {
            // LIVE AID - LOOP BACK TO START (PLAY IN ORDER AGAIN)
            currentPlaylist = [...(allPlaylists['liveaid'] || [])];
            currentVideoIndex = 0;
        } else if (currentChannel === 'grateful') {
            // GRATEFUL DEAD - RESHUFFLE (keep first video at start)
            const sourcePlaylist = [...(allPlaylists['grateful'] || [])];
            if (sourcePlaylist.length > 1) {
                const firstVideo = sourcePlaylist[0];
                const restOfVideos = shuffleArray(sourcePlaylist.slice(1));
                currentPlaylist = [firstVideo, ...restOfVideos];
            } else {
                currentPlaylist = sourcePlaylist;
            }
            currentVideoIndex = 0;
        } else if (currentChannel === 'mtv2') {
            // MTV2 - RESHUFFLE RANDOMLY
            currentPlaylist = shuffleArray([...(allPlaylists['mtv2'] || [])]);
            currentVideoIndex = 0;
        } else if (currentChannel === 'popupvideo') {
            // VH1 POP-UP VIDEO - RESHUFFLE RANDOMLY
            currentPlaylist = shuffleArray([...(allPlaylists['popupvideo'] || [])]);
            currentVideoIndex = 0;
        } else if (currentChannel === 'sonidolatino') {
            // SONIDO LATINO - RESHUFFLE RANDOMLY
            currentPlaylist = shuffleArray([...(allPlaylists['sonidolatino'] || [])]);
            currentVideoIndex = 0;
        } else if (currentChannel === 'amp') {
            // AMP - RESHUFFLE RANDOMLY
            currentPlaylist = shuffleArray([...(allPlaylists['amp'] || [])]);
            currentVideoIndex = 0;
        } else if (currentChannel === 'trl') {
            // TRL - RESHUFFLE RANDOMLY
            currentPlaylist = shuffleArray([...(allPlaylists['trl'] || [])]);
            currentVideoIndex = 0;
        } else if (currentChannel === 'raps') {
            currentPlaylist = shuffleArray([...(allPlaylists['raps'] || [])]);
            currentVideoIndex = 0;
        } else if (currentChannel === 'metal') {
            currentPlaylist = shuffleArray([...(allPlaylists['metal'] || [])]);
            currentVideoIndex = 0;
        } else if (currentChannel === '120minutes') {
            // 120 MINUTES - RESHUFFLE RANDOMLY
            currentPlaylist = shuffleArray([...(allPlaylists['120minutes'] || [])]);
            currentVideoIndex = 0;
        } else if (currentChannel === 'unplugged') {
            // UNPLUGGED - RESHUFFLE RANDOMLY
            currentPlaylist = shuffleArray([...(allPlaylists['unplugged'] || [])]);
            currentVideoIndex = 0;
        } else if (currentChannel === 'club') {
            // CLUB MTV - RESHUFFLE RANDOMLY
            currentPlaylist = shuffleArray([...(allPlaylists['club'] || [])]);
            currentVideoIndex = 0;
        } else {
            currentPlaylist = shuffleArray([
                ...(allPlaylists['70s'] || []),
                ...(allPlaylists['80s'] || []),
                ...(allPlaylists['raps'] || []),
                ...(allPlaylists['90s'] || []),
                ...(allPlaylists['2000s'] || []),
                ...(allPlaylists['2010s'] || []),
                ...(allPlaylists['2020s'] || [])
            ]);
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
        
        console.log(`✅ Skipped commercial, loading video index ${currentVideoIndex}`);
        
        player.loadVideoById(currentPlaylist[currentVideoIndex]);
        
        setTimeout(() => {
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
        document.getElementById('current-video').textContent = 
            `📼 Your Playlist (${userPlaylistIndex + 1}/${userPlaylistVideos.length})`;
    } else {
        const info = channelInfo[currentChannel];
        document.getElementById('current-video').textContent = 
            `${info.icon} ${info.name}`;
    }
    
    // Get video metadata from YouTube
    let displayText = isPlaylistMode ? 
        `Video ${userPlaylistIndex + 1} of ${userPlaylistVideos.length}` :
        `Video ${currentVideoIndex + 1} of ${currentPlaylist.length}`;
    
    if (player && player.getVideoData) {
        try {
            const videoData = player.getVideoData();
            if (videoData && videoData.title) {
                const title = videoData.title || '';
                const artist = videoData.author || '';
                if (title) {
                    displayText = artist ? `${artist} - ${title}` : title;
                }
            }
        } catch (e) {
            console.log('Could not fetch video metadata:', e);
        }
    }
    
    document.getElementById('video-counter').textContent = displayText;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
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
        setTimeout(() => {
            document.getElementById('mobileDonationModal').classList.add('show');
        }, 3000);
    }
}

const volumeSlider = document.getElementById('volumeSlider');
const volumePercentage = document.getElementById('volumePercentage');
const volumeIcon = document.querySelector('.volume-icon');
let isMuted = false;
let previousVolume = 70;

function updateVolume(volume) {
    if (player) {
        if (typeof player.setVolume === 'function') {
            player.setVolume(parseInt(volume));
        }
        if (player.getIframe && player.getIframe()) {
            const iframe = player.getIframe();
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
    
    const percentage = (volume / 100) * 100;
    volumeSlider.style.background = `linear-gradient(to right, #ffd700 0%, #ffd700 ${percentage}%, #333 ${percentage}%, #333 100%)`;
    
    if (volume == 0) {
        volumeIcon.textContent = '🔇';
        isMuted = true;
    } else {
        volumeIcon.textContent = volume < 50 ? '🔉' : '🔊';
        isMuted = false;
    }
}

if (volumeSlider) {
    volumeSlider.addEventListener('input', function(e) {
        updateVolume(this.value);
    });
    
    volumeSlider.addEventListener('change', function(e) {
        updateVolume(this.value);
    });
    
    volumeSlider.addEventListener('touchstart', function(e) {});
    
    volumeSlider.addEventListener('touchmove', function(e) {
        updateVolume(this.value);
    });
    
    volumeSlider.addEventListener('touchend', function(e) {
        updateVolume(this.value);
    });
    
    volumeSlider.addEventListener('mouseup', function(e) {
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
        
        const percentage = (previousVolume / 100) * 100;
        volumeSlider.style.background = `linear-gradient(to right, #ffd700 0%, #ffd700 ${percentage}%, #333 ${percentage}%, #333 100%)`;
    } else {
        previousVolume = volumeSlider.value;
        volumeSlider.value = 0;
        if (player && player.setVolume) {
            player.setVolume(0);
        }
        volumePercentage.textContent = '0%';
        volumeIcon.textContent = '🔇';
        isMuted = true;
        
        volumeSlider.style.background = `linear-gradient(to right, #ffd700 0%, #ffd700 0%, #333 0%, #333 100%)`;
    }
}

const initialVolume = volumeSlider.value;
const initialPercentage = (initialVolume / 100) * 100;
volumeSlider.style.background = `linear-gradient(to right, #ffd700 0%, #ffd700 ${initialPercentage}%, #333 ${initialPercentage}%, #333 100%)`;

// FULLY BROKEN SLOT MACHINE COUNTER - TOO VIRAL TO TRACK
function updateCounterDisplay() {
    const counterEl = document.getElementById('visitor-count');
    if (!counterEl) return;
    
    // Create 7 individual spinning digits
    counterEl.innerHTML = '';
    counterEl.style.display = 'flex';
    counterEl.style.gap = '2px';
    counterEl.style.justifyContent = 'center';
    
    for (let i = 0; i < 7; i++) {
        const digitSpan = document.createElement('span');
        digitSpan.style.display = 'inline-block';
        digitSpan.style.minWidth = '1ch';
        digitSpan.style.textAlign = 'center';
        counterEl.appendChild(digitSpan);
        
        // Each digit spins at slightly different speed for chaos
        const speed = 80 + Math.random() * 100;
        
        setInterval(() => {
            const randomDigit = Math.floor(Math.random() * 10);
            digitSpan.textContent = randomDigit;
            
            // Random glitch colors
            const glitchRoll = Math.random();
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
    }
}

// Start the absolute chaos
updateCounterDisplay();

// Global tooltip for MTV 1st Day
const tooltip = document.createElement('div');
tooltip.className = 'global-tooltip';
tooltip.innerHTML = '<p>This is the true 1st full day of music videos from MTV\'s launch on 8/01/1981. Special thanks to <a href="https://www.npr.org/sections/therecord/2011/08/01/138988246/the-first-100-videos-played-on-mtv" target="_blank" rel="noopener noreferrer">NPR</a> for preserving this momentous day in music history.</p>';
document.body.appendChild(tooltip);

document.addEventListener('mouseover', (e) => {
    if (e.target.id === 'info-trigger' || e.target.closest('#info-trigger')) {
        tooltip.classList.add('show');
    }
});

document.addEventListener('mouseout', (e) => {
    if (e.target.id === 'info-trigger' || e.target.closest('#info-trigger')) {
        tooltip.classList.remove('show');
    }
});

// ============================================================================
// EASTER EGG PLAYLIST FEATURE WITH PLAYBACK
// ============================================================================

let logoClickCount = 0;
let logoClickTimer = null;
const TRIPLE_CLICK_DELAY = 500;
const SINGLE_CLICK_DELAY = 300;

function getCurrentVideoUrl() {
    if (!player || !player.getVideoData) return null;
    const videoData = player.getVideoData();
    if (!videoData || !videoData.video_id) return null;
    return `https://www.youtube.com/watch?v=${videoData.video_id}`;
}

function addToPlaylist(url) {
    if (!url) {
        showNotification('❌ No video playing');
        return;
    }
    
    // Get current video metadata
    let title = null;
    let artist = null;
    
    if (player && player.getVideoData) {
        try {
            const videoData = player.getVideoData();
            if (videoData) {
                // Clean up title
                title = (videoData.title || '')
                    .replace(/\s*\(Official Music Video\)/gi, '')
                    .replace(/\s*\[Official Music Video\]/gi, '')
                    .replace(/\s*-\s*VEVO$/i, '')
                    .replace(/VEVO\s*$/i, '')
                    .replace(/\s+/g, ' ')
                    .trim();
                
                // Clean up artist
                artist = (videoData.author || '')
                    .replace(/VEVO\s*$/i, '')
                    .replace(/\s+/g, ' ')
                    .trim();
            }
        } catch (e) {
            console.log('Could not fetch video metadata for playlist:', e);
        }
    }
    
    let playlist = [];
    try {
        const stored = localStorage.getItem('mtvRewindPlaylist');
        if (stored) playlist = JSON.parse(stored);
    } catch (e) {
        console.error('Error loading playlist:', e);
    }
    
    // Check if already exists
    const existingIndex = playlist.findIndex(item => 
        (typeof item === 'string' ? item : item.url) === url
    );
    
    if (existingIndex !== -1) {
        showNotification('⚠️ Already in playlist');
        return;
    }
    
    // Add with metadata
    const displayTitle = artist && title ? `${artist} - ${title}` : (title || null);
    playlist.push({ 
        url: url, 
        title: displayTitle,
        artist: artist,
        videoTitle: title
    });
    
    try {
        localStorage.setItem('mtvRewindPlaylist', JSON.stringify(playlist));
        showNotification(`✅ Saved! (${playlist.length} videos)`);
    } catch (e) {
        showNotification('❌ Failed to save');
    }
}

function openPlaylistModal() {
    const modal = document.getElementById('playlistModal');
    const overlay = document.getElementById('playlistOverlay');
    if (modal && overlay) {
        modal.style.display = 'flex';
        overlay.style.display = 'block';
        renderPlaylist();
    }
}

function closePlaylistModal() {
    const modal = document.getElementById('playlistModal');
    const overlay = document.getElementById('playlistOverlay');
    if (modal && overlay) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }
}

function renderPlaylist() {
    const listEl = document.getElementById('playlistList');
    if (!listEl) return;
    let playlist = [];
    try {
        const stored = localStorage.getItem('mtvRewindPlaylist');
        if (stored) playlist = JSON.parse(stored);
    } catch (e) {}
    if (playlist.length === 0) {
        listEl.innerHTML = '<p style="text-align: center; color: #888; padding: 2rem;">No videos saved yet.<br>Triple-click the MTV logo to save!</p>';
        return;
    }
    listEl.innerHTML = playlist.map((item, index) => {
        // Handle both old format (string) and new format (object)
        const url = typeof item === 'string' ? item : item.url;
        const title = typeof item === 'object' ? item.title : null;
        const videoId = url.split('v=')[1]?.split('&')[0] || '';
        const displayTitle = title || `Video ${index + 1}`;
        
        return `
            <div class="playlist-item">
                <span class="playlist-number">${index + 1}.</span>
                <div style="flex: 1;">
                    <a href="#" onclick="playVideoFromPlaylist('${videoId}', ${index}); return false;" style="font-size: 1.1rem; color: #ffd700; text-decoration: none; font-family: 'VT323', monospace; cursor: pointer; display: block;">
                        ▶️ ${displayTitle}
                    </a>
                </div>
                <button onclick="editPlaylistTitle(${index})" style="background: transparent; border: none; color: #ffd700; cursor: pointer; font-size: 1.2rem; padding: 0.5rem; margin-right: 0.5rem;" title="Edit">✏️</button>
                <button onclick="removeFromPlaylist(${index})" style="background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: 1.2rem; padding: 0.5rem;" title="Remove">✕</button>
            </div>
        `;
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
    let playlist = [];
    try {
        const stored = localStorage.getItem('mtvRewindPlaylist');
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
    
    showNotification(`▶️ Playing all ${userPlaylistVideos.length} videos`);
    setTimeout(updateNowPlaying, 500);
}

// Start playlist playback mode
function startPlaylistMode(startIndex = 0) {
    let playlist = [];
    try {
        const stored = localStorage.getItem('mtvRewindPlaylist');
        if (stored) playlist = JSON.parse(stored);
    } catch (e) {
        return;
    }
    
    // Extract video IDs
    userPlaylistVideos = playlist.map(item => {
        const url = typeof item === 'string' ? item : item.url;
        return url.split('v=')[1]?.split('&')[0] || '';
    }).filter(id => id);
    
    if (userPlaylistVideos.length === 0) return;
    
    isPlaylistMode = true;
    userPlaylistIndex = startIndex;
    
    // Show stop button
    const stopBtn = document.querySelector('.stop-playlist-btn');
    if (stopBtn) stopBtn.classList.remove('hidden');
}

// Stop playlist playback mode
function stopPlaylist() {
    if (!isPlaylistMode) return;
    
    isPlaylistMode = false;
    userPlaylistVideos = [];
    userPlaylistIndex = 0;
    
    // Hide stop button
    const stopBtn = document.querySelector('.stop-playlist-btn');
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
    const nextVideoId = userPlaylistVideos[userPlaylistIndex];
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
    const prevVideoId = userPlaylistVideos[userPlaylistIndex];
    player.loadVideoById(prevVideoId);
    
    // Update display
    setTimeout(updateNowPlaying, 500);
}

function removeFromPlaylist(index) {
    let playlist = [];
    try {
        const stored = localStorage.getItem('mtvRewindPlaylist');
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
    let playlist = [];
    try {
        const stored = localStorage.getItem('mtvRewindPlaylist');
        if (stored) playlist = JSON.parse(stored);
    } catch (e) {
        return;
    }
    
    const item = playlist[index];
    const currentTitle = typeof item === 'object' ? item.title : null;
    
    const newTitle = prompt('Edit video title:', currentTitle || '');
    
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

async function copyPlaylist() {
    let playlist = [];
    try {
        const stored = localStorage.getItem('mtvRewindPlaylist');
        if (stored) playlist = JSON.parse(stored);
    } catch (e) {}
    if (playlist.length === 0) {
        showNotification('❌ Playlist is empty');
        return;
    }
    
    // Format with titles if available
    const playlistText = playlist.map((item, index) => {
        const url = typeof item === 'string' ? item : item.url;
        const title = typeof item === 'object' && item.title ? item.title : null;
        return title ? `${index + 1}. ${title} - ${url}` : url;
    }).join('\n');
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(playlistText);
            showNotification(`✅ Copied ${playlist.length} URLs!`);
            return;
        } catch (e) {}
    }
    try {
        const textarea = document.createElement('textarea');
        textarea.value = playlistText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification(`✅ Copied ${playlist.length} URLs!`);
    } catch (e) {
        showNotification('❌ Copy failed');
    }
}

function clearPlaylist() {
    let playlist = [];
    try {
        const stored = localStorage.getItem('mtvRewindPlaylist');
        if (stored) playlist = JSON.parse(stored);
    } catch (e) {}
    if (playlist.length === 0) {
        showNotification('❌ Playlist already empty');
        return;
    }
    if (confirm(`Clear all ${playlist.length} saved videos?`)) {
        localStorage.removeItem('mtvRewindPlaylist');
        renderPlaylist();
        showNotification('✅ Playlist cleared');
    }
}

function showNotification(message) {
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();
    const notification = document.createElement('div');
    notification.className = 'notification-toast show';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function setupLogoClickHandler() {
    const logo = document.querySelector('.mtv-logo');
    if (!logo) return;
    logo.addEventListener('click', function(e) {
        e.preventDefault();
        logoClickCount++;
        if (logoClickTimer) clearTimeout(logoClickTimer);
        if (logoClickCount === 3) {
            logoClickCount = 0;
            const currentUrl = getCurrentVideoUrl();
            addToPlaylist(currentUrl);
            return;
        }
        logoClickTimer = setTimeout(() => {
            if (logoClickCount === 1) openPlaylistModal();
            logoClickCount = 0;
        }, logoClickCount === 1 ? SINGLE_CLICK_DELAY : TRIPLE_CLICK_DELAY);
    });
}

// SCROLL FUNCTIONS FOR PLAYLIST
function scrollPlaylistUp() {
    const list = document.getElementById('playlistList');
    if (!list) return;
    list.scrollBy({
        top: -200,
        behavior: 'smooth'
    });
}

function scrollPlaylistDown() {
    const list = document.getElementById('playlistList');
    if (!list) return;
    list.scrollBy({
        top: 200,
        behavior: 'smooth'
    });
}

document.addEventListener('click', function(e) {
    const overlay = document.getElementById('playlistOverlay');
    if (e.target === overlay) closePlaylistModal();
});

document.addEventListener('DOMContentLoaded', function() {
    setupLogoClickHandler();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(setupLogoClickHandler, 100);
}

// Keyboard shortcuts for next/prev (works everywhere)
document.addEventListener('keydown', (e) => {
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

window.addEventListener('load', function() {
    const hasSeenWelcome = localStorage.getItem('mtvRewindWelcomeSeen');
    if (!hasSeenWelcome) {
        setTimeout(openWelcomeModal, 500);
    }
    
    showMobileDonationModal();
});
