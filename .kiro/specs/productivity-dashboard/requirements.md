# Requirements Document

## Pendahuluan

Productivity Dashboard adalah aplikasi web satu halaman (single-page) berbasis HTML, CSS, dan Vanilla JavaScript murni. Aplikasi ini dirancang sebagai dasbor produktivitas pribadi yang menampilkan informasi waktu secara real-time, timer fokus 25 menit, daftar tugas (to-do list), dan quick links yang dapat dikustomisasi. Semua data pengguna disimpan secara lokal menggunakan Local Storage browser tanpa memerlukan backend atau framework tambahan.

Proyek ini merupakan pengembangan dari kode yang sudah ada di workspace (index.html, css/style.css, js/main.js) yang saat ini sudah memiliki fungsionalitas dasar jam dan greeting.

Selain fitur inti, proyek ini juga mencakup 3 *challenge features*: **Light/Dark Mode** (Requirement 8) untuk kenyamanan visual pengguna, **Custom Name di Greeting** (Requirement 9) untuk personalisasi salam, dan **Prevent Duplicate Tasks** (Requirement 10) untuk menjaga kebersihan daftar tugas.

## Glossary

- **Dashboard**: Halaman utama aplikasi yang menampilkan semua widget secara terpadu dalam satu tampilan.
- **Greeting Widget**: Komponen yang menampilkan salam berdasarkan waktu hari, jam berjalan, dan tanggal.
- **Focus Timer**: Komponen countdown timer 25 menit yang dapat dijalankan, dihentikan, dan direset.
- **To-Do List**: Komponen pengelola daftar tugas yang mendukung operasi tambah, edit, tandai selesai, dan hapus.
- **Task**: Satu item tugas dalam To-Do List yang memiliki teks deskripsi dan status selesai/belum selesai.
- **Quick Links**: Komponen pengelola daftar tautan cepat yang mendukung operasi tambah, hapus, dan buka URL.
- **Link Item**: Satu entri tautan dalam Quick Links yang memiliki label dan URL.
- **Local Storage**: Mekanisme penyimpanan data di browser pengguna tanpa memerlukan server.
- **Sistem**: Aplikasi Productivity Dashboard secara keseluruhan.
- **Browser Modern**: Google Chrome 90+, Mozilla Firefox 88+, Microsoft Edge 90+, Safari 14+.
- **Light Mode**: Skema warna terang (latar belakang cerah, teks gelap) sebagai tampilan default dashboard.
- **Dark Mode**: Skema warna gelap (latar belakang gelap, teks terang) sebagai alternatif tampilan dashboard.
- **Custom Name**: Nama pengguna yang dikustomisasi dan ditampilkan pada salam di Greeting Widget.
- **Duplicate Task**: Task yang teks deskripsinya (setelah trim dan dibandingkan secara case-insensitive) identik dengan Task yang sudah ada dalam daftar.

## Requirements

### Requirement 1: Greeting Widget dengan Jam dan Tanggal Real-Time

**User Story:** Sebagai pengguna, saya ingin melihat salam yang sesuai dengan waktu hari ini beserta jam dan tanggal yang selalu diperbarui, sehingga saya dapat mengetahui konteks waktu saat membuka dashboard.

#### Acceptance Criteria

1. WHEN halaman Dashboard dibuka, THE Greeting Widget SHALL menampilkan salam "Selamat Pagi" apabila jam saat ini berada di antara pukul 00:00 hingga 11:59.
2. WHEN halaman Dashboard dibuka, THE Greeting Widget SHALL menampilkan salam "Selamat Siang" apabila jam saat ini berada di antara pukul 12:00 hingga 14:59.
3. WHEN halaman Dashboard dibuka, THE Greeting Widget SHALL menampilkan salam "Selamat Sore" apabila jam saat ini berada di antara pukul 15:00 hingga 17:59.
4. WHEN halaman Dashboard dibuka, THE Greeting Widget SHALL menampilkan salam "Selamat Malam" apabila jam saat ini berada di antara pukul 18:00 hingga 23:59.
5. THE Greeting Widget SHALL memperbarui tampilan jam dalam format HH:MM:SS setiap 1 detik menggunakan `setInterval`.
6. THE Greeting Widget SHALL memperbarui tampilan tanggal dalam format lengkap bahasa Indonesia (contoh: "Senin, 14 Juli 2025") setiap 1 detik.
7. WHEN pergantian jam terjadi selama Dashboard terbuka, THE Greeting Widget SHALL memperbarui teks salam secara otomatis sesuai rentang waktu yang berlaku.

---

### Requirement 2: Focus Timer 25 Menit

**User Story:** Sebagai pengguna, saya ingin menggunakan timer fokus 25 menit dengan kontrol penuh, sehingga saya dapat menerapkan sesi kerja terstruktur (Pomodoro).

#### Acceptance Criteria

1. WHEN halaman Dashboard dibuka, THE Focus Timer SHALL menampilkan hitungan mundur dengan nilai awal 25:00 (dua puluh lima menit nol detik).
2. WHEN pengguna menekan tombol "Start", THE Focus Timer SHALL memulai hitungan mundur satu detik per detik dari nilai yang sedang ditampilkan.
3. WHILE Focus Timer sedang berjalan, THE Focus Timer SHALL memperbarui tampilan hitungan mundur setiap 1 detik.
4. WHILE Focus Timer sedang berjalan, THE Focus Timer SHALL menonaktifkan tombol "Start" agar tidak dapat ditekan kembali.
5. WHEN pengguna menekan tombol "Stop" selama Focus Timer berjalan, THE Focus Timer SHALL menghentikan hitungan mundur dan mempertahankan nilai yang terakhir ditampilkan.
6. WHEN pengguna menekan tombol "Reset", THE Focus Timer SHALL menghentikan hitungan mundur dan mengembalikan tampilan ke nilai 25:00.
7. WHEN Focus Timer mencapai nilai 00:00, THE Focus Timer SHALL menghentikan hitungan mundur secara otomatis.
8. IF Focus Timer mencapai nilai 00:00, THEN THE Focus Timer SHALL menampilkan notifikasi kepada pengguna bahwa sesi fokus telah selesai menggunakan `alert` browser.

---

### Requirement 3: To-Do List

**User Story:** Sebagai pengguna, saya ingin mengelola daftar tugas harian dengan kemampuan tambah, edit, tandai selesai, dan hapus, sehingga saya dapat melacak pekerjaan saya langsung dari dashboard.

#### Acceptance Criteria

1. THE To-Do List SHALL menyediakan input teks dan tombol "Tambah" untuk memasukkan Task baru.
2. WHEN pengguna memasukkan teks Task dan menekan tombol "Tambah" atau tombol Enter, THE To-Do List SHALL menambahkan Task baru ke dalam daftar dan mengosongkan input teks.
3. IF pengguna menekan tombol "Tambah" dengan input teks yang kosong, THEN THE To-Do List SHALL tidak menambahkan Task baru dan tetap menampilkan input teks yang kosong.
4. WHEN pengguna menekan tombol centang atau area checkbox pada sebuah Task, THE To-Do List SHALL mengubah status Task tersebut dari "belum selesai" menjadi "selesai" dan menampilkan visual coret (strikethrough) pada teks Task.
5. WHEN pengguna menekan tombol centang atau area checkbox pada sebuah Task yang sudah berstatus "selesai", THE To-Do List SHALL mengubah status Task kembali menjadi "belum selesai" dan menghilangkan visual coret pada teks Task.
6. WHEN pengguna menekan tombol "Edit" pada sebuah Task, THE To-Do List SHALL mengubah tampilan Task tersebut ke mode edit yang memungkinkan pengguna mengubah teks Task.
7. WHEN pengguna mengonfirmasi perubahan pada mode edit Task, THE To-Do List SHALL menyimpan teks baru dan mengembalikan tampilan Task ke mode normal.
8. IF pengguna mengonfirmasi perubahan dengan teks kosong pada mode edit Task, THEN THE To-Do List SHALL tidak menyimpan perubahan dan mengembalikan teks Task ke nilai sebelumnya.
9. WHEN pengguna menekan tombol "Hapus" pada sebuah Task, THE To-Do List SHALL menghapus Task tersebut dari daftar secara permanen.
10. THE To-Do List SHALL menampilkan jumlah Task yang belum selesai secara dinamis di bagian header komponen.

---

### Requirement 4: Persistensi To-Do List dengan Local Storage

**User Story:** Sebagai pengguna, saya ingin daftar tugas saya tersimpan secara otomatis, sehingga tugas-tugas tidak hilang ketika saya menutup atau me-refresh halaman browser.

#### Acceptance Criteria

1. WHEN pengguna menambahkan, mengedit, mengubah status, atau menghapus Task, THE To-Do List SHALL menyimpan seluruh daftar Task terbaru ke Local Storage dengan key `productivity-todos`.
2. WHEN halaman Dashboard dimuat ulang (refresh) atau dibuka kembali, THE To-Do List SHALL membaca data dari Local Storage dengan key `productivity-todos` dan menampilkan kembali seluruh Task beserta status selesai/belum selesai masing-masing.
3. IF Local Storage tidak mengandung data dengan key `productivity-todos` saat halaman dibuka, THEN THE To-Do List SHALL menampilkan daftar kosong tanpa pesan error.

---

### Requirement 5: Quick Links

**User Story:** Sebagai pengguna, saya ingin mengelola daftar tautan cepat ke situs yang sering saya kunjungi, sehingga saya dapat membuka situs-situs tersebut langsung dari dashboard tanpa perlu mengetik URL ulang.

#### Acceptance Criteria

1. THE Quick Links SHALL menyediakan input teks untuk label dan input teks untuk URL, serta tombol "Tambah" untuk menambahkan Link Item baru.
2. WHEN pengguna mengisi label dan URL yang valid lalu menekan tombol "Tambah", THE Quick Links SHALL menambahkan Link Item baru ke dalam daftar dan mengosongkan kedua input.
3. IF pengguna menekan tombol "Tambah" dengan salah satu atau kedua input (label atau URL) yang kosong, THEN THE Quick Links SHALL tidak menambahkan Link Item baru.
4. IF pengguna memasukkan URL yang tidak diawali dengan `http://` atau `https://`, THEN THE Quick Links SHALL menambahkan prefiks `https://` secara otomatis sebelum menyimpan Link Item.
5. WHEN pengguna menekan sebuah Link Item, THE Quick Links SHALL membuka URL yang tersimpan di tab browser baru menggunakan `target="_blank"`.
6. WHEN pengguna menekan tombol "Hapus" pada sebuah Link Item, THE Quick Links SHALL menghapus Link Item tersebut dari daftar secara permanen.

---

### Requirement 6: Persistensi Quick Links dengan Local Storage

**User Story:** Sebagai pengguna, saya ingin tautan cepat yang telah saya simpan tetap ada setelah menutup browser, sehingga saya tidak perlu menambahkan ulang setiap kali membuka dashboard.

#### Acceptance Criteria

1. WHEN pengguna menambahkan atau menghapus Link Item, THE Quick Links SHALL menyimpan seluruh daftar Link Item terbaru ke Local Storage dengan key `productivity-quicklinks`.
2. WHEN halaman Dashboard dimuat ulang (refresh) atau dibuka kembali, THE Quick Links SHALL membaca data dari Local Storage dengan key `productivity-quicklinks` dan menampilkan kembali seluruh Link Item yang tersimpan.
3. IF Local Storage tidak mengandung data dengan key `productivity-quicklinks` saat halaman dibuka, THEN THE Quick Links SHALL menampilkan daftar kosong tanpa pesan error.

---

### Requirement 7: Struktur File dan Kompatibilitas Teknis

**User Story:** Sebagai pengembang, saya ingin kode terorganisir dalam struktur folder yang bersih dan kompatibel dengan browser modern, sehingga proyek mudah dipelihara dan dapat berjalan tanpa dependensi eksternal.

#### Acceptance Criteria

1. THE Sistem SHALL mengorganisir file ke dalam struktur berikut: `index.html` di direktori root, `css/style.css` untuk seluruh styling, dan `js/main.js` untuk seluruh logika JavaScript.
2. THE Sistem SHALL diimplementasikan menggunakan HTML5, CSS3, dan Vanilla JavaScript murni tanpa framework, library pihak ketiga, atau backend server.
3. THE Sistem SHALL berjalan sepenuhnya di sisi klien (client-side) hanya dengan membuka file `index.html` di Browser Modern tanpa memerlukan web server.
4. THE Sistem SHALL menggunakan Local Storage sebagai satu-satunya mekanisme persistensi data.
5. WHILE pengguna mengakses Dashboard menggunakan Browser Modern, THE Sistem SHALL menampilkan seluruh widget (Greeting Widget, Focus Timer, To-Do List, Quick Links) dengan tampilan yang fungsional dan dapat digunakan.

---

### Requirement 8: Light / Dark Mode (Challenge Feature)

**User Story:** Sebagai pengguna, saya ingin dapat beralih antara tampilan terang (light) dan gelap (dark), sehingga saya dapat menyesuaikan tampilan dashboard sesuai preferensi atau kondisi pencahayaan.

#### Acceptance Criteria

1. THE Sistem SHALL menyediakan tombol toggle untuk beralih antara Light Mode dan Dark Mode.
2. WHEN pengguna menekan tombol toggle, THE Sistem SHALL menerapkan skema warna yang sesuai (terang atau gelap) ke seluruh tampilan dashboard secara instan.
3. WHEN pengguna mengaktifkan Dark Mode lalu menutup atau me-refresh halaman, THE Sistem SHALL membaca preferensi dari Local Storage dengan key `productivity-theme` dan menerapkannya secara otomatis saat halaman dibuka kembali.
4. IF tidak ada preferensi tema tersimpan di Local Storage, THEN THE Sistem SHALL menampilkan Light Mode sebagai tampilan default.

---

### Requirement 9: Custom Name di Greeting (Challenge Feature)

**User Story:** Sebagai pengguna, saya ingin mengatur nama saya sendiri yang ditampilkan pada salam, sehingga dashboard terasa lebih personal.

#### Acceptance Criteria

1. THE Greeting Widget SHALL menyediakan input teks dan tombol untuk menyimpan nama pengguna kustom (Custom Name).
2. WHEN pengguna memasukkan nama dan menekan tombol simpan, THE Greeting Widget SHALL menampilkan salam yang menyertakan Custom Name tersebut (contoh: "Selamat Pagi, Faqih!").
3. WHEN pengguna menyimpan Custom Name, THE Sistem SHALL menyimpan nama tersebut ke Local Storage dengan key `productivity-username`.
4. WHEN halaman Dashboard dibuka kembali, THE Greeting Widget SHALL membaca Custom Name dari Local Storage dan langsung menampilkannya pada salam tanpa perlu input ulang.
5. IF Local Storage tidak mengandung Custom Name, THEN THE Greeting Widget SHALL menampilkan salam tanpa nama (contoh: "Selamat Pagi!").
6. WHEN pengguna mengosongkan input nama dan menyimpan, THE Greeting Widget SHALL menghapus Custom Name dari Local Storage dan kembali menampilkan salam tanpa nama.

---

### Requirement 10: Prevent Duplicate Tasks (Challenge Feature)

**User Story:** Sebagai pengguna, saya ingin sistem mencegah penambahan tugas yang sama persis, sehingga daftar tugas saya tetap bersih dan tidak redundant.

#### Acceptance Criteria

1. WHEN pengguna mencoba menambahkan Task baru, THE To-Do List SHALL memeriksa apakah teks Task (setelah trim, case-insensitive) sudah ada dalam daftar sebagai Duplicate Task.
2. IF teks Task yang akan ditambahkan merupakan Duplicate Task, THEN THE To-Do List SHALL tidak menambahkan Task baru dan SHALL menampilkan pesan peringatan kepada pengguna bahwa tugas tersebut sudah ada.
3. IF teks Task yang akan ditambahkan bukan Duplicate Task, THEN THE To-Do List SHALL menambahkan Task baru seperti biasa.

---

### Requirement 11: Non-Functional Requirements

**User Story:** Sebagai pengguna dan pengembang, saya ingin aplikasi memiliki antarmuka yang bersih, performa yang baik, dan dapat diakses melalui GitHub Pages, sehingga mudah digunakan dan dibagikan.

#### Acceptance Criteria

1. THE Sistem SHALL memiliki antarmuka yang bersih dan minimal dengan hierarki visual yang jelas dan tipografi yang mudah dibaca (NFR-1: Simplicity).
2. THE Sistem SHALL tidak memerlukan setup kompleks — cukup buka `index.html` di browser tanpa langkah instalasi tambahan (NFR-1: Simplicity).
3. THE Sistem SHALL memuat halaman dan merespons interaksi pengguna pada widget tanpa lag yang terasa (NFR-2: Performance).
4. THE Sistem SHALL kompatibel dengan Browser Modern: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+ (TC-3).
5. THE Sistem SHALL dapat diakses sebagai standalone web app dengan membuka `index.html` langsung di browser tanpa memerlukan web server (TC-3).
6. THE Sistem SHALL dapat dipublikasikan dan diakses melalui GitHub Pages tanpa memerlukan konfigurasi tambahan (GitHub & Deployment).
