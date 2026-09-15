const audio = document.querySelector("#audio");
const lyricCredits = {
  Ekumena: "Tekst: Višnja · Muzika: Damjan",
  "Mali prda smrda":
    "Tekst i muzika: Damjan Pavlica (tata) · Glas i crteži: Iskra Pavlica (6 godina)",
  "Noć pod nebom": "Tekst: Tijana Soleša · Muzika: Damjan od Resnika",
};

const nowPlaying = document.querySelector("#now-playing");
const playButton = document.querySelector("#main-play");
const progress = document.querySelector("#player-progress");
const visibleTracks = [...document.querySelectorAll(".track")];
const catalogTracks = [
  ...(document
    .querySelector("#player-tracks")
    ?.content.querySelectorAll("[data-path]") ?? []),
];
const tracks = (visibleTracks.length ? visibleTracks : catalogTracks).map(
  (item) => ({
    path: item.dataset.path,
    title: item.dataset.title ?? item.querySelector(".play-track").textContent,
    album:
      item.dataset.album ??
      item.closest(".album")?.querySelector(".album-title")?.textContent ??
      "",
    year:
      item.dataset.year ??
      item.closest(".album")?.querySelector(".album-year")?.textContent ??
      "",
  }),
);

let current = null;
let played = [];

const lyricsDialog = document.createElement("dialog");
lyricsDialog.className = "lyrics-dialog";
lyricsDialog.innerHTML =
  '<article class="lyrics-sheet"><header class="lyrics-header"><h2 id="lyrics-title"></h2><form method="dialog"><button class="lyrics-close" type="submit">Zatvori</button></form></header><div class="lyrics-body"><pre id="lyrics-content" class="lyrics-content"></pre><p id="lyrics-credit" class="lyrics-credit" hidden></p></div></article>';
document.body.append(lyricsDialog);
const lyricsTitle = lyricsDialog.querySelector("#lyrics-title");
const lyricsContent = lyricsDialog.querySelector("#lyrics-content");
const lyricsCredit = lyricsDialog.querySelector("#lyrics-credit");

async function openLyrics(title, resource) {
  lyricsTitle.textContent = title;
  lyricsCredit.hidden = !resource.credit;
  lyricsCredit.textContent = resource.credit ?? "";
  lyricsContent.textContent = "Učitavanje teksta…";
  lyricsDialog.showModal();
  try {
    const response = await fetch(resource.file);
    if (!response.ok) throw new Error();
    lyricsContent.textContent = await response.text();
  } catch {
    lyricsContent.textContent = "Tekst trenutno nije dostupan.";
  }
}

lyricsDialog.addEventListener("click", (event) => {
  if (event.target === lyricsDialog) lyricsDialog.close();
});

visibleTracks.forEach((item) => {
  const title = item.querySelector(".play-track").textContent.trim();
  const link = item.querySelector(".lyric-trigger");
  if (!link) return;
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openLyrics(title, {
      file: link.getAttribute("href"),
      credit: lyricCredits[title],
    });
  });
});

function play(track) {
  current = track;
  if (progress) {
    progress.value = "0";
    progress.style.setProperty("--progress", "0%");
    progress.disabled = true;
  }
  audio.src = track.path;
  nowPlaying.textContent = `${track.title} — ${track.album}${track.year ? ` (${track.year})` : ""}`;
  document
    .querySelectorAll(".track")
    .forEach((item) =>
      item.classList.toggle("active", item.dataset.path === track.path),
    );
  const playAttempt = audio.play();
  if (playAttempt) {
    playAttempt.catch(() => {
      if (current?.path !== track.path) return;
      updatePlaybackControls();
      nowPlaying.textContent = `Reprodukcija nije mogla da se pokrene: ${track.title}`;
    });
  }
}

function updatePlaybackControls() {
  const isPlaying = Boolean(current && !audio.paused);
  document
    .querySelectorAll(".track")
    .forEach((item) =>
      item.classList.toggle(
        "playing",
        isPlaying && item.dataset.path === current.path,
      ),
    );
  playButton.textContent = isPlaying ? "❚❚" : "▶";
  playButton.setAttribute(
    "aria-label",
    isPlaying ? "Pauziraj reprodukciju" : "Pokreni reprodukciju",
  );
  playButton.setAttribute("aria-pressed", String(isPlaying));
}

function nextTrack() {
  if (!tracks.length) return;
  if (played.length === tracks.length) played = [];
  const choices = tracks.filter((track) => !played.includes(track.path));
  const track = choices[Math.floor(Math.random() * choices.length)];
  played.push(track.path);
  play(track);
}

if (audio) {
  document.querySelectorAll(".play-track").forEach((button) =>
    button.addEventListener("click", () => {
      const track = tracks.find(
        (item) => item.path === button.closest(".track").dataset.path,
      );
      if (current?.path === track.path) {
        if (audio.paused) audio.play();
        else audio.pause();
        return;
      }
      play(track);
    }),
  );
  document.querySelector("#next").addEventListener("click", nextTrack);
  audio.addEventListener("ended", nextTrack);
  audio.addEventListener("playing", updatePlaybackControls);
  audio.addEventListener("pause", updatePlaybackControls);
  audio.addEventListener("error", () => {
    updatePlaybackControls();
    if (current) {
      nowPlaying.textContent = `Pesma nije dostupna: ${current.title}`;
    }
  });
  audio.addEventListener("loadedmetadata", () => {
    if (!progress) return;
    progress.disabled = !Number.isFinite(audio.duration) || audio.duration <= 0;
    progress.value = "0";
    progress.style.setProperty("--progress", "0%");
  });
  audio.addEventListener("timeupdate", () => {
    if (!progress || !Number.isFinite(audio.duration) || audio.duration <= 0)
      return;
    const value = (audio.currentTime / audio.duration) * 100;
    progress.value = String(value);
    progress.style.setProperty("--progress", `${value}%`);
  });
  progress?.addEventListener("input", () => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
    progress.style.setProperty("--progress", `${progress.value}%`);
    audio.currentTime = audio.duration * (Number(progress.value) / 100);
  });
  playButton.addEventListener("click", () => {
    if (!current) return nextTrack();
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });
}
