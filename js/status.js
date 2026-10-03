// Track status from a published Google Sheet (CSV).
// Sheet layout: row 1 headers, row 2 values:
//   status | message | days | hours | sign_on | date
// status is one of: open, closed, check
// date is the day the status applies to (e.g. 04/10/2026). If it isn't today,
// the site says when it was last set so riders don't trust a stale status.
(function () {
  const url = window.BACUP_CONFIG && window.BACUP_CONFIG.statusSheetCsvUrl;
  if (!url) return;

  const LABELS = { open: "Open today", closed: "Closed today", check: "Check back later" };
  const $ = (id) => document.getElementById(id);

  // Minimal CSV parser: handles quoted fields, commas and newlines inside quotes.
  function parseCsv(text) {
    const rows = [];
    let row = [], field = "", quoted = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (quoted) {
        if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
        else if (c === '"') quoted = false;
        else field += c;
      } else if (c === '"') quoted = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field); rows.push(row); row = []; field = "";
      } else field += c;
    }
    if (field || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  // Accepts UK-style dates (04/10/2026, 4/10/26) or ISO (2026-10-04).
  function parseDate(s) {
    s = (s || "").trim();
    let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
    if (m) return new Date(m[3].length === 2 ? 2000 + +m[3] : +m[3], +m[2] - 1, +m[1]);
    return null;
  }

  function setText(id, value) {
    if (value) $(id).textContent = value;
  }

  function render(s) {
    const state = (s.status || "").trim().toLowerCase();
    const date = parseDate(s.date);
    const today = new Date();
    const isToday = date && date.toDateString() === today.toDateString();

    setText("st-days", s.days);
    setText("st-hours", s.hours);
    setText("st-signon", s.sign_on);

    const msg = $("st-msg");
    msg.textContent = s.message || "";
    msg.hidden = !s.message;

    if (!LABELS[state]) return;

    if (date && !isToday) {
      // Stale or future status: don't show a confident open/closed light.
      $("st-light").dataset.state = "check";
      $("st-label").textContent = "Not updated today";
      $("st-updated").textContent =
        "Last update was for " +
        date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) +
        ". Check our socials before you set off.";
      return;
    }

    $("st-light").dataset.state = state;
    $("st-label").textContent = LABELS[state];
    $("st-updated").textContent = date
      ? "Updated for today. We close in heavy rain to protect the track."
      : "We close in heavy rain to protect the track.";
  }

  fetch(url + (url.includes("?") ? "&" : "?") + "t=" + Date.now(), { cache: "no-store" })
    .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
    .then((text) => {
      const rows = parseCsv(text).filter((r) => r.some((c) => c.trim()));
      if (rows.length < 2) return;
      const keys = rows[0].map((h) => h.trim().toLowerCase().replace(/[\s-]+/g, "_"));
      const s = {};
      keys.forEach((k, i) => { s[k] = (rows[1][i] || "").trim(); });
      render(s);
    })
    .catch(() => {
      // Leave the static fallback text in place.
    });
})();
