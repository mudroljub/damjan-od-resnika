const audio = document.querySelector('#audio');
const nowPlaying = document.querySelector('#now-playing');
const playButton = document.querySelector('#main-play');
const visibleTracks = [...document.querySelectorAll('.track')];
const catalogTracks = [...(document.querySelector('#player-tracks')?.content.querySelectorAll('[data-path]') ?? [])];
const tracks = (visibleTracks.length ? visibleTracks : catalogTracks).map(item => ({
  path: item.dataset.path,
  title: item.dataset.title ?? item.querySelector('.play-track').textContent,
  album: item.dataset.album ?? item.closest('.album').querySelector('.album-title').textContent,
  year: item.dataset.year ?? item.closest('.album').querySelector('.album-year').textContent
}));

let current = null;
let played = [];

function play(track) {
  current = track;
  audio.src = track.path;
  audio.play();
  nowPlaying.textContent = `${track.title} — ${track.album} (${track.year})`;
  document.querySelectorAll('.track').forEach(item => item.classList.toggle('active', item.dataset.path === track.path));
  playButton.textContent = '❚❚';
}

function nextTrack() {
  if (!tracks.length) return;
  if (played.length === tracks.length) played = [];
  const choices = tracks.filter(track => !played.includes(track.path));
  const track = choices[Math.floor(Math.random() * choices.length)];
  played.push(track.path);
  play(track);
}

if (audio) {
  document.querySelectorAll('.play-track').forEach(button => button.addEventListener('click', () => {
    play(tracks.find(track => track.path === button.closest('.track').dataset.path));
  }));
  document.querySelector('#shuffle').addEventListener('click', nextTrack);
  document.querySelector('#next').addEventListener('click', nextTrack);
  audio.addEventListener('ended', nextTrack);
  playButton.addEventListener('click', () => {
    if (!current) return nextTrack();
    if (audio.paused) {
      audio.play();
      playButton.textContent = '❚❚';
    } else {
      audio.pause();
      playButton.textContent = '▶';
    }
  });
}
