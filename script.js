
function revealCake() {
    const surprise = document.getElementById('cake-surprise');
    surprise.classList.remove('d-none');
    // Optional animation reset (if using CSS animation)
    surprise.style.animation = 'none';
    surprise.offsetHeight; // trigger reflow
    surprise.style.animation = 'slideDownPop 1s ease forwards';

    // Confetti (optional)
    confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.9 }
    });
}



function revealLetter() {
    const letter = document.getElementById('letter2');
    letter.classList.remove('d-none');
}












let now_playing = document.querySelector('.now-playing');
let track_art = document.querySelector('.track-art');
let track_name = document.querySelector('.track-name');
let track_artist = document.querySelector('.track-artist');

let playpause_btn = document.querySelector('.playpause-track');
let next_btn = document.querySelector('.next-track');
let prev_btn = document.querySelector('.prev-track');

let seek_slider = document.querySelector('.seek_slider');
let volume_slider = document.querySelector('.volume_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let wave = document.getElementById('wave');
let randomIcon = document.querySelector('.fa-random');
let curr_track = document.createElement('audio');

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

const music_list = [
    {
        img: 'assets/images/beggin.jpg',
        name: 'Beggin',
        artist: 'by Måneskin',
        music: 'assets/music/beggin.mp3'
    },
    {
        img: 'assets/images/perfect.jpg',
        name: 'Perfect',
        artist: 'by Ed Sheeran',
        music: 'assets/music/perfect.mp3'
    },
    {
        img: 'assets/images/senorita.jpg',
        name: 'Señorita',
        artist: 'by Shawn Mendes',
        music: 'assets/music/senorita.mp3'
    },
    {
        img: 'images/bandeya.jpg',
        name: 'Bandeya re Bandeya',
        artist: 'by Arijit Singh, Asees Kaur',
        music: 'music/Bandeya Rey Bandeya - Arijit Singh, Asees Kaur.m4a'
    }
];

loadTrack(track_index);

function loadTrack(index) {
    clearInterval(updateTimer);
    reset();

    curr_track.src = music_list[index].music;
    curr_track.load();

    track_art.style.backgroundImage = `url(${music_list[index].img})`;
    track_name.textContent = music_list[index].name;
    track_artist.textContent = music_list[index].artist;
    now_playing.textContent = `Playing music ${index + 1} of ${music_list.length}`;

    updateTimer = setInterval(setUpdate, 1000);
    curr_track.addEventListener('ended', nextTrack);
}

function reset() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

function randomTrack() {
    isRandom ? pauseRandom() : playRandom();
}

function playRandom() {
    isRandom = true;
    randomIcon.classList.add('randomActive');
}

function pauseRandom() {
    isRandom = false;
    randomIcon.classList.remove('randomActive');
}

function repeatTrack() {
    loadTrack(track_index);
    playTrack();
}

function playpauseTrack() {
    isPlaying ? pauseTrack() : playTrack();
}

function playTrack() {
    curr_track.play();
    isPlaying = true;
    track_art.classList.add('rotate');
    wave.classList.add('loader');
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
    curr_track.pause();
    isPlaying = false;
    track_art.classList.remove('rotate');
    wave.classList.remove('loader');
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function nextTrack() {
    if (!isRandom && track_index < music_list.length - 1) {
        track_index++;
    } else if (isRandom) {
        track_index = Math.floor(Math.random() * music_list.length);
    } else {
        track_index = 0;
    }
    loadTrack(track_index);
    playTrack();
}

function prevTrack() {
    track_index = track_index > 0 ? track_index - 1 : music_list.length - 1;
    loadTrack(track_index);
    playTrack();
}

function seekTo() {
    let seekTo = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekTo;
}

function setVolume() {
    curr_track.volume = volume_slider.value / 100;
}

function setUpdate() {
    if (!isNaN(curr_track.duration)) {
        let seekPosition = (curr_track.currentTime / curr_track.duration) * 100;
        seek_slider.value = seekPosition;

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime % 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration % 60);

        curr_time.textContent = `${formatTime(currentMinutes)}:${formatTime(currentSeconds)}`;
        total_duration.textContent = `${formatTime(durationMinutes)}:${formatTime(durationSeconds)}`;
    }
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

const mediaItems = [
  { type: 'image', src: 'assets/images/photo1.jpg' },
  { type: 'video', src: 'assets/videos/sample1.mp4' },
  { type: 'image', src: 'assets/images/photo3.jpg' }
];

function openMediaModal() {
  const inner = document.getElementById('modalCarouselInner');
  inner.innerHTML = '';

  mediaItems.forEach((item, i) => {
    const slide = document.createElement('div');
    slide.classList.add('carousel-item');
    if (i === 0) slide.classList.add('active');

    if (item.type === 'image') {
      slide.innerHTML = `<img src="${item.src}" class="d-block w-100" style="max-height: 100vh; object-fit: contain;">`;
    } else {
      slide.innerHTML = `
        <video class="d-block w-100" style="max-height: 100vh;" autoplay muted>
          <source src="${item.src}" type="video/mp4">
        </video>`;
    }

    inner.appendChild(slide);
  });

  const modal = new bootstrap.Modal(document.getElementById('mediaModal'));
  modal.show();

  // Reinit carousel
  const carouselEl = document.getElementById('fullscreenCarousel');
  bootstrap.Carousel.getInstance(carouselEl)?.dispose();
  new bootstrap.Carousel(carouselEl);
}

const carouselElement = document.getElementById('fullscreenCarousel');

carouselElement.addEventListener('slid.bs.carousel', function (event) {
  // event.to is the index of the newly active slide
  // Get all carousel items
  const items = carouselElement.querySelectorAll('.carousel-item');

  items.forEach((item, index) => {
    const video = item.querySelector('video');
    if (video) {
      if (index === event.to) {
        // Reset video to start and play it
        video.currentTime = 0;
        video.play().catch(() => {
          // Handle any play promise rejection (e.g. autoplay blocked)
        });
      } else {
        // Pause videos on inactive slides
        video.pause();
      }
    }
  });
});
