# Implementation Plan: Productivity Dashboard

## Overview

Implementasi dasbor produktivitas satu halaman menggunakan HTML5, CSS3, dan Vanilla JavaScript murni. Rencana ini mencakup migrasi struktur file, implementasi empat widget utama (Greeting, Focus Timer, To-Do List, Quick Links) beserta fitur challenge (Light/Dark Mode, Custom Name, Prevent Duplicate Tasks), persistensi data via Local Storage, dan persiapan deployment ke GitHub Pages.

## Tasks

- [x] 1. Migrasi struktur file dan setup HTML dasar
  - [x] 1.1 Buat direktori `css/` dan `js/`, lalu pindahkan konten file ke lokasi baru
    - Buat `css/style.css` dan `js/main.js` di lokasi baru
    - Kosongkan atau hapus `style.css` dan `main.js` lama di root (akan digantikan)
    - _Requirements: 7.1, 7.2_
  - [x] 1.2 Perbarui `index.html` dengan struktur markup lengkap semua widget
    - Ganti referensi `<link>` ke `css/style.css` dan `<script>` ke `js/main.js`
    - Tambahkan markup untuk semua widget: `#greeting-widget`, `#timer-widget`, `#todo-widget`, `#quicklinks-widget`
    - Tambahkan elemen `div.dashboard-grid` sebagai container layout
    - _Requirements: 7.1, 7.3, 7.5_

- [x] 2. Implementasi CSS dan Layout Responsif
  - [x] 2.1 Tulis CSS dasar dan layout grid dashboard di `css/style.css`
    - Implementasikan `.dashboard-grid` dengan `display: grid`, dua kolom untuk desktop
    - Buat `#greeting-widget` melintasi penuh lebar (`grid-column: 1 / -1`)
    - Terapkan breakpoint responsif untuk mobile (<768px): satu kolom
    - Styling dasar untuk semua widget (padding, border, background)
    - _Requirements: 7.5_
  - [x] 2.2 Tambahkan styling detail untuk setiap widget
    - Styling tampilan jam, tanggal, dan teks salam di Greeting Widget
    - Styling `#timer-display`, tombol Start/Stop/Reset, dan state disabled
    - Styling daftar todo: `.todo-item`, `.completed` (strikethrough), mode edit inline
    - Styling daftar quick links: `.link-item`, tautan `<a>`, tombol hapus
    - _Requirements: 3.4, 3.5, 3.6, 7.5_

- [x] 3. Implementasi Greeting Widget + Custom Name
  - [x] 3.1 Implementasikan fungsi helper dan update loop di `js/main.js`
    - Tulis `getGreeting(hour)` — pemetaan jam 0–23 ke empat salam bahasa Indonesia
    - Tulis `formatTime(date)` — format `HH:MM:SS` menggunakan `toLocaleTimeString("id-ID")`
    - Tulis `formatDate(date)` — format tanggal lengkap menggunakan `toLocaleDateString("id-ID")`
    - Tulis `updateGreetingWidget()` yang memperbarui `#time`, `#date`, `#greeting`
    - Daftarkan `setInterval(updateGreetingWidget, 1000)` dan panggilan awal
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_
  - [x] 3.2 Tambahkan fitur Custom Name ke Greeting Widget di `js/main.js`
    - Deklarasikan `let userName` dan `STORAGE_KEY_USERNAME = "productivity-username"`
    - Tulis `buildGreetingText(hour, name)` — gabungkan salam dengan nama jika ada
    - Tulis `loadUserName()` — baca dari Local Storage, isi `#name-input`
    - Tulis `saveUserName(name)` — simpan ke Local Storage, hapus key jika nama kosong
    - Update `updateGreetingWidget()` untuk menggunakan `buildGreetingText()`
    - Daftarkan event listener pada `#name-save` dan Enter key di `#name-input`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 4. Implementasi Focus Timer
  - [x] 4.1 Implementasikan state, fungsi, dan event listener Focus Timer di `js/main.js`
    - Deklarasikan `timerState` dengan `totalSeconds`, `intervalId`, `isRunning`
    - Tulis `formatTimerDisplay(totalSeconds)` — format `MM:SS` dengan `padStart`
    - Tulis `startTimer()`, `stopTimer()`, `resetTimer()`
    - Tangani kondisi timer mencapai 00:00 (hentikan otomatis, tampilkan `alert`)
    - Daftarkan event listener pada `#timer-start`, `#timer-stop`, `#timer-reset`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

- [x] 5. Implementasi Light/Dark Mode
  - [x] 5.1 Implementasikan CSS Custom Properties untuk sistem tema di `css/style.css`
    - Tambahkan variabel CSS di `:root` untuk semua warna (bg-primary, bg-secondary, text-primary, text-secondary, accent, border)
    - Tambahkan override variabel untuk `[data-theme="dark"]`
    - Ganti semua nilai warna hardcoded di CSS dengan referensi ke variabel CSS
    - Tambahkan markup tombol `#theme-toggle` ke `index.html`
    - _Requirements: 8.1, 8.2_
  - [x] 5.2 Implementasikan logika toggle tema di `js/main.js`
    - Deklarasikan `let currentTheme` dan `STORAGE_KEY_THEME = "productivity-theme"`
    - Tulis `loadTheme()` — baca dari Local Storage, fallback ke `"light"`
    - Tulis `applyTheme(theme)` — set `data-theme` pada `<html>`, update label tombol
    - Tulis `toggleTheme()` — toggle state, panggil `applyTheme()`, simpan ke Local Storage
    - Daftarkan event listener pada `#theme-toggle`
    - Panggil `loadTheme()` di awal `initApp()` sebelum widget lain diinisialisasi
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 6. Implementasi To-Do List + Prevent Duplicate Tasks
  - [x] 6.1 Implementasikan model data, fungsi CRUD, dan `renderTodos` di `js/main.js`
    - Deklarasikan `let todos = []` dan konstanta `STORAGE_KEY_TODOS`
    - Tulis `generateId()`, `escapeHtml(text)` (pencegahan XSS)
    - Tulis `addTodo(text)` dengan validasi `trim()`, `toggleTodo(id)`, `deleteTodo(id)`
    - Tulis `renderTodos()` yang mengupdate `#todo-list` dan `#todo-count`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.9, 3.10_
  - [x] 6.2 Implementasikan mode edit inline pada To-Do List
    - Ketika tombol "Edit" ditekan, ganti tampilan `<li>` dengan `<input>` dan tombol "Simpan"/"Batal"
    - Tulis `editTodo(id, newText)` dengan validasi teks baru tidak kosong
    - Tombol "Batal" memanggil `renderTodos()` untuk membatalkan tanpa menyimpan
    - Daftarkan semua event listener todo (delegasi event pada `#todo-list`)
    - _Requirements: 3.6, 3.7, 3.8_
  - [x] 6.3 Implementasikan Prevent Duplicate Tasks di `js/main.js`
    - Tulis `isDuplicateTodo(text)` — cek kesamaan case-insensitive dengan semua task yang ada
    - Modifikasi `addTodo(text)` untuk memanggil `isDuplicateTodo()` sebelum menambahkan
    - Tulis `showDuplicateWarning()` — tampilkan `#todo-duplicate-warning` selama 3 detik lalu sembunyikan
    - Tambahkan elemen `<p id="todo-duplicate-warning">` ke markup `#todo-widget` di `index.html`
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 7. Implementasi Persistensi To-Do List
  - [x] 7.1 Implementasikan `loadTodos()` dan `saveTodos()` di `js/main.js`
    - Tulis `saveTodos()` menggunakan `try/catch` untuk menangani `QuotaExceededError`
    - Tulis `loadTodos()` dengan `try/catch` untuk JSON.parse yang gagal, fallback ke `[]`
    - Integrasikan `saveTodos()` ke dalam setiap fungsi mutasi (`addTodo`, `toggleTodo`, `editTodo`, `deleteTodo`)
    - Panggil `loadTodos()` di dalam `initApp()`
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 8. Implementasi Quick Links
  - [x] 8.1 Implementasikan model data, fungsi, dan `renderQuickLinks` di `js/main.js`
    - Deklarasikan `let quickLinks = []` dan konstanta `STORAGE_KEY_LINKS`
    - Tulis `normalizeUrl(url)` — tambahkan `https://` jika tidak ada skema `http://` atau `https://`
    - Tulis `addQuickLink(label, url)` dengan validasi kedua input tidak kosong
    - Tulis `deleteQuickLink(id)` dan `renderQuickLinks()` yang merender `#quicklinks-list`
    - Daftarkan event listener pada `#link-add` dan delegasi event pada `#quicklinks-list`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 9. Implementasi Persistensi Quick Links
  - [x] 9.1 Implementasikan `loadQuickLinks()` dan `saveQuickLinks()` di `js/main.js`
    - Tulis `saveQuickLinks()` dan `loadQuickLinks()` dengan pola yang sama seperti persistensi todos (`try/catch`, fallback ke `[]`)
    - Integrasikan `saveQuickLinks()` ke dalam `addQuickLink()` dan `deleteQuickLink()`
    - Panggil `loadQuickLinks()` di dalam `initApp()`
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 10. Inisialisasi Aplikasi dan Wiring Akhir
  - [x] 10.1 Tulis fungsi `initApp()` dan daftarkan event `DOMContentLoaded` di `js/main.js`
    - Tulis `initApp()` yang memanggil: `loadTheme()`, `loadUserName()`, `updateGreetingWidget()`, `setInterval(updateGreetingWidget, 1000)`, `resetTimer()`, `loadTodos()`, `loadQuickLinks()`
    - Tulis `setupThemeListeners()`, `setupNameListeners()`, `setupTimerListeners()`, `setupTodoListeners()`, `setupQuickLinksListeners()` dan panggil dari `initApp()`
    - Daftarkan `document.addEventListener("DOMContentLoaded", initApp)`
    - _Requirements: 7.3, 7.5_

- [x] 11. Persiapan Deployment ke GitHub Pages
  - [x] 11.1 Pastikan semua file mengikuti struktur yang benar untuk GitHub Pages
    - Verifikasi `index.html` berada di direktori root
    - Verifikasi path referensi ke `css/style.css` dan `js/main.js` menggunakan path relatif (bukan absolut)
    - Pastikan tidak ada referensi ke `localhost` atau path absolut sistem
    - _Requirements: 7.1, 11.6_
  - [x] 11.2 Perbarui README.md dengan informasi proyek
    - Tambahkan deskripsi singkat proyek
    - Tambahkan daftar fitur yang diimplementasikan
    - Tambahkan link ke GitHub Pages setelah deployment (placeholder)
    - Tambahkan instruksi cara menjalankan secara lokal
    - _Requirements: 11.1, 11.2_

## Notes

- Setiap task mereferensikan requirement spesifik untuk keterlacakan
- Tidak ada setup testing yang diperlukan (NFR-1: Simplicity) — semua verifikasi dilakukan secara manual di browser
- Semua JavaScript ditulis sebagai Vanilla JS murni tanpa framework atau library
- Persistensi menggunakan Local Storage dengan key `productivity-todos`, `productivity-quicklinks`, `productivity-theme`, dan `productivity-username`
- Pastikan `loadTheme()` dan `loadUserName()` dipanggil pertama kali di `initApp()` sebelum widget lain diinisialisasi

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1"] },
    { "id": 2, "tasks": ["2.2", "3.1"] },
    { "id": 3, "tasks": ["3.2", "4.1"] },
    { "id": 4, "tasks": ["5.1", "6.1"] },
    { "id": 5, "tasks": ["5.2", "6.2", "7.1", "8.1"] },
    { "id": 6, "tasks": ["6.3", "9.1"] },
    { "id": 7, "tasks": ["10.1"] },
    { "id": 8, "tasks": ["11.1"] },
    { "id": 9, "tasks": ["11.2"] }
  ]
}
```
