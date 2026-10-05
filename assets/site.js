async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
}

function formatDateISO(iso) {
  // expects YYYY-MM-DD
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m - 1), d);
  return dt.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

function renderNews(items, targetEl, limit = null) {
  const data = Array.isArray(items) ? items : [];
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

function renderPublications(pubs, tbodyEl) {
  const data = Array.isArray(pubs) ? pubs : [];
  tbodyEl.innerHTML = "";

  for (const p of data) {
    const tr = document.createElement("tr");

    const links = [
      ["Paper", p.url],
      ["Project page", p.project],
      ["Code", p.code],
      ["Dataset", p.dataset],
      ["Video", p.video]
    ].filter(([, href]) => href)
     .map(([label, href]) => `<a href="${href}" target="_blank" rel="noopener">${label}</a>`)
     .join(" · ");

    const tdTitle = document.createElement("td");
    tdTitle.innerHTML = `<div><strong>${p.title || ""}</strong></div>
                         <div class="muted">${p.authors || ""}</div>
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

window.Site = { loadJSON, renderNews, renderPublications };
