# Productivity Dashboard

Aplikasi web satu halaman (single-page) berbasis HTML5, CSS3, dan Vanilla JavaScript murni yang berfungsi sebagai dasbor produktivitas pribadi. Menampilkan informasi waktu real-time, timer fokus Pomodoro, daftar tugas harian, dan tautan cepat yang dapat dikustomisasi — semua berjalan langsung di browser tanpa memerlukan server atau instalasi apapun.

## Demo

🔗 [https://[username].github.io/CodingCamp-Batch-Faqih/](https://[username].github.io/CodingCamp-Batch-Faqih/)

> Ganti `[username]` dengan username GitHub Anda setelah melakukan deployment ke GitHub Pages.

---

## Fitur

### Fitur Utama

- **Greeting Widget** — Menampilkan salam yang otomatis menyesuaikan waktu hari (Selamat Pagi / Siang / Sore / Malam) beserta jam `HH:MM:SS` dan tanggal lengkap dalam bahasa Indonesia yang diperbarui setiap detik.
- **Focus Timer 25 Menit (Pomodoro)** — Timer hitungan mundur dengan kontrol Start, Stop, dan Reset. Menampilkan notifikasi ketika sesi fokus 25 menit selesai.
- **To-Do List** — Pengelola daftar tugas harian dengan fitur tambah, edit inline, tandai selesai (strikethrough), dan hapus. Menampilkan jumlah tugas yang belum selesai secara dinamis.
- **Quick Links** — Pengelola tautan cepat dengan normalisasi URL otomatis (menambahkan `https://` jika diperlukan). Tautan dibuka di tab browser baru.
- **Persistensi Data via Local Storage** — Semua data (tugas, tautan, preferensi tema, nama pengguna) tersimpan otomatis di browser dan tetap ada setelah halaman ditutup atau di-refresh.

### Challenge Features

- 🌙 **Light / Dark Mode** — Toggle tema terang dan gelap. Preferensi disimpan dan diterapkan otomatis saat halaman dibuka kembali.
- 👤 **Custom Name di Greeting** — Pengguna dapat mengatur nama yang ditampilkan pada salam (contoh: "Selamat Pagi, Faqih!"). Nama disimpan di Local Storage.
- 🚫 **Prevent Duplicate Tasks** — Sistem mencegah penambahan tugas yang sama persis (perbandingan case-insensitive) dan menampilkan pesan peringatan kepada pengguna.

---

## Teknologi

| Teknologi | Keterangan |
|-----------|------------|
| HTML5 | Struktur dan markup halaman |
| CSS3 | Styling, layout grid, dan CSS Custom Properties untuk tema |
| Vanilla JavaScript | Seluruh logika aplikasi tanpa framework atau library |

Tidak menggunakan framework, library pihak ketiga, atau backend server.

---

## Struktur File

```
CodingCamp-Batch-Faqih/
├── index.html        # Halaman utama aplikasi
├── css/
│   └── style.css     # Seluruh styling dan variabel tema
├── js/
│   └── main.js       # Seluruh logika JavaScript
└── README.md         # Dokumentasi proyek
```

---

## Cara Menjalankan Secara Lokal

Tidak diperlukan instalasi, web server, atau perintah apapun.

1. Clone atau download repository ini.
2. Buka file `index.html` langsung di browser modern (Chrome, Firefox, Edge, atau Safari).
3. Aplikasi langsung berjalan — selesai.

```bash
# Opsional: clone via git
git clone https://github.com/[username]/CodingCamp-Batch-Faqih.git

# Lalu buka index.html di browser
```

Browser yang didukung: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+.

---

## Deployment ke GitHub Pages

1. Push seluruh file ke branch `main` di repository GitHub Anda.
2. Buka halaman repository → **Settings** → **Pages**.
3. Di bagian **Source**, pilih branch `main` dan folder `/ (root)`.
4. Klik **Save**. GitHub Pages akan menerbitkan aplikasi dalam beberapa menit.
5. URL publik akan tersedia di: `https://[username].github.io/CodingCamp-Batch-Faqih/`

---

## Lisensi

Proyek ini dibuat sebagai bagian dari program CodingCamp RevoU Software Engineer.
