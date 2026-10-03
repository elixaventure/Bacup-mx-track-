// Track status box.
// 1. Always shows today's normal hours from openingHours in js/config.js.
// 2. If a Google Sheet is set up and has today's date, the sheet wins
//    (e.g. "closed" for weather, a message, a sign-on time).
//
// Sheet layout: row 1 headers, row 2 values:
//   status | message | hours | sign_on | date
// status is one of: open, closed, check
// date is the day the status applies to (e.g. 04/10/2026). A sheet row with
// any other date is ignored, so a forgotten update never shows as today's.
(function () {
  const config = window.BACUP_CONFIG || {};
  const hours = config.openingHours || {};
  const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const $ = (id) => document.getElementById(id);

  function setState(state, label) {
    $("st-light").dataset.state = state;
    $("st-label").textContent = label;
  }

  function toMinutes(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }

  // Next opening after now, as "Tuesday 09:00" (or "today 10:00").
  function nextOpen(now) {
    const mins = now.getHours() * 60 + now.getMinutes();
    for (let i = 0; i < 8; i++) {
      const day = (now.getDay() + i) % 7;
      const h = hours[DAY_KEYS[day]];
      if (!h) continue;
      if (i === 0 && mins >= toMinutes(h[0])) continue;
      const name = i === 0 ? "Today" : i === 1 ? "Tomorrow" : DAY_NAMES[day];
      return name + " " + h[0];
    }
    return "";
  }

  // Baseline from normal opening hours.
  function renderSchedule() {
    const now = new Date();
    const today = hours[DAY_KEYS[now.getDay()]];
    const mins = now.getHours() * 60 + now.getMinutes();

    const row = document.querySelector('#hours-body tr[data-day="' + now.getDay() + '"]');
    if (row) row.classList.add("today");

    if (!today) {
      setState("closed", "Closed today");
      $("st-hours").textContent = "Closed";
    } else if (mins >= toMinutes(today[1])) {
      setState("closed", "Closed now");
      $("st-hours").textContent = today[0] + "–" + today[1];
    } else {
      setState("open", mins < toMinutes(today[0]) ? "Open later today" : "Open now");
      $("st-hours").textContent = today[0] + "–" + today[1];
    }
    const next = nextOpen(now);
    if (next) $("st-next").textContent = next;
  }

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

  // Today's update from the sheet overrides the schedule.
  function renderSheet(s) {
    const date = parseDate(s.date);
    if (!date || date.toDateString() !== new Date().toDateString()) return;

    const LABELS = { open: "Open today", closed: "Closed today", check: "Check back later" };
    const state = (s.status || "").trim().toLowerCase();
    if (LABELS[state]) setState(state, LABELS[state]);
    if (state === "closed") $("st-hours").textContent = "Closed";
    if (s.hours) $("st-hours").textContent = s.hours;

    if (s.sign_on) {
      $("st-signon").textContent = s.sign_on;
      $("st-signon-row").hidden = false;
    }
    const msg = $("st-msg");
    msg.textContent = s.message || "";
    msg.hidden = !s.message;
    $("st-updated").textContent = "Updated by the track today.";
  }

  renderSchedule();

  const url = config.statusSheetCsvUrl;
  if (!url) return;
  fetch(url + (url.includes("?") ? "&" : "?") + "t=" + Date.now(), { cache: "no-store" })
    .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
    .then((text) => {
      const rows = parseCsv(text).filter((r) => r.some((c) => c.trim()));
      if (rows.length < 2) return;
      const keys = rows[0].map((h) => h.trim().toLowerCase().replace(/[\s-]+/g, "_"));
      const s = {};
      keys.forEach((k, i) => { s[k] = (rows[1][i] || "").trim(); });
      renderSheet(s);
    })
    .catch(() => {
      // Keep the schedule-based status.
    });
})();
