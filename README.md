# 🚨 Suki Liar Detector 🚨

[![Tailwind CSS]([https://shields.io](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQisj-x_nnqfiAN965vLYD8BIX2_BzLOnPxEEiiq2iU6M2R0nXW-H3mY_3U&s=10))](https://tailwindcss.com)

**Suki Liar Detector** adalah sebuah aplikasi web pemindai satiris interaktif yang berfungsi untuk mendeteksi tingkat *ke-cringe-an*, humor garing, atau penggunaan tren meme basi yang salah konteks di media sosial. Aplikasi ini menganalisis teks (komentar atau nama target) berdasarkan basis data kata kunci (*red flags*) digital kontemporer.

## ✨ Fitur Utama

- **Cringe-O-Meter™ (Kalkulator Skor Akumulatif):** Mengkalkulasi kadar ke-garingan teks secara presisi (0-100%) menggunakan sistem pembobotan kata kunci (`KEYWORD_DB`) yang adil dan dinamis.
- **Sistem Status Klasifikasi Otomatis:** Membagi hasil diagnosis ke dalam 3 level indikator visual yang dilengkapi efek *glow pulse*:
  - ✅ **Manusia Normal** (Skor < 35)
  - ⚠️ **Gejala Suki Liar** (Skor 35–69)
  - 🚨 **Suki Liar Akut** (Skor ≥ 70)
- **Ingatan Jangka Panjang (Persistensi Data):** Terintegrasi dengan `localStorage` browser sehingga riwayat pemeriksaan target tidak hilang saat halaman dimuat ulang (*refresh*).
- **Filter Riwayat Interaktif:** Fitur tab filter (*All*, *Normal*, *Suki Liar*) yang dilengkapi *counter* angka dinamis dan area *scroll* internal yang rapi.
- **Integrasi Web Share API:** Pengguna dapat membagikan rangkuman hasil diagnosis satiris secara instan ke media sosial luar lewat jendela berbagi *native* perangkat.
- **Modern 3D Dark Mode UI:** Desain antarmuka futuristik dengan latar belakang berbasis *Three.js* canvas yang estetik dan responsif di semua ukuran layar.

## 🛠️ Arsitektur Proyek (Clean Code)

Proyek ini dibangun menggunakan pendekatan modular multi-file untuk memisahkan struktur, gaya visual, dan logika aplikasi secara bersih:

```text
├── index.html     # Struktur DOM, tata letak antarmuka, dan kontainer UI
├── style.css      # Desain Modern Dark Mode, animasi grafis, dan custom scrollbar
└── script.js      # Logika pemindaian, basis data kata kunci, state management, & API
```

## 🚀 Cara Menjalankan Secara Lokal

Karena proyek ini murni berbasis teknologi *Client-Side Front-End*, Anda tidak memerlukan proses instalasi atau *backend* tambahan.

1. **Klon Repositori Ini:**
   ```bash
   git clone https://github.com
   ```
2. **Masuk ke Direktori Proyek:**
   ```bash
   cd suki-liar-detector
   ```
3. **Buka di Browser:**
   Klik dua kali pada file `index.html` atau jalankan menggunakan ekstensi *Live Server* di VS Code Anda.

> **Catatan Teknis:** Fitur *Web Share API* membutuhkan protokol aman (`https://`) atau lingkungan pengembangan lokal (`localhost`) agar jendela berbagi *native* dapat terpicu secara sempurna pada perangkat mobile.

## 📊 Basis Data Kata Kunci (Preview)

Aplikasi menyaring beberapa *red flags* meme populer seperti:
- `jomok` (Weight: 8)
- `ngawi` (Weight: 6)
- `sigma` (Weight: 7)
- `skibidi` (Weight: 9)
- `menyala abangku` (Weight: 10)
- ...dan puluhan kata kunci kultur internet lainnya.

## 📝 Lisensi

Proyek ini dilisensikan di bawah **MIT License** - lihat file [LICENSE](LICENSE) untuk detailnya. Dikembangkan murni untuk tujuan hiburan, edukasi sub-kultur digital, dan pemenuhan tugas *Capstone Project*.
