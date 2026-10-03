// Drone videos: one big player plus a sideways-scrolling strip of thumbnails.
// Nothing plays from YouTube until someone taps; picking another video while
// one is playing switches straight to it.
(function () {
  const list = (window.BACUP_CONFIG && window.BACUP_CONFIG.droneVideos) || [];
  const wrap = document.getElementById("flyover");
  const stage = document.getElementById("flyover-stage");
  const strip = document.getElementById("flyover-strip");
  const now = document.getElementById("flyover-now");
  if (!wrap || !stage || !strip) return;

  // Accepts youtu.be/ID, youtube.com/watch?v=ID, /shorts/ID, /embed/ID, /live/ID or a bare ID.
  function idFrom(url) {
    const m = String(url || "").match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/) ||
              String(url || "").match(/^([\w-]{11})$/);
    return m ? m[1] : null;
  }
  const videos = list
    .map((v, i) => ({ id: idFrom(v.url), title: v.title || "Drone video " + (i + 1) }))
    .filter((v) => v.id);
  if (!videos.length) return;

  const thumb = (id) => "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
  let current = 0;
  let playing = false;

  function showPoster(i) {
    const v = videos[i];
    stage.innerHTML = "";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "flyover-btn";
    btn.setAttribute("aria-label", "Play: " + v.title);
    const img = document.createElement("img");
    img.src = "https://i.ytimg.com/vi/" + v.id + "/maxresdefault.jpg";
    img.onerror = () => { img.onerror = null; img.src = thumb(v.id); };
    img.alt = "";
    img.loading = "lazy";
    const play = document.createElement("span");
    play.className = "play";
    play.setAttribute("aria-hidden", "true");
    play.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
    btn.append(img, play);
    btn.addEventListener("click", () => playVideo(i));
    stage.appendChild(btn);
  }

  function playVideo(i) {
    const v = videos[i];
    stage.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube-nocookie.com/embed/" + v.id + "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
    iframe.title = v.title;
    iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
    iframe.allowFullscreen = true;
    iframe.className = "flyover-frame";
    stage.appendChild(iframe);
    playing = true;
  }

  function select(i) {
    current = i;
    now.textContent = videos[i].title;
    strip.querySelectorAll("button").forEach((b, n) => b.setAttribute("aria-current", n === i ? "true" : "false"));
    if (playing) playVideo(i); else showPoster(i);
  }

  videos.forEach((v, i) => {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button";
    b.className = "flyover-card";
    const img = document.createElement("img");
    img.src = thumb(v.id);
    img.alt = "";
    img.loading = "lazy";
    const t = document.createElement("span");
    t.textContent = v.title;
    b.append(img, t);
    b.addEventListener("click", () => {
      select(i);
      stage.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    li.appendChild(b);
    strip.appendChild(li);
  });

  // One video: no strip needed.
  if (videos.length === 1) strip.hidden = true;
  wrap.hidden = false;
  select(0);
})();
