/**
 * Productivity Dashboard — js/main.js
 *
 * Foundation module: Greeting Widget helper functions and update loop.
 * Subsequent tasks will append more code to this file.
 */

// =============================================================================
// GREETING WIDGET
// =============================================================================

/**
 * Memetakan jam (0–23) ke teks salam bahasa Indonesia.
 *
 * @param {number} hour - Jam saat ini (bilangan bulat 0–23)
 * @returns {string} Teks salam yang sesuai
 */
function getGreeting(hour) {
  if (hour >= 0 && hour <= 11) return "Selamat Pagi";
  if (hour >= 12 && hour <= 14) return "Selamat Siang";
  if (hour >= 15 && hour <= 17) return "Selamat Sore";
  return "Selamat Malam"; // 18–23
}

/**
 * Memformat objek Date menjadi string HH:MM:SS menggunakan locale Indonesia.
 *
 * @param {Date} date - Objek tanggal/waktu yang akan diformat
 * @returns {string} String waktu dalam format HH:MM:SS
 */
function formatTime(date) {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

/**
 * Memformat objek Date menjadi string tanggal lengkap bahasa Indonesia.
 * Contoh hasil: "Senin, 14 Juli 2025"
 *
 * @param {Date} date - Objek tanggal/waktu yang akan diformat
 * @returns {string} String tanggal lengkap dalam bahasa Indonesia
 */
function formatDate(date) {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

/**
 * Memperbarui elemen-elemen DOM pada Greeting Widget:
 *   - #time    → jam saat ini (HH:MM:SS)
 *   - #date    → tanggal lengkap bahasa Indonesia
 *   - #greeting → teks salam sesuai jam
 *
 * Dipanggil sekali saat inisialisasi dan kemudian setiap detik via setInterval.
 * setInterval dan panggilan awal didaftarkan di initApp() (task 10.1).
 */
function updateGreetingWidget() {
  const now = new Date();
  document.getElementById("time").textContent = formatTime(now);
  document.getElementById("date").textContent = formatDate(now);
  document.getElementById("greeting").textContent = buildGreetingText(now.getHours(), userName);
}

// setInterval and initial call registered in initApp()

// =============================================================================
// GREETING WIDGET — Custom Name (Challenge Feature)
// =============================================================================

let userName = "";
const STORAGE_KEY_USERNAME = "productivity-username";

/**
 * Menggabungkan teks salam dengan nama pengguna (jika ada).
 * @param {number} hour - Jam saat ini (0–23)
 * @param {string} name - Nama pengguna (boleh kosong)
 * @returns {string} Teks salam lengkap
 */
function buildGreetingText(hour, name) {
  const base = getGreeting(hour);
  const trimmedName = name ? name.trim() : "";
  return trimmedName ? `${base}, ${trimmedName}!` : `${base}!`;
}

/**
 * Memuat Custom Name dari Local Storage ke state dan input field.
 */
function loadUserName() {
  userName = localStorage.getItem(STORAGE_KEY_USERNAME) || "";
  const nameInput = document.getElementById("name-input");
  if (nameInput) {
    nameInput.value = userName;
  }
}

/**
 * Menyimpan Custom Name ke Local Storage; hapus key jika nama dikosongkan.
 * @param {string} name - Nama yang akan disimpan
 */
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

/**
 * Mendaftarkan event listener untuk fitur Custom Name.
 */
function setupNameListeners() {
  document.getElementById("name-save").addEventListener("click", () => {
    saveUserName(document.getElementById("name-input").value);
  });
  document.getElementById("name-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveUserName(e.target.value);
  });
}

// =============================================================================
// FOCUS TIMER
// =============================================================================

const TIMER_DURATION = 25 * 60; // 1500 detik

const timerState = {
  totalSeconds: TIMER_DURATION,
  intervalId: null,
  isRunning: false
};

/**
 * Memformat total detik menjadi string MM:SS.
 * @param {number} totalSeconds - Total detik (0–1500)
 * @returns {string} String dalam format MM:SS
 */
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

function setupTimerListeners() {
  document.getElementById("timer-start").addEventListener("click", startTimer);
  document.getElementById("timer-stop").addEventListener("click", stopTimer);
  document.getElementById("timer-reset").addEventListener("click", resetTimer);
}

// =============================================================================
// TO-DO LIST
// =============================================================================

const STORAGE_KEY_TODOS = "productivity-todos";
let todos = [];

/**
 * Menghasilkan ID unik berdasarkan timestamp dan random string.
 * @returns {string} ID unik
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
}

/**
 * Mencegah XSS dengan mengonversi karakter khusus HTML ke entitas.
 * @param {string} text - Teks yang akan di-escape
 * @returns {string} Teks yang sudah di-escape
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

/**
 * Menambahkan Task baru ke daftar.
 * Melakukan validasi trim() dan tidak menambahkan jika kosong.
 * @param {string} text - Teks tugas
 */
function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  if (isDuplicateTodo(trimmed)) {
    showDuplicateWarning();
    return;
  }
  todos.push({ id: generateId(), text: trimmed, completed: false });
  saveTodos();
  renderTodos();
}

/**
 * Mengubah status selesai/belum selesai pada Task tertentu.
 * @param {string} id - ID task yang akan ditoggle
 */
function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
  }
}

/**
 * Menghapus Task dari daftar secara permanen.
 * @param {string} id - ID task yang akan dihapus
 */
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
}

/**
 * Me-render ulang seluruh daftar todo ke DOM.
 * Memperbarui #todo-list dan #todo-count.
 */
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

// =============================================================================
// THEME TOGGLE (Light/Dark Mode — Challenge Feature)
// =============================================================================

let currentTheme = "light"; // "light" | "dark"
const STORAGE_KEY_THEME = "productivity-theme";

/**
 * Membaca tema dari Local Storage dan menerapkannya saat halaman dimuat.
 * Fallback ke "light" jika tidak ada preferensi tersimpan.
 */
function loadTheme() {
  currentTheme = localStorage.getItem(STORAGE_KEY_THEME) || "light";
  applyTheme(currentTheme);
}

/**
 * Menerapkan tema ke DOM dan memperbarui label tombol toggle.
 * @param {string} theme - "light" atau "dark"
 */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.textContent = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
  }
}

/**
 * Beralih antara light dan dark, lalu simpan ke Local Storage.
 */
function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(currentTheme);
  localStorage.setItem(STORAGE_KEY_THEME, currentTheme);
}

/**
 * Mendaftarkan event listener untuk tombol theme toggle.
 */
function setupThemeListeners() {
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
}

// =============================================================================
// INISIALISASI APLIKASI
// =============================================================================

/**
 * Dipanggil saat DOM siap. Menginisialisasi semua widget dan event listener.
 * loadTheme() dipanggil pertama agar tema diterapkan sebelum render widget lain.
 */
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

// =============================================================================
// TO-DO LIST — Inline Edit Mode & Event Listeners
// =============================================================================

/**
 * Menyimpan teks baru pada Task tertentu.
 * Tidak menyimpan jika teks baru kosong setelah trim.
 * @param {string} id - ID task yang akan diedit
 * @param {string} newText - Teks baru
 */
function editTodo(id, newText) {
  const trimmed = newText.trim();
  if (!trimmed) return; // Batalkan jika teks kosong
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.text = trimmed;
    saveTodos();
    renderTodos();
  }
}

/**
 * Mengubah tampilan satu item todo ke mode edit inline.
 * Menggantikan konten <li> dengan <input> dan tombol Simpan/Batal.
 * @param {HTMLElement} li - Elemen <li> yang akan diubah ke mode edit
 * @param {string} id - ID task
 * @param {string} currentText - Teks saat ini untuk diisi ke input
 */
function enterEditMode(li, id, currentText) {
  li.classList.add("editing");
  li.innerHTML = `
    <input type="text" class="todo-edit-input" value="${escapeHtml(currentText)}" aria-label="Edit teks tugas" />
    <button class="todo-save" aria-label="Simpan perubahan">Simpan</button>
    <button class="todo-cancel" aria-label="Batal edit">Batal</button>
  `;
  const input = li.querySelector(".todo-edit-input");
  input.focus();
  input.select();

  li.querySelector(".todo-save").addEventListener("click", () => {
    editTodo(id, input.value);
  });
  li.querySelector(".todo-cancel").addEventListener("click", () => {
    renderTodos();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") editTodo(id, input.value);
    if (e.key === "Escape") renderTodos();
  });
}

/**
 * Mendaftarkan event listener untuk To-Do List menggunakan event delegation.
 * Menangani: Tambah, Toggle, Edit, Hapus.
 */
function setupTodoListeners() {
  // Tambah via tombol
  document.getElementById("todo-add").addEventListener("click", () => {
    const input = document.getElementById("todo-input");
    addTodo(input.value);
    input.value = "";
  });

  // Tambah via Enter key
  document.getElementById("todo-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addTodo(e.target.value);
      e.target.value = "";
    }
  });

  // Event delegation untuk aksi pada item todo
  document.getElementById("todo-list").addEventListener("click", (e) => {
    const li = e.target.closest("li[data-id]");
    if (!li) return;
    const id = li.dataset.id;

    if (e.target.classList.contains("todo-toggle")) {
      toggleTodo(id);
    } else if (e.target.classList.contains("todo-edit")) {
      const todoText = li.querySelector(".todo-text").textContent;
      enterEditMode(li, id, todoText);
    } else if (e.target.classList.contains("todo-delete")) {
      deleteTodo(id);
    }
  });
}

// =============================================================================
// TO-DO LIST — Local Storage Persistence
// =============================================================================

/**
 * Menyimpan daftar todos ke Local Storage.
 * Menggunakan try/catch untuk menangani QuotaExceededError.
 */
function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
  } catch (e) {
    console.warn("Gagal menyimpan todos ke Local Storage:", e);
  }
}

/**
 * Memuat daftar todos dari Local Storage.
 * Fallback ke array kosong jika data tidak ada atau gagal di-parse.
 */
function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TODOS);
    todos = raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Gagal memuat todos dari Local Storage:", e);
    todos = [];
  }
  renderTodos();
}

// =============================================================================
// QUICK LINKS
// =============================================================================

const STORAGE_KEY_LINKS = "productivity-quicklinks";
let quickLinks = [];

/**
 * Normalisasi URL: tambahkan https:// jika tidak ada skema http/https.
 * @param {string} url - URL yang akan dinormalisasi
 * @returns {string} URL dengan skema lengkap
 */
function normalizeUrl(url) {
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Menambahkan Link Item baru.
 * Memvalidasi bahwa label dan url keduanya tidak kosong.
 * @param {string} label - Teks tautan
 * @param {string} url - URL tujuan
 */
function addQuickLink(label, url) {
  const trimmedLabel = label.trim();
  const trimmedUrl = url.trim();
  if (!trimmedLabel || !trimmedUrl) return;
  quickLinks.push({
    id: generateId(),
    label: trimmedLabel,
    url: normalizeUrl(trimmedUrl)
  });
  saveQuickLinks();
  renderQuickLinks();
}

/**
 * Menghapus Link Item dari daftar secara permanen.
 * @param {string} id - ID link item yang akan dihapus
 */
function deleteQuickLink(id) {
  quickLinks = quickLinks.filter(l => l.id !== id);
  saveQuickLinks();
  renderQuickLinks();
}

/**
 * Me-render ulang seluruh daftar quick links ke DOM.
 */
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

/**
 * Mendaftarkan event listener untuk Quick Links.
 */
function setupQuickLinksListeners() {
  document.getElementById("link-add").addEventListener("click", () => {
    const labelInput = document.getElementById("link-label-input");
    const urlInput = document.getElementById("link-url-input");
    addQuickLink(labelInput.value, urlInput.value);
    labelInput.value = "";
    urlInput.value = "";
  });

  document.getElementById("quicklinks-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("link-delete")) {
      const li = e.target.closest("li[data-id]");
      if (li) deleteQuickLink(li.dataset.id);
    }
  });
}

// =============================================================================
// TO-DO LIST — Prevent Duplicate Tasks (Challenge Feature)
// =============================================================================

/**
 * Verifies whether a given text already exists in the todos array (case-insensitive).
 * @param {string} text - Teks yang akan diperiksa
 * @returns {boolean} true jika duplicate, false jika tidak
 */
function isDuplicateTodo(text) {
  return todos.some(t => t.text.trim().toLowerCase() === text.trim().toLowerCase());
}

/**
 * Menampilkan pesan peringatan duplikat selama 3 detik lalu menyembunyikannya.
 */
function showDuplicateWarning() {
  const warningEl = document.getElementById("todo-duplicate-warning");
  if (warningEl) {
    warningEl.textContent = "⚠️ Tugas ini sudah ada dalam daftar.";
    warningEl.style.display = "block";
    setTimeout(() => { warningEl.style.display = "none"; }, 3000);
  }
}

// =============================================================================
// QUICK LINKS — Local Storage Persistence
// =============================================================================

/**
 * Menyimpan daftar quick links ke Local Storage.
 * Menggunakan try/catch untuk menangani QuotaExceededError.
 */
function saveQuickLinks() {
  try {
    localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(quickLinks));
  } catch (e) {
    console.warn("Gagal menyimpan quick links ke Local Storage:", e);
  }
}

/**
 * Memuat daftar quick links dari Local Storage.
 * Fallback ke array kosong jika data tidak ada atau gagal di-parse.
 */
function loadQuickLinks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LINKS);
    quickLinks = raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Gagal memuat quick links dari Local Storage:", e);
    quickLinks = [];
  }
  renderQuickLinks();
}
