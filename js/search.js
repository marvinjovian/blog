/* ==========================================================================
   search.js — modul pencarian realtime (judul, isi, kategori)
   dipakai oleh halaman Semua Tulisan dan Home
   ========================================================================== */

/**
 * Pasang listener pencarian realtime pada input dengan selector tertentu.
 * @param {string} selector - selector CSS untuk elemen input pencarian
 * @param {Function} onQueryChange - callback dipanggil dengan nilai query terbaru
 * @param {number} delay - debounce delay dalam ms
 */
function initSearch(selector, onQueryChange, delay = 150) {
  const input = document.querySelector(selector);
  if (!input) return;

  input.addEventListener(
    "input",
    debounce(() => {
      onQueryChange(input.value);
    }, delay)
  );

  // Dukungan tombol Escape untuk mengosongkan pencarian dengan cepat
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      input.value = "";
      onQueryChange("");
    }
  });
}

/**
 * Cocokkan sebuah tulisan terhadap query pencarian (judul, isi, kategori).
 * @param {Object} post
 * @param {string} query
 */
function matchesSearchQuery(post, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return (
    post.title.toLowerCase().includes(q) ||
    post.category.toLowerCase().includes(q) ||
    stripToPlainText(post.content, 5000).toLowerCase().includes(q)
  );
}
