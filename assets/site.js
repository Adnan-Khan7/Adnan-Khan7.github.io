async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
}

function formatDateISO(iso) {
  // expects YYYY-MM-DD
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m - 1), d);
  return dt.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

function renderNews(items, targetEl, limit = null) {
  // newest first, regardless of order in the JSON (ISO dates sort as strings)
  const data = (Array.isArray(items) ? items : [])
    .slice()
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const shown = limit ? data.slice(0, limit) : data;

  const ul = document.createElement("ul");
  for (const item of shown) {
    const li = document.createElement("li");

    const date = item.date ? formatDateISO(item.date) : "";
    const strong = document.createElement("strong");
    strong.textContent = date ? `${date}: ` : "";

    li.appendChild(strong);
    li.appendChild(document.createTextNode(item.text || ""));

    if (item.link) {
      li.appendChild(document.createTextNode(" "));
      const a = document.createElement("a");
      a.href = item.link;
      a.textContent = item.linkText || "link";
      a.target = "_blank";
      a.rel = "noopener";
      li.appendChild(a);
    }

    ul.appendChild(li);
  }

  targetEl.innerHTML = "";
  targetEl.appendChild(ul);
}

function highlightSelf(authors) {
  return (authors || "").replace("Adnan Khan", "<strong>Adnan Khan</strong>");
}

function pubLinks(p) {
  return [
    ["Paper", p.url],
    ["Project page", p.project],
    ["Code", p.code],
    ["Dataset", p.dataset],
    ["Video", p.video]
  ].filter(([, href]) => href)
   .map(([label, href]) => `<a href="${href}" target="_blank" rel="noopener">${label}</a>`)
   .join(" · ");
}

function renderPublications(pubs, tbodyEl) {
  const data = Array.isArray(pubs) ? pubs : [];
  tbodyEl.innerHTML = "";

  for (const p of data) {
    const tr = document.createElement("tr");

    const links = pubLinks(p);

    const tdTitle = document.createElement("td");
    tdTitle.innerHTML = `<div><strong>${p.title || ""}</strong></div>
                         <div class="muted">${highlightSelf(p.authors)}</div>
                         ${links ? `<div>${links}</div>` : ""}`;

    const tdVenue = document.createElement("td");
    tdVenue.textContent = p.venue || "";

    const tdYear = document.createElement("td");
    tdYear.textContent = p.year || "";

    tr.appendChild(tdTitle);
    tr.appendChild(tdVenue);
    tr.appendChild(tdYear);
    tbodyEl.appendChild(tr);
  }
}

// Compact numbered list for the CV page (also used when printing the CV to PDF)
function renderPublicationList(pubs, targetEl) {
  const data = Array.isArray(pubs) ? pubs : [];
  const ol = document.createElement("ol");
  ol.className = "pub-list";

  for (const p of data) {
    const li = document.createElement("li");
    const links = pubLinks(p);
    li.innerHTML = `<strong>${p.title || ""}</strong>. ${highlightSelf(p.authors)}.
                    <em>${p.venue || ""}</em>, ${p.year || ""}.
                    ${links ? `<span class="pub-links">${links}</span>` : ""}`;
    ol.appendChild(li);
  }

  targetEl.innerHTML = "";
  targetEl.appendChild(ol);
}

window.Site = { loadJSON, renderNews, renderPublications, renderPublicationList };
