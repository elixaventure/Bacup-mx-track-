// Bacup MX site settings. This is the only file you need to edit for
// affiliate links and the track status sheet.

window.BACUP_CONFIG = {
  // Track status: the "Publish to web" CSV link of your Google Sheet.
  // See README.md for how to set the sheet up. Leave as "" to hide live status.
  statusSheetCsvUrl: "",

  // Drone videos on YouTube. Add one line per video: the YouTube link and a
  // short title. The first one shows in the big player. Leave the list empty
  // to hide the section.
  // Example: { url: "https://youtu.be/abc123XYZ00", title: "Full track flyover" },
  droneVideos: [
  ],

  // Normal opening hours, used for "Hours today" and "Next open" when the
  // sheet hasn't been updated today. null means closed. Keep in step with the
  // opening times table in index.html.
  openingHours: {
    mon: null,
    tue: ["09:00", "16:00"],
    wed: ["10:00", "20:00"],
    thu: null,
    fri: ["10:00", "18:00"],
    sat: ["09:00", "16:00"],
    sun: ["09:00", "16:00"]
  },

  // Affiliate shop links. Replace each REPLACE_ME with the full affiliate URL.
  // Any link still set to REPLACE_ME shows a "placeholder link" tag on the site.
  affiliateLinks: {
    helmet:  "REPLACE_ME",
    goggles: "REPLACE_ME",
    boots:   "REPLACE_ME",
    gloves:  "REPLACE_ME",
    kit:     "REPLACE_ME",
    armour:  "REPLACE_ME",
    knee:    "REPLACE_ME",
    neck:    "REPLACE_ME"
  }
};
