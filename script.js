const audio = document.querySelector("#audio");
const lyrics = {
  1994: { file: "lyrics/1994.txt" },
  "Bez poverenja": { file: "lyrics/bez-poverenja.txt" },
  "Besplatna pesma": { file: "lyrics/besplatna-pesma.txt" },
  Ekumena: {
    file: "lyrics/ekumena.txt",
    credit: "Tekst: Višnja · Muzika: Damjan",
  },
  "Fini mladi ljudi": { file: "lyrics/fini-mladi-ljudi.txt" },
  "Fini mladi ljudi (live)": { file: "lyrics/fini-mladi-ljudi.txt" },
  "Ja sam bogat": { file: "lyrics/ja-sam-bogat.txt" },
  "Ja sam bogat (sa probe)": { file: "lyrics/ja-sam-bogat.txt" },
  "Jebeni grad": { file: "lyrics/jebeni-grad.txt" },
  Lepota: { file: "lyrics/lepota.txt" },
  Mali: { file: "lyrics/mali.txt" },
  "Mali prda smrda": {
    file: "lyrics/mali-prda-smrda.txt",
    credit:
      "Tekst i muzika: Damjan Pavlica (tata) · Glas i crteži: Iskra Pavlica (6 godina)",
  },
  "Mlade mame": { file: "lyrics/mlade-mame.txt" },
  "Mladi filozof je postao kamen": {
    file: "lyrics/mladi-filozof-je-postao-kamen.txt",
  },
  "Moja država": { file: "lyrics/moja-drzava.txt" },
  "Moje vreme prošlo": { file: "lyrics/moje-vreme-proslo.txt" },
  Negde: { file: "lyrics/negde.txt" },
  "Noć pod nebom": {
    file: "lyrics/noc-pod-nebom.txt",
    credit: "Tekst: Tijana Soleša · Muzika: Damjan od Resnika",
  },
  "Obnova i izgradnja": { file: "lyrics/obnova-i-izgradnja.txt" },
  "Stara mudra sova": {
    file: "lyrics/stara-mudra-sova.txt",
    credit:
      "Tekst i muzika: Damjan Pavlica · Crtež i animacija: Uroš Pejčić i Ilija Višnjić",
  },
  Sloboda: { file: "lyrics/sloboda.txt" },
  "Sunce sija u našem kraju": { file: "lyrics/sunce-sija-u-nasem-kraju.txt" },
  "Ide miš, mali miš": {
    file: "lyrics/ide-mis-mali-mis.txt",
    credit:
      "Tekst, muzika i spot: Damjan Pavlica · Animacija miša: Vladimir Joksimović",
  },
  Udvoje: { file: "lyrics/udvoje.txt" },
  Vasiona: { file: "lyrics/vasiona.txt" },
  Zastor: { file: "lyrics/zastor.txt" },
  "Znam taj dan": { file: "lyrics/znam-taj-dan.txt" },
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
  const resource = lyrics[title];
  if (!resource) return;
  const button = document.createElement("button");
  button.className = "lyric-trigger";
  button.type = "button";
  button.textContent = "Tekst";
  button.addEventListener("click", () => openLyrics(title, resource));
  item.append(button);
});

function play(track) {
  current = track;
  if (progress) {
    progress.value = "0";
    progress.style.setProperty("--progress", "0%");
    progress.disabled = true;
  }
  audio.src = track.path;
  audio.play();
  nowPlaying.textContent = `${track.title} — ${track.album}${track.year ? ` (${track.year})` : ""}`;
  document
    .querySelectorAll(".track")
    .forEach((item) =>
      item.classList.toggle("active", item.dataset.path === track.path),
    );
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
  audio.addEventListener("play", updatePlaybackControls);
  audio.addEventListener("pause", updatePlaybackControls);
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
