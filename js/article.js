/* ==========================================================================
   article.js — logika halaman detail tulisan
   ========================================================================== */

function wrapParagraphs(rawContent) {
  // Konten di posts.json sudah berupa HTML (paragraf <p>), tampilkan langsung.
  return rawContent;
}

function renderArticleNav(posts, currentIndex, sortedByDate) {
  const navContainer = document.querySelector("[data-article-nav]");
  if (!navContainer) return;

  const prev = sortedByDate[currentIndex + 1]; // lebih lama
  const next = sortedByDate[currentIndex - 1]; // lebih baru

  navContainer.innerHTML = `
    ${
      prev
        ? `<a class="article-nav-link prev" href="article.html?id=${prev.id}">
             <span class="article-nav-label">&larr; Sebelumnya</span>
             <span class="article-nav-title">${escapeHTML(prev.title)}</span>
           </a>`
        : `<span class="article-nav-link placeholder"></span>`
    }
    ${
      next
        ? `<a class="article-nav-link next" href="article.html?id=${next.id}">
             <span class="article-nav-label">Selanjutnya &rarr;</span>
             <span class="article-nav-title">${escapeHTML(next.title)}</span>
           </a>`
        : `<span class="article-nav-link placeholder"></span>`
    }
  `;
}

function initReadingProgress() {
  const bar = document.querySelector("[data-reading-progress]");
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}

function initShareButton(post) {
  const btn = document.querySelector("[data-share-btn]");
  const feedback = document.querySelector("[data-share-feedback]");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const shareData = {
      title: post.title,
      text: `Baca "${post.title}" di Rumah Kata`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        if (feedback) {
          feedback.textContent = "Tautan disalin ke clipboard.";
          feedback.classList.add("visible");
          setTimeout(() => feedback.classList.remove("visible"), 2400);
        }
      }
    } catch (err) {
      // Pengguna membatalkan share, abaikan.
    }
  });
}

function updateSEOTags(post) {
  const title = `${post.title} — Rumah Kata`;
  document.title = title;

  const description = stripToPlainText(post.content, 155);
  const setMeta = (selector, attr, value) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };

  setMeta('meta[name="description"]', "content", description);
  setMeta('meta[property="og:title"]', "content", title);
  setMeta('meta[property="og:description"]', "content", description);
  setMeta('meta[property="og:url"]', "content", window.location.href);
  setMeta('meta[name="twitter:title"]', "content", title);
  setMeta('meta[name="twitter:description"]', "content", description);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", window.location.href);

  // Schema.org Article
  const schemaEl = document.querySelector("[data-article-schema]");
  if (schemaEl) {
    schemaEl.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      datePublished: post.date,
      articleSection: post.category,
      description,
      author: { "@type": "Person", name: "Penulis Rumah Kata" },
    });
  }
}

async function initArticlePage() {
  const root = document.querySelector("[data-article-root]");
  if (!root) return;

  const id = Number(getQueryParam("id"));

  try {
    const posts = await fetchPosts();
    const post = posts.find((p) => p.id === id);

    if (!post) {
      root.innerHTML = `
        <div class="no-results">
          <h3>Tulisan tidak ditemukan</h3>
          <p>Tulisan yang kamu cari mungkin sudah dipindahkan atau dihapus.</p>
          <p><a class="btn btn-primary" href="posts.html">Lihat semua tulisan</a></p>
        </div>`;
      return;
    }

    document.querySelector("[data-article-tag]").textContent = post.category;
    document.querySelector("[data-article-title]").textContent = post.title;
    document.querySelector("[data-article-date]").textContent = formatDate(post.date);
    document.querySelector("[data-article-reading-time]").textContent = getReadingTime(post.content);
    document.querySelector("[data-article-body]").innerHTML = wrapParagraphs(post.content);

    updateSEOTags(post);
    initShareButton(post);
    initReadingProgress();

    const sortedByDate = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    const currentIndex = sortedByDate.findIndex((p) => p.id === post.id);
    renderArticleNav(posts, currentIndex, sortedByDate);

    root.classList.add("is-ready");
  } catch (err) {
    root.innerHTML = `<div class="no-results"><h3>Gagal memuat tulisan</h3><p>Silakan segarkan halaman ini.</p></div>`;
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initArticlePage();
});
