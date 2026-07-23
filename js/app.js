/* ==========================================================================
   app.js — inisialisasi umum: navigasi mobile & konten halaman Home
   ========================================================================== */

function initMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-main-nav]");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function renderLatestSkeleton(container, count = 3) {
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

function postCardHTML(post) {
  return `
    <article class="post-card">
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
    </article>`;
}

async function renderLatestPosts() {
  const container = document.querySelector("[data-latest-posts]");
  if (!container) return;

  renderLatestSkeleton(container);

  try {
    const posts = await fetchPosts();
    const latest = [...posts]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);

    if (latest.length === 0) {
      container.innerHTML = `<div class="no-results"><h3>Belum ada tulisan</h3><p>Tulisan pertama akan segera hadir.</p></div>`;
      return;
    }

    container.innerHTML = latest
      .map((post, i) => postCardHTML(post).replace('class="post-card"', `class="post-card" style="animation-delay:${i * 60}ms"`))
      .join("");
  } catch (err) {
    container.innerHTML = `<div class="no-results"><h3>Gagal memuat tulisan</h3><p>Silakan segarkan halaman ini.</p></div>`;
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  renderLatestPosts();
});
