// Helmet-cam lap: autoplay (muted) only while it's on screen, and not for
// visitors who've asked their phone to reduce motion.
(function () {
  const v = document.getElementById("lap-video");
  if (!v) return;
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  let userPaused = false;
  v.addEventListener("pause", () => { if (!v.dataset.auto) userPaused = true; delete v.dataset.auto; });
  v.addEventListener("play", () => { userPaused = false; });

  new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !userPaused) {
        v.play().catch(() => {});
      } else if (!e.isIntersecting && !v.paused) {
        v.dataset.auto = "1";
        v.pause();
      }
    });
  }, { threshold: 0.5 }).observe(v);
})();
