<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

<h1 align="center">🩺 RemajaCerdik</h1>
<p align="center"><strong>Edukasi Kesehatan Generasi Kini</strong></p>
<p align="center">
  Platform edukasi kesehatan interaktif berbasis web untuk remaja Indonesia. <br/>
  Belajar materi kesehatan, menonton video edukatif, dan uji pengetahuan melalui kuis — semua dalam satu aplikasi.
</p>

---

## 📖 Tentang Proyek

**RemajaCerdik** adalah aplikasi web edukasi kesehatan yang dirancang khusus untuk remaja. Platform ini menyediakan materi pembelajaran, video edukatif, dan kuis interaktif untuk meningkatkan literasi kesehatan di kalangan generasi muda Indonesia.

Aplikasi ini dibangun menggunakan **Next.js 16** dengan arsitektur full-stack — frontend dan backend API terintegrasi dalam satu project, serta menggunakan **MongoDB** sebagai database.

---

## ✨ Fitur Utama

### 👩‍🎓 Panel Siswa
- **Dashboard** — Ringkasan aktivitas dan progres belajar
- **Materi Edukasi** — Akses materi kesehatan lengkap dengan detail per topik
- **Video Edukatif** — Pembelajaran melalui konten video
- **Kuis Interaktif** — Uji pemahaman dengan sistem kuis dan penilaian otomatis
- **Riwayat** — Lacak riwayat pengerjaan kuis dan pencapaian

### 🛡️ Panel Admin
- **Dashboard** — Statistik dan overview platform
- **Kelola Materi** — CRUD materi edukasi
- **Kelola Video** — CRUD konten video pembelajaran
- **Kelola Kuis** — CRUD kuis beserta soal-soalnya
- **Kelola Pengguna** — Manajemen user dan role
- **Laporan & Rekap** — Rekapitulasi hasil kuis seluruh siswa

### 🔐 Autentikasi
- Registrasi & Login dengan JWT
- Proteksi route berbasis role (Admin/Siswa)
- Reset password via Forgot Password
- Profil pengguna

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Bahasa** | TypeScript |
| **Database** | MongoDB + Mongoose |
| **Styling** | Tailwind CSS 4 |
| **Animasi** | Framer Motion, GSAP |
| **Autentikasi** | JSON Web Token (JWT), bcryptjs |
| **Chart** | Chart.js + react-chartjs-2 |
| **Icon** | Lucide React |
| **Notifikasi** | React Hot Toast |
| **HTTP Client** | Axios |

---

## 📁 Struktur Proyek

```
RemajaCerdik/
├── public/                     # Aset statis (gambar, ilustrasi)
├── src/
│   ├── app/
│   │   ├── api/                # API Routes (backend)
│   │   │   ├── auth/           # Login, register, profil, forgot-password
│   │   │   ├── admin/          # Statistik & manajemen user
│   │   │   ├── education/      # Materi & video
│   │   │   ├── quizzes/        # Kuis & soal
│   │   │   └── reporting/      # Laporan & riwayat
│   │   ├── admin/              # Halaman admin (dashboard, kelola data)
│   │   ├── student/            # Halaman siswa (dashboard, belajar, kuis)
│   │   ├── login/              # Halaman login
│   │   ├── register/           # Halaman registrasi
│   │   ├── forgot-password/    # Halaman reset password
│   │   └── profile/            # Halaman profil
│   ├── components/             # Komponen reusable (Modal, Layout, dll.)
│   ├── context/                # Auth Context (state management)
│   ├── lib/                    # Utility (API client, auth helper, MongoDB)
│   └── models/                 # Mongoose models (User, Quiz, Material, dll.)
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🚀 Cara Menjalankan

### Prasyarat
- **Node.js** 18+ 
- **MongoDB** (lokal atau [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone Repository

```bash
git clone https://github.com/fachrifthrhmn-ctrl/Remaja_Cerdik.git
cd Remaja_Cerdik
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment

Buat file `.env.local` di root project dengan variabel berikut:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>
JWT_SECRET=your_jwt_secret_key
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### 5. Build untuk Production

```bash
npm run build
npm start
```

---

## 📊 Database Models

| Model | Deskripsi |
|---|---|
| `User` | Data pengguna (nama, email, password, role) |
| `Material` | Materi edukasi kesehatan |
| `Video` | Konten video pembelajaran |
| `Quiz` | Kuis dengan metadata (judul, deskripsi) |
| `Question` | Soal-soal dalam kuis |
| `Result` | Hasil pengerjaan kuis oleh siswa |

---

## 👥 Kontributor

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/fachrifthrhmn-ctrl">
        <img src="https://github.com/fachrifthrhmn-ctrl.png" width="80px;" alt=""/><br />
        <sub><b>fachrifthrhmn-ctrl</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 📄 Lisensi

Project ini dibuat untuk tujuan edukasi.

---

<p align="center">
  Dibuat dengan ❤️ untuk generasi muda Indonesia 🇮🇩
</p>
