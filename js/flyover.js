// Drone flyover: shows a thumbnail with a play button. Tapping it swaps in the
// YouTube player, so nothing loads from YouTube until someone asks for it.
(function () {
  const url = window.BACUP_CONFIG && window.BACUP_CONFIG.flyoverYoutubeUrl;
  const wrap = document.getElementById("flyover");
  const btn = document.getElementById("flyover-btn");
  if (!url || !wrap || !btn) return;

  // Accepts youtu.be/ID, youtube.com/watch?v=ID, /shorts/ID, /embed/ID or a bare ID.
  const m = url.match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/) || url.match(/^([\w-]{11})$/);
  if (!m) return;
  const id = m[1];

  wrap.hidden = false;
  btn.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
    iframe.title = "Bacup MX drone flyover";
    iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
    iframe.allowFullscreen = true;
    iframe.className = "flyover-frame";
    btn.replaceWith(iframe);
  });
})();
