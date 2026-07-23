/* ==========================================================================
   darkmode.js — kelola preferensi mode gelap/terang via localStorage
   ========================================================================== */

const THEME_KEY = "rumahkata-theme";

function applyStoredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
}

function initThemeToggle() {
  const toggleBtn = document.querySelector("[data-theme-toggle]");
  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
  });
}

// Terapkan tema sesegera mungkin agar tidak terjadi flash warna salah
applyStoredTheme();
document.addEventListener("DOMContentLoaded", initThemeToggle);
