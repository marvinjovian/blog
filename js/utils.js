/* ==========================================================================
   utils.js — fungsi bantu yang dipakai bersama di seluruh halaman
   ========================================================================== */

const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

/**
 * Ambil semua data tulisan dari data/posts.json
 * @returns {Promise<Array>}
 */
async function fetchPosts() {
  const res = await fetch("data/posts.json");
  if (!res.ok) {
    throw new Error("Gagal memuat data tulisan.");
  }
  return res.json();
}

/**
 * Format tanggal ISO (YYYY-MM-DD) menjadi format Indonesia yang mudah dibaca
 * @param {string} isoDate
 */
function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTHS_ID[month - 1]} ${year}`;
}

/**
 * Hitung estimasi waktu baca berdasarkan jumlah kata (asumsi 200 kata/menit)
 * @param {string} htmlContent
 */
function getReadingTime(htmlContent) {
  const text = htmlContent.replace(/<[^>]*>/g, " ");
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return `${minutes} menit baca`;
}

/**
 * Ambil cuplikan teks polos dari konten HTML (dipakai untuk excerpt/pencarian)
 * @param {string} htmlContent
 * @param {number} length
 */
function stripToPlainText(htmlContent, length = 160) {
  const text = htmlContent.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > length ? text.slice(0, length).trim() + "…" : text;
}

/**
 * Escape string agar aman disisipkan ke dalam HTML
 * @param {string} str
 */
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Ambil parameter dari query string URL
 * @param {string} name
 */
function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/**
 * Debounce sederhana untuk input pencarian realtime
 * @param {Function} fn
 * @param {number} delay
 */
function debounce(fn, delay = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Peta warna & label untuk kategori (dipakai konsisten di semua halaman) */
const CATEGORY_LIST = [
  "Puisi", "Cerpen", "Esai", "Opini", "Catatan", "Surat", "Renungan", "Lainnya"
];
