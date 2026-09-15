const gallery = document.querySelector(".gallery-grid");

if (gallery) {
  const dialog = document.createElement("dialog");
  dialog.className = "gallery-dialog";
  dialog.innerHTML =
    '<div class="gallery-dialog-frame"><form method="dialog"><button class="gallery-close" type="submit">Zatvori</button></form><img class="gallery-dialog-image" alt=""></div>';
  document.body.append(dialog);

  const dialogImage = dialog.querySelector(".gallery-dialog-image");

  gallery.querySelectorAll(".gallery-item").forEach((item) => {
    const image = item.querySelector("img");
    const caption =
      item.querySelector("figcaption")?.textContent.trim() || image.alt;
    const open = document.createElement("button");
    open.className = "gallery-open";
    open.type = "button";
    open.setAttribute("aria-label", `Otvori celu sliku: ${caption}`);
    open.addEventListener("click", () => {
      dialogImage.src = image.currentSrc || image.src;
      dialogImage.alt = image.alt;
      dialog.showModal();
    });
    item.append(open);
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}
