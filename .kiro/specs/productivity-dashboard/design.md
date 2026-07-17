# Design Document

## Productivity Dashboard

---

## Gambaran Umum

Productivity Dashboard adalah aplikasi web satu halaman (single-page application) yang dibangun dengan HTML5, CSS3, dan Vanilla JavaScript murni. Aplikasi ini dikembangkan dari kode yang sudah ada di workspace dan diperluas menjadi dasbor produktivitas lengkap dengan empat widget: Greeting, Focus Timer, To-Do List, dan Quick Links. Semua data dikelola sepenuhnya di sisi klien menggunakan Local Storage.

---

## Arsitektur

### Pola Desain

Aplikasi menggunakan pola **Module Pattern** dengan pendekatan **Component-based** tanpa framework. Setiap widget dikelola oleh modul JavaScript independen yang terdiri dari:

- **State** — objek data internal widget
- **Render function** — fungsi yang memperbarui DOM berdasarkan state
- **Event handlers** — fungsi yang menangani interaksi pengguna dan memperbarui state

Alur data mengikuti siklus satu arah:

```
User Interaction → Event Handler → Update State → Save to Storage → Re-render DOM
```

### Struktur File

```
root/
├── index.html          ← Entry point, markup semua widget
├── css/
│   └── style.css       ← Seluruh styling (migrasi dari style.css di root)
└── js/
    └── main.js         ← Seluruh logika JavaScript (migrasi dari main.js di root)
```

> **Catatan Migrasi:** File `style.css` dan `main.js` yang saat ini berada di direktori root akan dipindahkan ke `css/style.css` dan `js/main.js`. Referensi di `index.html` perlu diperbarui.

---

## Komponen

### 1. Greeting Widget

**Tanggung jawab:** Menampilkan jam real-time, tanggal, dan salam berdasarkan waktu hari, serta mendukung Custom Name yang tersimpan di Local Storage.

**State:**
```javascript
let userName = ""; // String, diinisialisasi dari Local Storage
const STORAGE_KEY_USERNAME = "productivity-username";
```

**Antarmuka DOM:**
```html
<section id="greeting-widget">
  <h1 id="time"></h1>
  <p id="date"></p>
  <h2 id="greeting"></h2>
  <div class="name-input-area">
    <input type="text" id="name-input" placeholder="Masukkan nama Anda..." />
    <button id="name-save">Simpan</button>
  </div>
</section>
```

**Fungsi Utama:**

```javascript
// Memetakan jam (0-23) ke teks salam bahasa Indonesia
function getGreeting(hour) {
  if (hour >= 0 && hour <= 11) return "Selamat Pagi";
  if (hour >= 12 && hour <= 14) return "Selamat Siang";
  if (hour >= 15 && hour <= 17) return "Selamat Sore";
  return "Selamat Malam"; // 18-23
}

// Memformat objek Date menjadi string HH:MM:SS
function formatTime(date) {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

// Memformat objek Date menjadi string tanggal lengkap bahasa Indonesia
function formatDate(date) {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// Menggabungkan teks salam dengan nama pengguna (jika ada)
function buildGreetingText(hour, name) {
  const base = getGreeting(hour);
  return name ? `${base}, ${name}!` : `${base}!`;
}

// Memuat Custom Name dari Local Storage ke state dan input field
function loadUserName() {
  userName = localStorage.getItem(STORAGE_KEY_USERNAME) || "";
  const nameInput = document.getElementById("name-input");
  if (nameInput) {
    nameInput.value = userName;
  }
}

// Menyimpan Custom Name ke Local Storage; hapus key jika nama dikosongkan
function saveUserName(name) {
  const trimmed = name.trim();
  if (trimmed) {
    userName = trimmed;
    localStorage.setItem(STORAGE_KEY_USERNAME, trimmed);
  } else {
    userName = "";
    localStorage.removeItem(STORAGE_KEY_USERNAME);
  }
  updateGreetingWidget();
}

// Fungsi utama yang dipanggil setiap detik via setInterval
function updateGreetingWidget() {
  const now = new Date();
  document.getElementById("time").textContent = formatTime(now);
  document.getElementById("date").textContent = formatDate(now);
  document.getElementById("greeting").textContent = buildGreetingText(now.getHours(), userName);
}

setInterval(updateGreetingWidget, 1000);
updateGreetingWidget(); // Panggilan awal
```

**Event Listener:**
```javascript
function setupNameListeners() {
  document.getElementById("name-save").addEventListener("click", () => {
    saveUserName(document.getElementById("name-input").value);
  });
  document.getElementById("name-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveUserName(e.target.value);
  });
}
```

---

### 2. Focus Timer

**Tanggung jawab:** Countdown timer 25 menit dengan kontrol Start, Stop, dan Reset.

**State:**
```javascript
const timerState = {
  totalSeconds: 25 * 60, // 1500 detik
  intervalId: null,       // ID dari setInterval, null jika tidak berjalan
  isRunning: false
};
```

**Antarmuka DOM:**
```html
<section id="timer-widget">
  <div id="timer-display">25:00</div>
  <div class="timer-controls">
    <button id="timer-start">Start</button>
    <button id="timer-stop">Stop</button>
    <button id="timer-reset">Reset</button>
  </div>
</section>
```

**Fungsi Utama:**

```javascript
const TIMER_DURATION = 25 * 60; // 1500 detik

// Memformat detik menjadi string MM:SS
function formatTimerDisplay(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startTimer() {
  if (timerState.isRunning) return;
  timerState.isRunning = true;
  document.getElementById("timer-start").disabled = true;

  timerState.intervalId = setInterval(() => {
    timerState.totalSeconds--;
    document.getElementById("timer-display").textContent =
      formatTimerDisplay(timerState.totalSeconds);

    if (timerState.totalSeconds <= 0) {
      stopTimer();
      alert("Sesi fokus selesai! Waktunya istirahat.");
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerState.intervalId);
  timerState.intervalId = null;
  timerState.isRunning = false;
  document.getElementById("timer-start").disabled = false;
}

function resetTimer() {
  stopTimer();
  timerState.totalSeconds = TIMER_DURATION;
  document.getElementById("timer-display").textContent =
    formatTimerDisplay(timerState.totalSeconds);
}
```

---

### 3. To-Do List

**Tanggung jawab:** Manajemen daftar tugas dengan operasi CRUD dan persistensi ke Local Storage.

**Model Data — Task:**
```javascript
// Struktur satu Task
{
  id: String,        // UUID, contoh: "1720000000000-abc"
  text: String,      // Deskripsi tugas
  completed: Boolean // Status selesai
}
```

**State:**
```javascript
let todos = []; // Array of Task objects, diinisialisasi dari Local Storage
```

**Antarmuka DOM:**
```html
<section id="todo-widget">
  <div class="todo-header">
    <h3>To-Do List (<span id="todo-count">0</span> tugas tersisa)</h3>
  </div>
  <div class="todo-input-area">
    <input type="text" id="todo-input" placeholder="Tambah tugas baru..." />
    <button id="todo-add">Tambah</button>
  </div>
  <p id="todo-duplicate-warning" style="display:none;" aria-live="polite"></p>
  <ul id="todo-list"></ul>
</section>
```

**Fungsi Utama:**

```javascript
const STORAGE_KEY_TODOS = "productivity-todos";

function loadTodos() {
  const raw = localStorage.getItem(STORAGE_KEY_TODOS);
  todos = raw ? JSON.parse(raw) : [];
  renderTodos();
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
}

// Memeriksa apakah teks task sudah ada (case-insensitive)
function isDuplicateTodo(text) {
  return todos.some(t => t.text.trim().toLowerCase() === text.trim().toLowerCase());
}

// Menampilkan pesan peringatan duplikat selama 3 detik
function showDuplicateWarning() {
  const warningEl = document.getElementById("todo-duplicate-warning");
  if (warningEl) {
    warningEl.textContent = "⚠️ Tugas ini sudah ada dalam daftar.";
    warningEl.style.display = "block";
    setTimeout(() => { warningEl.style.display = "none"; }, 3000);
  }
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return; // Validasi: tidak boleh kosong
  if (isDuplicateTodo(trimmed)) {
    showDuplicateWarning(); // Tampilkan peringatan, batalkan penambahan
    return;
  }
  todos.push({ id: generateId(), text: trimmed, completed: false });
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
  }
}

function editTodo(id, newText) {
  const trimmed = newText.trim();
  if (!trimmed) return; // Validasi: teks baru tidak boleh kosong
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.text = trimmed;
    saveTodos();
    renderTodos();
  }
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
}

function renderTodos() {
  const list = document.getElementById("todo-list");
  const countEl = document.getElementById("todo-count");
  const remaining = todos.filter(t => !t.completed).length;
  countEl.textContent = remaining;

  list.innerHTML = todos.map(todo => `
    <li class="todo-item ${todo.completed ? "completed" : ""}" data-id="${todo.id}">
      <button class="todo-toggle" aria-label="Tandai selesai">✓</button>
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <button class="todo-edit" aria-label="Edit tugas">Edit</button>
      <button class="todo-delete" aria-label="Hapus tugas">Hapus</button>
    </li>
  `).join("");
}

// Mencegah XSS pada teks tugas
function escapeHtml(text) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}
```

**Alur Edit Mode:**

Ketika tombol "Edit" ditekan, item list diubah inline menjadi:
```html
<li class="todo-item editing" data-id="...">
  <input type="text" class="todo-edit-input" value="[teks tugas saat ini]" />
  <button class="todo-save">Simpan</button>
  <button class="todo-cancel">Batal</button>
</li>
```

Menekan "Simpan" memanggil `editTodo(id, inputValue)`. Menekan "Batal" memanggil `renderTodos()` untuk mengembalikan tampilan normal tanpa menyimpan perubahan.

---

### 4. Quick Links

**Tanggung jawab:** Manajemen daftar tautan cepat dengan validasi URL dan persistensi.

**Model Data — Link Item:**
```javascript
// Struktur satu Link Item
{
  id: String,    // UUID
  label: String, // Teks yang ditampilkan
  url: String    // URL dengan skema (selalu http:// atau https://)
}
```

**State:**
```javascript
let quickLinks = []; // Array of Link Item objects, diinisialisasi dari Local Storage
```

**Antarmuka DOM:**
```html
<section id="quicklinks-widget">
  <h3>Quick Links</h3>
  <div class="quicklinks-input-area">
    <input type="text" id="link-label-input" placeholder="Label (contoh: Google)" />
    <input type="text" id="link-url-input" placeholder="URL (contoh: https://google.com)" />
    <button id="link-add">Tambah</button>
  </div>
  <ul id="quicklinks-list"></ul>
</section>
```

**Fungsi Utama:**

```javascript
const STORAGE_KEY_LINKS = "productivity-quicklinks";

function loadQuickLinks() {
  const raw = localStorage.getItem(STORAGE_KEY_LINKS);
  quickLinks = raw ? JSON.parse(raw) : [];
  renderQuickLinks();
}

function saveQuickLinks() {
  localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(quickLinks));
}

// Normalisasi URL: tambahkan https:// jika tidak ada skema http/https
function normalizeUrl(url) {
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function addQuickLink(label, url) {
  const trimmedLabel = label.trim();
  const trimmedUrl = url.trim();
  if (!trimmedLabel || !trimmedUrl) return; // Validasi: keduanya tidak boleh kosong
  quickLinks.push({
    id: generateId(),
    label: trimmedLabel,
    url: normalizeUrl(trimmedUrl)
  });
  saveQuickLinks();
  renderQuickLinks();
}

function deleteQuickLink(id) {
  quickLinks = quickLinks.filter(l => l.id !== id);
  saveQuickLinks();
  renderQuickLinks();
}

function renderQuickLinks() {
  const list = document.getElementById("quicklinks-list");
  list.innerHTML = quickLinks.map(link => `
    <li class="link-item" data-id="${link.id}">
      <a href="${link.url}" target="_blank" rel="noopener noreferrer">
        ${escapeHtml(link.label)}
      </a>
      <button class="link-delete" aria-label="Hapus link">Hapus</button>
    </li>
  `).join("");
}
```

---

### 5. Theme Toggle (Light/Dark Mode)

**Tanggung jawab:** Menyediakan toggle untuk beralih antara Light Mode dan Dark Mode, dengan persistensi preferensi ke Local Storage.

**State:**
```javascript
let currentTheme = "light"; // "light" | "dark", diinisialisasi dari Local Storage
const STORAGE_KEY_THEME = "productivity-theme";
```

**Antarmuka DOM:**
```html
<!-- Di dalam header atau area controls -->
<button id="theme-toggle" aria-label="Ganti tema">🌙 Dark Mode</button>
```

**Mekanisme CSS:**

Tema diterapkan via atribut `data-theme` pada elemen `<html>`, dan semua warna menggunakan CSS Custom Properties sehingga perubahan tema cukup satu atribut:

```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #1a1a1a;
  --text-secondary: #555555;
  --accent: #4f46e5;
  --border: #e0e0e0;
}
[data-theme="dark"] {
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --accent: #7c73e6;
  --border: #333366;
}
```

**Fungsi Utama:**

```javascript
// Membaca tema dari Local Storage dan menerapkannya saat halaman dimuat
function loadTheme() {
  currentTheme = localStorage.getItem(STORAGE_KEY_THEME) || "light";
  applyTheme(currentTheme);
}

// Menerapkan tema ke DOM dan memperbarui label tombol toggle
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.textContent = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
  }
}

// Beralih antara light dan dark, lalu simpan ke Local Storage
function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(currentTheme);
  localStorage.setItem(STORAGE_KEY_THEME, currentTheme);
}
```

**Event Listener:**
```javascript
function setupThemeListeners() {
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
}
```

**Keputusan Desain:** Pendekatan `data-theme` + CSS Custom Properties dipilih karena perubahan tema tidak memerlukan penggantian class per-elemen — cukup satu atribut di root, semua variabel warna ter-cascade secara otomatis ke seluruh komponen.

---

## Inisialisasi Aplikasi

```javascript
// Dipanggil saat DOM siap (DOMContentLoaded)
function initApp() {
  // Terapkan tema dan nama sebelum render widget lainnya
  loadTheme();
  loadUserName();

  // Inisialisasi semua widget
  updateGreetingWidget();
  setInterval(updateGreetingWidget, 1000);

  resetTimer(); // Set tampilan awal timer ke 25:00
  loadTodos();
  loadQuickLinks();

  // Daftarkan event listeners
  setupThemeListeners();
  setupNameListeners();
  setupTimerListeners();
  setupTodoListeners();
  setupQuickLinksListeners();
}

document.addEventListener("DOMContentLoaded", initApp);
```

---

## Model Data (Data Models)

### Local Storage Schema

| Key | Tipe Nilai | Contoh |
|-----|------------|--------|
| `productivity-todos` | JSON string dari `Task[]` | `[{"id":"...","text":"Belajar","completed":false}]` |
| `productivity-quicklinks` | JSON string dari `LinkItem[]` | `[{"id":"...","label":"Google","url":"https://google.com"}]` |
| `productivity-theme` | string `"light"` atau `"dark"` | `"dark"` (default: `"light"` jika key tidak ada) |
| `productivity-username` | string nama pengguna | `"Faqih"` (key dihapus via `removeItem` jika nama dikosongkan) |

### Kontrak Tipe Data

```javascript
/**
 * @typedef {Object} Task
 * @property {string} id - Identifier unik
 * @property {string} text - Deskripsi tugas (tidak boleh kosong setelah trim)
 * @property {boolean} completed - Status penyelesaian
 */

/**
 * @typedef {Object} LinkItem
 * @property {string} id - Identifier unik
 * @property {string} label - Teks tautan (tidak boleh kosong setelah trim)
 * @property {string} url - URL lengkap (selalu dimulai dengan http:// atau https://)
 */
```

---

## Penanganan Error

| Skenario | Penanganan |
|----------|------------|
| Local Storage penuh (QuotaExceededError) | `try/catch` saat `localStorage.setItem`, tampilkan pesan error di konsol, beri tahu pengguna via `console.warn` |
| JSON.parse gagal (data korup) | `try/catch` saat `JSON.parse`, fallback ke array kosong `[]` |
| Input kosong pada Todo/QuickLinks | Validasi `trim()` sebelum menyimpan, operasi dibatalkan silently |
| URL tanpa skema | Normalisasi otomatis dengan menambahkan `https://` |
| XSS pada teks tugas/label | Gunakan `createTextNode` untuk escaping HTML |

---

## Desain CSS

### Layout Utama

```css
/* Grid dua kolom untuk desktop */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* Greeting widget penuh lebar di atas */
#greeting-widget {
  grid-column: 1 / -1;
}
```

### Breakpoint Responsif

- **Desktop (≥768px):** Grid dua kolom — Focus Timer dan To-Do List berdampingan; Quick Links di bawah To-Do List.
- **Mobile (<768px):** Satu kolom, semua widget stack vertikal.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Pemetaan Jam ke Salam

*Untuk semua* nilai jam yang valid (integer 0–23), fungsi `getGreeting(hour)` harus mengembalikan tepat satu dari empat salam yang terdefinisi: "Selamat Pagi" untuk jam 0–11, "Selamat Siang" untuk jam 12–14, "Selamat Sore" untuk jam 15–17, dan "Selamat Malam" untuk jam 18–23, dan tidak pernah mengembalikan nilai lain.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.7**

---

### Property 2: Format Waktu Valid

*Untuk semua* objek `Date` yang valid, fungsi `formatTime(date)` harus mengembalikan string yang sesuai dengan pola `HH:MM:SS` (dua digit jam, dua digit menit, dua digit detik dipisahkan tanda titik dua).

**Validates: Requirements 1.5**

---

### Property 3: Format Tanggal Mengandung Komponen Lengkap

*Untuk semua* objek `Date` yang valid, fungsi `formatDate(date)` harus mengembalikan string yang mengandung nama hari dalam bahasa Indonesia, angka tanggal, nama bulan dalam bahasa Indonesia, dan tahun empat digit.

**Validates: Requirements 1.6**

---

### Property 4: Reset Timer Selalu Mengembalikan Nilai Awal

*Untuk semua* state timer (berjalan atau berhenti, dengan nilai berapa pun antara 00:00 dan 25:00), memanggil `resetTimer()` harus selalu menghasilkan `timerState.totalSeconds === 1500`, `timerState.isRunning === false`, dan tampilan yang menunjukkan "25:00".

**Validates: Requirements 2.6**

---

### Property 5: Format Tampilan Timer Valid

*Untuk semua* nilai `totalSeconds` yang valid (integer 0–1500), fungsi `formatTimerDisplay(totalSeconds)` harus mengembalikan string yang sesuai dengan pola `MM:SS` di mana menit berkisar 0–25 dan detik berkisar 0–59.

**Validates: Requirements 2.1, 2.3**

---

### Property 6: Penambahan Task Memperbesar Daftar

*Untuk semua* daftar tasks yang ada dan semua teks task yang valid (string non-whitespace), memanggil `addTodo(text)` harus menghasilkan daftar tasks bertambah panjang tepat satu elemen dan elemen terakhir memiliki teks yang sama (setelah trim) dengan input yang diberikan.

**Validates: Requirements 3.2**

---

### Property 7: Toggle Status Task adalah Idempoten Ganda (Round-Trip)

*Untuk semua* task dalam daftar, memanggil `toggleTodo(id)` dua kali berturut-turut harus mengembalikan task ke status `completed` semula (toggle dua kali = tidak berubah).

**Validates: Requirements 3.4, 3.5**

---

### Property 8: Penghapusan Task Menghilangkan Elemen dari Daftar

*Untuk semua* daftar tasks yang berisi setidaknya satu task, memanggil `deleteTodo(id)` pada task tertentu harus menghasilkan daftar baru yang tidak mengandung task dengan `id` tersebut, dan panjang daftar berkurang tepat satu.

**Validates: Requirements 3.9**

---

### Property 9: Hitungan Task Tersisa Akurat

*Untuk semua* konfigurasi daftar tasks (kombinasi tasks selesai dan belum selesai), nilai yang ditampilkan pada elemen `#todo-count` harus selalu sama dengan jumlah tasks di mana `completed === false`.

**Validates: Requirements 3.10**

---

### Property 10: Round-Trip Serialisasi To-Do List

*Untuk semua* daftar tasks yang valid, memanggil `saveTodos()` lalu `loadTodos()` harus menghasilkan daftar tasks yang ekuivalen dengan daftar semula (id, text, dan completed status identik untuk setiap elemen).

**Validates: Requirements 4.1, 4.2**

---

### Property 11: Normalisasi URL Quick Links

*Untuk semua* string URL yang tidak diawali dengan `http://` atau `https://`, fungsi `normalizeUrl(url)` harus mengembalikan string yang diawali tepat dengan `https://` diikuti URL aslinya (setelah trim).

*Untuk semua* string URL yang sudah diawali dengan `http://` atau `https://`, fungsi `normalizeUrl(url)` harus mengembalikan string tersebut tanpa modifikasi (setelah trim).

**Validates: Requirements 5.4**

---

### Property 12: Penambahan Quick Link Memperbesar Daftar

*Untuk semua* daftar quick links yang ada dan semua pasangan label-URL yang valid (keduanya non-whitespace), memanggil `addQuickLink(label, url)` harus menghasilkan daftar bertambah panjang tepat satu elemen, dengan URL yang telah dinormalisasi.

**Validates: Requirements 5.2**

---

### Property 13: Round-Trip Serialisasi Quick Links

*Untuk semua* daftar quick links yang valid, memanggil `saveQuickLinks()` lalu `loadQuickLinks()` harus menghasilkan daftar yang ekuivalen dengan daftar semula (id, label, dan url identik untuk setiap elemen).

**Validates: Requirements 6.1, 6.2**

---

### Property 14: Toggle Tema adalah Round-Trip

*Untuk semua* nilai `currentTheme` yang valid (`"light"` atau `"dark"`), memanggil `toggleTheme()` dua kali berturut-turut harus mengembalikan `currentTheme` ke nilai semula — sifat ini membuktikan bahwa toggle adalah operasi yang dapat dibalik tanpa efek samping tersisa.

**Validates: Requirements 8.1, 8.2**

---

### Property 15: Persistensi Tema

*Untuk semua* nilai tema yang valid, setelah `toggleTheme()` dipanggil dan kemudian `loadTheme()` dipanggil ulang (mensimulasikan reload halaman), nilai `currentTheme` harus sama dengan tema yang terakhir diterapkan sebelum reload — membuktikan bahwa preferensi tema tidak hilang saat halaman ditutup dan dibuka kembali.

**Validates: Requirements 8.3, 8.4**

---

### Property 16: Deteksi Duplikat Case-Insensitive

*Untuk semua* daftar tasks yang ada dan semua string teks, fungsi `isDuplicateTodo(text)` harus mengembalikan `true` apabila daftar mengandung task dengan teks yang secara case-insensitive identik (setelah trim), dan `false` apabila tidak ada kecocokan — membuktikan bahwa pemeriksaan duplikat berlaku konsisten terlepas dari variasi kapitalisasi huruf.

**Validates: Requirements 10.1, 10.2, 10.3**

---

### Property 17: Greeting dengan Custom Name

*Untuk semua* nilai jam yang valid (integer 0–23) dan semua string nama, fungsi `buildGreetingText(hour, name)` harus mengembalikan string yang menyertakan nama (tepat satu kali) apabila `name` adalah string non-whitespace, dan mengembalikan string salam tanpa nama apabila `name` adalah string kosong atau hanya whitespace — membuktikan bahwa personalisasi salam berfungsi secara konsisten untuk semua kombinasi input.

**Validates: Requirements 9.2, 9.5**
