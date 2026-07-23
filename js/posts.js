/* ==========================================================================
   posts.js — logika halaman "Semua Tulisan": render, urutkan, filter
   ========================================================================== */

let allPosts = [];
let activeCategory = "Semua";
let activeSort = "terbaru";
let activeQuery = "";

function sortPosts(posts, mode) {
  const list = [...posts];
  if (mode === "terbaru") {
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (mode === "terlama") {
    list.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (mode === "judul") {
    list.sort((a, b) => a.title.localeCompare(b.title, "id"));
  }
  return list;
}

function filterPosts(posts) {
  return posts.filter((post) => {
    const matchesCategory = activeCategory === "Semua" || post.category === activeCategory;
    return matchesCategory && matchesSearchQuery(post, activeQuery);
  });
}

function renderGrid() {
  const container = document.querySelector("[data-post-grid]");
  const countEl = document.querySelector("[data-result-count]");
  if (!container) return;

  const filtered = filterPosts(allPosts);
  const sorted = sortPosts(filtered, activeSort);

  if (countEl) {
    countEl.textContent = `${sorted.length} tulisan`;
  }

  if (sorted.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <h3>Tidak ada tulisan ditemukan</h3>
        <p>Coba kata kunci lain atau pilih kategori berbeda.</p>
      </div>`;
    return;
  }

  container.innerHTML = sorted
    .map(
      (post, i) => `
      <article class="post-card" style="animation-delay:${Math.min(i, 8) * 60}ms">
        <div class="post-card-top">
          <span class="post-tag">${escapeHTML(post.category)}</span>
          <span class="post-meta">${formatDate(post.date)}</span>
        </div>
        <h3><a href="article.html?id=${post.id}">${escapeHTML(post.title)}</a></h3>
        <p class="post-excerpt">${escapeHTML(post.excerpt || stripToPlainText(post.content))}</p>
        <div class="post-card-footer">
          <span>${getReadingTime(post.content)}</span>
          <a class="read-link" href="article.html?id=${post.id}">
            Baca <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </article>`
    )
    .join("");
}

function initFilterChips() {
  const row = document.querySelector("[data-filter-row]");
  if (!row) return;

  const categories = ["Semua", ...CATEGORY_LIST];
  row.innerHTML = categories
    .map(
      (cat) =>
        `<button class="filter-chip" data-category="${escapeHTML(cat)}" aria-pressed="${cat === "Semua"}">${escapeHTML(cat)}</button>`
    )
    .join("");

  row.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-chip");
    if (!btn) return;

    row.querySelectorAll(".filter-chip").forEach((chip) => chip.setAttribute("aria-pressed", "false"));
    btn.setAttribute("aria-pressed", "true");
    activeCategory = btn.dataset.category;
    renderGrid();
  });
}

function initSortSelect() {
  const select = document.querySelector("[data-sort-select]");
  if (!select) return;

  select.addEventListener("change", () => {
    activeSort = select.value;
    renderGrid();
  });
}

async function initPostsPage() {
  const container = document.querySelector("[data-post-grid]");
  if (!container) return;

  renderLatestSkeletonLocal(container);

  try {
    allPosts = await fetchPosts();

    const presetCategory = getQueryParam("kategori");
    if (presetCategory && CATEGORY_LIST.includes(presetCategory)) {
      activeCategory = presetCategory;
    }

    initFilterChips();
    // Sinkronkan tombol filter aktif jika ada preset dari URL
    if (presetCategory) {
      document.querySelectorAll(".filter-chip").forEach((chip) => {
        chip.setAttribute("aria-pressed", String(chip.dataset.category === activeCategory));
      });
    }

    initSortSelect();
    initSearch("[data-post-search]", (query) => {
      activeQuery = query;
      renderGrid();
    });
    renderGrid();
  } catch (err) {
    container.innerHTML = `<div class="no-results"><h3>Gagal memuat tulisan</h3><p>Silakan segarkan halaman ini.</p></div>`;
    console.error(err);
  }
}

function renderLatestSkeletonLocal(container, count = 6) {
  container.innerHTML = Array.from({ length: count })
    .map(
      () => `
      <div class="skeleton-card" aria-hidden="true">
        <div class="skeleton-line tag"></div>
        <div class="skeleton-line title"></div>
        <div class="skeleton-line title-2"></div>
        <div class="skeleton-line excerpt"></div>
        <div class="skeleton-line excerpt-2"></div>
      </div>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  initPostsPage();
});
