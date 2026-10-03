// Renders the kit list with affiliate shop links from js/config.js.
(function () {
  const links = (window.BACUP_CONFIG && window.BACUP_CONFIG.affiliateLinks) || {};

  const KIT = [
    { key: "helmet",  name: "Motocross helmet",      must: true,  text: "Must meet ECE 22.06 (or 22.05). Replace after any big crash, even if it looks fine." },
    { key: "goggles", name: "Goggles",               must: true,  text: "Tear-offs or roll-offs help on muddy Pennine days." },
    { key: "boots",   name: "MX boots",              must: true,  text: "Proper motocross boots that cover the shin. Trainers and wellies are not allowed." },
    { key: "gloves",  name: "Gloves",                must: true,  text: "Full-finger MX gloves for grip and blister protection." },
    { key: "kit",     name: "Jersey and pants",      must: false, text: "Long sleeves and long legs protect against roost and scrapes. Pants with knee panels last longest." },
    { key: "armour",  name: "Body armour",           must: false, text: "Chest and back protector. Strongly advised for kids and new riders." },
    { key: "knee",    name: "Knee guards or braces", must: false, text: "Guards for beginners. Braces for riders jumping regularly." },
    { key: "neck",    name: "Neck brace",            must: false, text: "Extra protection in a crash. Get it fitted with the helmet." }
  ];

  const list = document.getElementById("kit-list");
  if (!list) return;

  for (const item of KIT) {
    const url = links[item.key];
    const placeholder = !url || url === "REPLACE_ME";

    const card = document.createElement("article");
    card.className = "item";

    const tag = document.createElement("span");
    tag.className = "tag " + (item.must ? "must" : "rec");
    tag.textContent = item.must ? "Required" : "Recommended";

    const h3 = document.createElement("h3");
    h3.textContent = item.name;

    const p = document.createElement("p");
    p.textContent = item.text;

    const actions = document.createElement("div");
    actions.style.cssText = "display:grid;gap:.4rem";

    const a = document.createElement("a");
    a.className = "btn";
    a.textContent = "Shop now";
    if (placeholder) {
      a.href = "#kit";
    } else {
      a.href = url;
      a.target = "_blank";
      a.rel = "sponsored noopener";
    }
    actions.appendChild(a);

    if (placeholder) {
      const ph = document.createElement("span");
      ph.className = "ph";
      ph.textContent = "placeholder link";
      actions.appendChild(ph);
    }

    card.append(tag, h3, p, actions);
    list.appendChild(card);
  }
})();
