# Rumah Kata

Perpustakaan digital pribadi — HTML, CSS, dan JavaScript murni (tanpa framework, tanpa backend).

## Cara menambah tulisan baru

Buka `data/posts.json` dan tambahkan objek baru ke dalam array:

```json
{
  "id": 7,
  "title": "Judul Tulisan",
  "category": "Puisi",
  "date": "2026-07-23",
  "excerpt": "Ringkasan singkat satu-dua kalimat (opsional, ditampilkan di kartu).",
  "cover": "images/cover-7.jpg",
  "content": "<p>Paragraf pertama...</p><p>Paragraf kedua...</p>"
}
```

Catatan:
- `id` harus unik dan berupa angka.
- `category` sebaiknya salah satu dari: Puisi, Cerpen, Esai, Opini, Catatan, Surat, Renungan, Lainnya (agar muncul rapi di filter). Kategori lain tetap akan tampil, tapi tidak akan punya tombol filter khusus kecuali ditambahkan ke `CATEGORY_LIST` di `js/utils.js`.
- `content` ditulis dalam HTML sederhana (`<p>`, `<blockquote>`, `<br>`, dll).
- Waktu baca dihitung otomatis dari jumlah kata di `content`.
- Tidak perlu database atau server — cukup simpan file ini dan unggah ulang.

## Struktur folder

```
blog/
├── index.html       Beranda
├── posts.html        Semua tulisan (cari, filter, urutkan)
├── article.html       Halaman detail tulisan
├── about.html         Tentang saya
├── css/
├── js/
├── data/posts.json    Satu-satunya sumber data
├── images/
└── assets/
```

## Deploy

Situs ini statis sepenuhnya — unggah folder ini apa adanya ke GitHub Pages, Vercel, atau Netlify. Tidak perlu konfigurasi build atau backend.
