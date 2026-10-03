// Sticky section tabs: highlight the section in view and keep its tab visible.
(function () {
  const header = document.querySelector(".nav");
  const strip = document.querySelector(".tabs ul");
  const links = Array.from(document.querySelectorAll(".tabs a"));
  if (!header || !strip || !links.length) return;

  // Offset anchor jumps by the real header height.
  function setNavHeight() {
    document.documentElement.style.setProperty("--nav-h", header.offsetHeight + "px");
  }
  setNavHeight();
  window.addEventListener("resize", setNavHeight);

  const targets = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  function setActive(id) {
    links.forEach((a) => {
      const on = a.getAttribute("href") === "#" + id;
      if (on) {
        a.setAttribute("aria-current", "true");
        // Scroll the tab strip only, never the page.
        const left = a.offsetLeft - (strip.clientWidth - a.offsetWidth) / 2;
        strip.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  // After a tab tap, keep that tab lit while the page scrolls to it.
  let lockUntil = 0;
  links.forEach((a) => a.addEventListener("click", () => {
    lockUntil = Date.now() + 1200;
    setActive(a.getAttribute("href").slice(1));
  }));

  // The active section is the one whose top most recently passed under the header.
  let ticking = false;
  function update() {
    ticking = false;
    if (Date.now() < lockUntil) return;
    const line = header.offsetHeight + window.innerHeight * 0.25;
    let current = null, best = -Infinity;
    for (const t of targets) {
      const top = t.getBoundingClientRect().top;
      if (top <= line && top > best) { best = top; current = t.id; }
    }
    const active = links.find((a) => a.getAttribute("aria-current") === "true");
    if (!current) { if (active) active.removeAttribute("aria-current"); return; }
    if (!active || active.getAttribute("href") !== "#" + current) setActive(current);
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();
