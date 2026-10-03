// Tap-to-enlarge photo viewer for the gallery. Uses the native <dialog>.
(function () {
  const box = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const cap = document.getElementById("lightbox-cap");
  const shots = Array.from(document.querySelectorAll(".shot-btn"));
  if (!box || !shots.length || typeof box.showModal !== "function") return;

  let index = 0;

  function show(i) {
    index = (i + shots.length) % shots.length;
    const btn = shots[index];
    const thumb = btn.querySelector("img");
    img.src = btn.dataset.full;
    img.alt = thumb.alt;
    cap.textContent = btn.parentElement.querySelector("figcaption").textContent;
  }

  shots.forEach((btn, i) => btn.addEventListener("click", () => { show(i); box.showModal(); }));
  document.getElementById("lb-close").addEventListener("click", () => box.close());
  document.getElementById("lb-prev").addEventListener("click", () => show(index - 1));
  document.getElementById("lb-next").addEventListener("click", () => show(index + 1));

  // Close when tapping the dark backdrop.
  box.addEventListener("click", (e) => { if (e.target === box) box.close(); });

  box.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  // Swipe left/right on phones.
  let startX = null;
  box.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
