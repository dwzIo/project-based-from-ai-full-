/* ═══════════════════════════════════════════════════════════════
   script.js — Suki Liar Detector
   Berisi: keyword DB, loading state, kalkulasi skor, manajemen
   riwayat target, render hasil, filter tabs interaktif,
   localStorage persistence, dan fitur salin/bagikan diagnosis.
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   1. KEYWORD DATABASE
      Setiap entri: { word: string, weight: number (1–10) }
      Semakin besar weight, semakin parah kadar cringe-nya.
───────────────────────────────────────────────────────────── */
const KEYWORD_DB = [
  { word: 'jomok',           weight: 8  },
  { word: 'ngawi',           weight: 6  },
  { word: 'sigma',           weight: 7  },
  { word: 'skibidi',         weight: 9  },
  { word: 'mewing',          weight: 7  },
  { word: 'menyala abangku', weight: 10 },
  /* FIX: bobot 'loh ya' diturunkan dari 100 → 10 agar tidak
     mendominasi akumulasi skor secara tidak adil */
  { word: 'loh ya',          weight: 10 },
  { word: 'menyala',         weight: 6  },
  { word: 'abangku',         weight: 5  },
  { word: 'rizz',            weight: 6  },
  { word: 'gyatt',           weight: 7  },
  { word: 'ohio',            weight: 7  },
  { word: 'based',           weight: 5  },
  { word: 'no cap',          weight: 5  },
  { word: 'fanum tax',       weight: 8  },
  { word: 'bussin',          weight: 6  },
  { word: 'slay',            weight: 4  },
  { word: 'delulu',          weight: 6  },
  { word: 'looksmaxxing',    weight: 8  },
  { word: 'griddy',          weight: 7  },
  { word: 'lowkey',          weight: 3  },
  { word: 'highkey',         weight: 3  },
  { word: 'yapping',         weight: 5  },
  { word: 'gooning',         weight: 9  },
  { word: 'suki',            weight: 5  },
  { word: '🗿',              weight: 4  },
  { word: 'aura',            weight: 5  },
  { word: 'W rizz',          weight: 8  },
];

/* ─────────────────────────────────────────────────────────────
   2. LOADING MESSAGES
      Teks interaktif yang diputar bergantian selama 1.5 detik.
───────────────────────────────────────────────────────────── */
const LOADING_MESSAGES = [
  'Sedang memindai database ke-garingan...',
  'Mencocokkan pola jomok tingkat lanjut...',
  'Mengkalibrasi Cringe-O-Meter™...',
  'Menghubungi satelit Ngawi-7...',
  'Menganalisis kadar sigma fake...',
  'Memeriksa riwayat skibidi toilet...',
  'Memverifikasi lisensi "menyala abangku"...',
  'Hampir selesai... sabar, ini sains.',
];

/* ─────────────────────────────────────────────────────────────
   3. DIAGNOSIS TEMPLATES
      Teks analisis satiris berdasarkan level skor.
───────────────────────────────────────────────────────────── */
const DIAGNOSIS = {
  normal: [
    'Subjek tampak normal. Tidak ada jejak skibidi atau sigma yang mencurigakan. Mungkin dia hanya lurker yang bijak.',
    'Tidak terdeteksi anomali cringe. Subjek kemungkinan masih tahu cara membuat kalimat yang manusia dewasa bisa pahami.',
    'Database CDA-9 tidak menemukan indikasi berbahaya. Subjek mungkin terlalu sibuk kerja untuk update meme.',
  ],
  gejala: [
    'Hati-hati! Subjek menunjukkan gejala awal. Penggunaan kata sigma atau skibidi masih dalam batas toleransi, namun perlu pemantauan.',
    'Terdeteksi paparan meme tingkat menengah. Subjek mungkin menghabiskan terlalu banyak waktu di FYP TikTok sebelum tidur.',
    'Ada indikasi infeksi ringan. Beberapa kata yang digunakan tergolong dalam Kategori B Cringe-Index. Segera konsultasi ke psikiater atau kurangi screen time.',
  ],
  akut: [
    'PERINGATAN MERAH! Subjek adalah carrier aktif Suki Liar tingkat akut. Karantina digital segera disarankan. Jangan biarkan dia mengetik sendirian.',
    'Alarm CDA-9 berbunyi! Konsentrasi meme beracun dalam teks melebihi ambang batas WHO untuk kesehatan digital. Prognosis: butuh diet internet 30 hari.',
    'DARURAT CRINGE! Subjek kemungkinan besar adalah admin dari minimal 3 grup meme yang tidak lucu. Hubungi pihak berwajib segera.',
  ],
};

/* ─────────────────────────────────────────────────────────────
   4. STATE — Riwayat semua target yang pernah diperiksa
      Setiap entri: { name, score, level, diagnosis, detected }
      level: 'normal' | 'gejala' | 'akut'
───────────────────────────────────────────────────────────── */
let history = [];

/* Filter tab yang sedang aktif: 'all' | 'normal' | 'sukiLiar' */
let activeFilter = 'all';

/* Kunci localStorage untuk persistensi data */
const STORAGE_KEY = 'sukiLiarHistory';

/* ─────────────────────────────────────────────────────────────
   5. HELPERS
───────────────────────────────────────────────────────────── */
/** Shorthand getElementById */
const $ = id => document.getElementById(id);

/** Pilih item acak dari array */
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

/* ─────────────────────────────────────────────────────────────
   6. PERSISTENSI DATA — localStorage
      saveHistory()  : simpan array history ke localStorage
      loadHistory()  : muat data tersimpan saat halaman dibuka
───────────────────────────────────────────────────────────── */

/** Simpan seluruh array history ke localStorage dalam format JSON */
function saveHistory() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (_) {
    /* Abaikan jika localStorage tidak tersedia (private mode, dll.) */
  }
}

/** Muat data history dari localStorage saat halaman pertama diakses */
function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      /* Validasi: pastikan hasil parse adalah array */
      if (Array.isArray(parsed)) {
        history = parsed;
      }
    }
  } catch (_) {
    /* Jika data korup atau gagal parse, mulai dengan array kosong */
    history = [];
  }
}

/* ─────────────────────────────────────────────────────────────
   7. KALKULASI SKOR CRINGE
      Input : teks gabungan (komentar + nama)
      Output: { score: 0-100, detected: string[] }
───────────────────────────────────────────────────────────── */
function calculateCringeScore(text) {
  const lower = text.toLowerCase();
  let rawScore = 0;
  const detected = [];

  /* Cocokkan setiap keyword dan akumulasi bobot */
  KEYWORD_DB.forEach(({ word, weight }) => {
    if (lower.includes(word.toLowerCase())) {
      rawScore += weight;
      detected.push(word);
    }
  });

  /* Variasi acak ±8 poin agar hasil terasa dinamis */
  const jitter = Math.floor(Math.random() * 17) - 8;
  rawScore += jitter;

  /* Clamp ke rentang 0–100 */
  const score = Math.min(100, Math.max(0, rawScore));
  return { score, detected };
}

/* ─────────────────────────────────────────────────────────────
   8. TENTUKAN LEVEL dari skor
      < 35  → 'normal'
      35–69 → 'gejala'
      ≥ 70  → 'akut'
───────────────────────────────────────────────────────────── */
function getLevel(score) {
  if (score < 35) return 'normal';
  if (score < 70) return 'gejala';
  return 'akut';
}

/* ─────────────────────────────────────────────────────────────
   9. HITUNG JUMLAH per kategori dari array history
      Digunakan LANGSUNG oleh updateTabLabels() —
      tidak ada array atau kalkulasi duplikat.
───────────────────────────────────────────────────────────── */
function getCounts() {
  const total    = history.length;
  const normal   = history.filter(h => h.level === 'normal').length;
  /* 'Suki Liar' = gabungan gejala + akut */
  const sukiLiar = history.filter(h => h.level === 'gejala' || h.level === 'akut').length;
  return { total, normal, sukiLiar };
}

/* ─────────────────────────────────────────────────────────────
   10. UPDATE LABEL TABS
       Menyuntikkan jumlah dari getCounts() ke teks tiap tombol
       format: "All (n)", "Normal (n)", "Suki Liar (n)"
       Dipanggil setiap kali history berubah.
───────────────────────────────────────────────────────────── */
function updateTabLabels() {
  const { total, normal, sukiLiar } = getCounts();
  $('tab-all').textContent       = `All (${total})`;
  $('tab-normal').textContent    = `Normal (${normal})`;
  $('tab-sukiLiar').textContent  = `Suki Liar (${sukiLiar})`;
}

/* ─────────────────────────────────────────────────────────────
   11. SET FILTER TAB — Ganti tab aktif, render riwayat ulang
───────────────────────────────────────────────────────────── */
function setFilter(filterKey) {
  activeFilter = filterKey;

  /* Perbarui style setiap tombol tab */
  ['all', 'normal', 'sukiLiar'].forEach(key => {
    const btn = $(`tab-${key}`);
    if (key === filterKey) {
      btn.classList.add('tab-active');
    } else {
      btn.classList.remove('tab-active');
    }
  });

  /* Render ulang list riwayat sesuai filter baru */
  renderHistory();
}

/* ─────────────────────────────────────────────────────────────
   12. RENDER HISTORY LIST
       Menyaring array history berdasarkan activeFilter
       lalu menggambar ulang <ul id="historyList">.
       FIX: historyEmpty dikontrol via classList.toggle('hidden')
       agar selaras dengan rule CSS .hidden, bukan style.display.
───────────────────────────────────────────────────────────── */
function renderHistory() {
  const listEl   = $('historyList');
  const emptyEl  = $('historyEmpty');

  /* Filter data berdasarkan tab aktif */
  const filtered = history.filter(entry => {
    if (activeFilter === 'normal')   return entry.level === 'normal';
    if (activeFilter === 'sukiLiar') return entry.level === 'gejala' || entry.level === 'akut';
    return true; /* 'all' — tampilkan semua */
  });

  /* FIX: gunakan classList.toggle('hidden') untuk sinkronisasi layout
     yang konsisten — tidak ada konflik antara inline style dan CSS rule */
  if (filtered.length === 0) {
    listEl.innerHTML = '';
    emptyEl.classList.remove('hidden');
    return;
  }

  emptyEl.classList.add('hidden');
  listEl.innerHTML = '';

  /* Konfigurasi visual per level */
  const LEVEL_CONFIG = {
    normal: {
      badge:    '✅ Manusia Normal',
      badgeCls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      barCls:   'bg-emerald-500',
      barColor: '#10b981',
    },
    gejala: {
      badge:    '⚠️ Gejala Suki Liar',
      badgeCls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
      barCls:   'bg-yellow-500',
      barColor: '#eab308',
    },
    akut: {
      badge:    '🚨 Suki Liar Akut',
      badgeCls: 'bg-red-500/20 text-red-400 border-red-500/40',
      barCls:   'bg-red-500',
      barColor: '#ef4444',
    },
  };

  /* Render terbaru di atas (filtered sudah dibalik saat push) */
  filtered.forEach(entry => {
    const cfg = LEVEL_CONFIG[entry.level];
    const li  = document.createElement('li');
    li.className = 'history-enter py-3.5';

    li.innerHTML = `
      <div class="flex items-center justify-between gap-2 mb-2">
        <span class="font-semibold text-slate-200 text-sm truncate max-w-[170px]">${escapeHTML(entry.name)}</span>
        <span class="text-[10px] font-bold border rounded-full px-2 py-0.5 whitespace-nowrap ${cfg.badgeCls}">${cfg.badge}</span>
      </div>
      <div class="flex items-center gap-2.5">
        <div class="flex-1 bg-slate-800 rounded-full overflow-hidden" style="height:3px">
          <div class="${cfg.barCls} h-full rounded-full" style="width:${entry.score}%;transition:width .6s cubic-bezier(.16,1,.3,1)"></div>
        </div>
        <span class="text-xs font-bold text-slate-500 w-8 text-right shrink-0">${entry.score}%</span>
      </div>
    `;

    listEl.appendChild(li);
  });
}

/* ─────────────────────────────────────────────────────────────
   13. MAIN FUNCTION — Jalankan alur deteksi penuh (1.5 detik)
       FIX: Proteksi race condition — jika tombol sedang disabled
       (loading sedang berjalan), fungsi langsung keluar agar
       tidak terjadi spam klik yang menduplikasi data riwayat
       dan merusak animasi loading.
───────────────────────────────────────────────────────────── */
function runDetection() {
  /* FIX Race Condition: hentikan eksekusi jika tombol sedang disabled */
  const detectBtn = $('detectBtn');
  if (detectBtn.disabled) return;

  const name     = $('targetName').value.trim();
  const behavior = $('behaviorText').value.trim();

  /* Validasi: setidaknya satu field harus terisi */
  if (!name && !behavior) {
    shakeInput('targetName');
    shakeInput('behaviorText');
    return;
  }

  const displayName = name || 'Target Anonim';

  /* Sembunyikan hasil lama, tampilkan loading */
  $('resultCard').style.display    = 'none';
  $('loadingState').style.display  = 'flex';
  detectBtn.disabled               = true;

  /* Reset dan mulai animasi progress bar (target 90% dalam 1.3 detik) */
  const bar = $('loadingBar');
  bar.style.transition = 'none';
  bar.style.width = '0%';
  requestAnimationFrame(() => {
    bar.style.transition = 'width 1.3s ease-out';
    bar.style.width = '90%';
  });

  /* Rotasi teks loading setiap 300ms */
  let msgIndex = 0;
  $('loadingText').textContent = LOADING_MESSAGES[0];
  const msgInterval = setInterval(() => {
    msgIndex++;
    $('loadingText').textContent = LOADING_MESSAGES[msgIndex % LOADING_MESSAGES.length];
  }, 300);

  /* Setelah 1.5 detik — proses dan tampilkan hasil */
  setTimeout(() => {
    clearInterval(msgInterval);

    const { score, detected } = calculateCringeScore(behavior + ' ' + name);

    /* Sembunyikan loading, aktifkan tombol kembali */
    $('loadingState').style.display = 'none';
    detectBtn.disabled              = false;

    /* Render kartu hasil diagnosis */
    renderResult(displayName, score, detected);
  }, 1500);
}

/* ─────────────────────────────────────────────────────────────
   14. RENDER RESULT — Isi dan tampilkan kartu diagnosis terkini
───────────────────────────────────────────────────────────── */
function renderResult(name, score, detected) {
  const level = getLevel(score);

  /* Konfigurasi visual berdasarkan level */
  const CONFIG = {
    normal: {
      badgeCls:  'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
      glowColor: '#34d399',
      barCls:    'bg-emerald-500',
      label:     '✅ Manusia Normal',
      diagList:  DIAGNOSIS.normal,
    },
    gejala: {
      badgeCls:  'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      glowColor: '#facc15',
      barCls:    'bg-yellow-500',
      label:     '⚠️ Gejala Suki Liar',
      diagList:  DIAGNOSIS.gejala,
    },
    akut: {
      badgeCls:  'bg-red-500/20 text-red-400 border-red-500/50',
      glowColor: '#f87171',
      barCls:    'bg-red-500',
      label:     '🚨 Suki Liar Akut',
      diagList:  DIAGNOSIS.akut,
    },
  };

  const cfg      = CONFIG[level];
  const diagText = pick(cfg.diagList);

  /* Isi elemen hasil */
  $('resultName').textContent  = name;

  /* Score dengan animasi pop */
  const scoreEl = $('resultScore');
  scoreEl.textContent = score + '%';
  scoreEl.classList.remove('score-pop');
  void scoreEl.offsetWidth;
  scoreEl.classList.add('score-pop');

  /* Badge */
  const badge = $('resultBadge');
  badge.className   = `badge-glow mt-1 px-3 py-1 rounded-full text-xs font-bold border tracking-wide ${cfg.badgeCls}`;
  badge.style.color = cfg.glowColor;
  badge.textContent = cfg.label;

  /* Score bar */
  const scoreBar = $('scoreBar');
  scoreBar.className   = `h-full rounded-full fill-bar ${cfg.barCls}`;
  scoreBar.style.width = '0%';
  void scoreBar.offsetWidth;
  scoreBar.style.width = score + '%';

  /* Gauge bar mini (visual equalizer) */
  const gaugeEl = $('gaugeBar');
  if (gaugeEl) {
    gaugeEl.innerHTML = '';
    const bars = 16;
    for (let i = 0; i < bars; i++) {
      /* Tinggi bar naik progresif hingga skor, lalu drop */
      const progress = i / (bars - 1);
      const peak     = score / 100;
      const h        = Math.max(8, Math.round(40 * Math.min(progress / peak, 1) * (1 - Math.max(0, (progress - peak) * 2.5))));
      const opacity  = progress <= peak ? 0.9 : 0.2;
      const bar      = document.createElement('div');
      bar.style.cssText = `width:4px;height:${h}px;border-radius:2px;opacity:${opacity};background:${cfg.glowColor};transition:height .5s cubic-bezier(.16,1,.3,1) ${i * 30}ms`;
      gaugeEl.appendChild(bar);
    }
  }

  $('resultDiagnosis').textContent = diagText;

  /* Keyword tags */
  const keySection = $('keywordSection');
  const keyTags    = $('keywordTags');
  if (detected.length > 0) {
    keyTags.innerHTML = '';
    detected.forEach(kw => {
      const tag = document.createElement('span');
      tag.textContent = kw;
      tag.className   = 'kw-tag';
      keyTags.appendChild(tag);
    });
    keySection.style.display = 'block';
  } else {
    keySection.style.display = 'none';
  }

  /* Tampilkan kartu dengan animasi */
  const card = $('resultCard');
  card.style.display = 'block';
  card.classList.remove('slide-up');
  void card.offsetWidth;
  card.classList.add('slide-up');
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  /* ── Reset visual tombol share (jika user scan ulang) ── */
  const shareBtn = $('shareBtn');
  if (shareBtn) {
    shareBtn.textContent = '📋 Salin Hasil Diagnosis';
    shareBtn.disabled = false;
  }

  /* ── Simpan ke array history (terbaru di atas) ── */
  history.unshift({ name, score, level, diagnosis: diagText, detected });

  /* Persistensi: simpan ke localStorage setiap ada data baru */
  saveHistory();

  /* Perbarui label tab dan render riwayat */
  updateTabLabels();
  renderHistory();
}

/* ─────────────────────────────────────────────────────────────
   15. SHARE RESULT — Salin ringkasan diagnosis ke clipboard
       Menyusun teks satiris dari data hasil terakhir,
       menyalinnya via navigator.clipboard, dan memberikan
       feedback visual pada tombol shareBtn.
───────────────────────────────────────────────────────────── */
function shareResult() {
  /* Ambil data dari elemen DOM yang sudah terisi */
  const name      = $('resultName').textContent  || 'Target';
  const score     = $('resultScore').textContent || '?%';
  const badge     = $('resultBadge').textContent || '—';
  const diagnosis = $('resultDiagnosis').textContent || '';

  /* Susun teks ringkasan yang bisa disalin */
  const text = [
    '🗿 LAPORAN SUKI LIAR DETECTOR — CDA-9',
    '─────────────────────────────',
    `👤 Target   : ${name}`,
    `📊 Skor     : ${score}`,
    `🏷️  Status  : ${badge}`,
    '─────────────────────────────',
    `🧬 Analisis : ${diagnosis}`,
    '─────────────────────────────',
    'Suki Liar Detector © Kegaiban™ Research Institute',
    'Untuk hiburan semata — jangan baper.',
  ].join('\n');

  const shareBtn = $('shareBtn');

  /* Salin ke clipboard menggunakan navigator.clipboard API */
  navigator.clipboard.writeText(text)
    .then(() => {
      /* Feedback visual sukses: ubah teks dan nonaktifkan sementara */
      shareBtn.textContent = '✅ Tersalin ke Clipboard!';
      shareBtn.disabled    = true;
      /* Kembalikan ke teks asal setelah 2.5 detik */
      setTimeout(() => {
        shareBtn.textContent = '📋 Salin Hasil Diagnosis';
        shareBtn.disabled    = false;
      }, 2500);
    })
    .catch(() => {
      /* Fallback jika clipboard API tidak tersedia (HTTP non-secure) */
      shareBtn.textContent = '⚠️ Salin gagal — coba manual';
      setTimeout(() => {
        shareBtn.textContent = '📋 Salin Hasil Diagnosis';
      }, 2500);
    });
}

/* ─────────────────────────────────────────────────────────────
   16. RESET FORM — Bersihkan input dan sembunyikan hasil
───────────────────────────────────────────────────────────── */
function resetForm() {
  $('targetName').value          = '';
  $('behaviorText').value        = '';
  $('resultCard').style.display  = 'none';
  $('loadingState').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─────────────────────────────────────────────────────────────
   17. HELPER — Efek shake + border merah pada input kosong
───────────────────────────────────────────────────────────── */
function shakeInput(id) {
  const el = $(id);
  el.classList.add('border-red-500', 'ring-1', 'ring-red-500');
  el.animate([
    { transform: 'translateX(0)'   },
    { transform: 'translateX(-6px)'},
    { transform: 'translateX(6px)' },
    { transform: 'translateX(-4px)'},
    { transform: 'translateX(4px)' },
    { transform: 'translateX(0)'   },
  ], { duration: 350, easing: 'ease-in-out' });

  setTimeout(() => {
    el.classList.remove('border-red-500', 'ring-1', 'ring-red-500');
  }, 2000);
}

/* ─────────────────────────────────────────────────────────────
   18. HELPER — Escape HTML untuk mencegah XSS di history list
───────────────────────────────────────────────────────────── */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ─────────────────────────────────────────────────────────────
   19. EVENT LISTENERS & INIT
       - Muat data riwayat dari localStorage saat halaman buka
       - Pasang listener Enter pada input nama
       - Inisialisasi tab label dan render riwayat awal
───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  /* Muat data history yang tersimpan dari sesi sebelumnya */
  loadHistory();

  /* Tekan Enter di input nama = langsung scan */
  $('targetName').addEventListener('keydown', e => {
    if (e.key === 'Enter') runDetection();
  });

  /* Inisialisasi tab label dan tampilan riwayat */
  updateTabLabels();
  renderHistory();
});
