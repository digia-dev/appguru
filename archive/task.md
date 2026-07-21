# AppGuru - Rencana Pengembangan Aplikasi (100 Tasks)
## Stack: Next.js 16 + Prisma + Supabase (PostgreSQL) + Vercel

## Fase 1: Foundation & Arsitektur (1–10)

- [x] 1. Inisialisasi Next.js 16 App Router + TypeScript + `src/` directory
- [x] 2. Setup Supabase project & PostgreSQL database (via dashboard)
- [x] 3. Setup Prisma ORM: `prisma/schema.prisma` dengan koneksi ke Supabase PostgreSQL
- [x] 4. Setup Tailwind CSS v4 dengan custom theme AppGuru (warna, font Poppins, spacing)
- [x] 5. Setup ESLint + Prettier untuk code consistency
- [x] 6. Setup struktur folder: `src/app/` (routes), `src/components/`, `src/lib/`, `src/features/`
- [x] 7. Setup environment variables (.env.local) untuk DATABASE_URL, SUPABASE_URL, dll
- [x] 8. Setup absolute imports & path aliases (`@/`指向 `src/`)
- [ ] 9. Setup sistem logging terpusat (Pino atau Winston) — saat ini pakai logger.ts sederhana
- [x] 10. Setup vercel.json untuk deployment config (rewrites, headers, cron jobs)

## Fase 2: Authentication & Authorization (11–20)

- [x] 11. Setup Supabase Auth (pengganti NextAuth.js) dengan Supabase PostgreSQL
- [x] 12. Halaman Login (`/login`) dengan validasi form (Zod)
- [x] 13. Halaman Register (`/register`) via Supabase Auth
- [ ] 14. Halaman Forgot Password / Reset Password via Supabase Auth
- [x] 15. Proxy (`proxy.ts`) untuk protected routes (redirect if unauthenticated)
- [ ] 16. Role-based access control (Admin, Guru, Wali Kelas, Kepala Sekolah) — enum sudah ada di Prisma, belum diimplementasi
- [x] 17. Session management dengan Supabase SSR (httpOnly cookie)
- [x] 18. Logout dengan destroy session & redirect
- [x] 19. Halaman profil pengguna: edit nama, mapel, HP (`/dashboard/settings`)
- [ ] 20. Multi-profile: guru bisa assign ke multiple kelas, admin bisa manage semua user

## Fase 3: Database Schema & Prisma (21–30)

- [x] 21. Prisma schema: tabel `users`, `classes`, `students`, `teachers_classes`
- [x] 22. Prisma schema: tabel `attendance`, `grades`, `grade_details` (GradeBab)
- [x] 23. Prisma schema: tabel `learning_activities` (agenda), `academic_events` (kalender)
- [x] 24. Prisma schema: tabel `savings`, `savings_withdrawals` (kas umum)
- [x] 25. Prisma schema: tabel `materials` (materi), `notifications`
- [ ] 26. Prisma migrations: SQL sudah di-generate (`prisma/migration.sql`), jalan via Supabase Dashboard SQL Editor atau akses endpoint `/api/migrate` via Vercel
- [ ] 27. Seed script dengan data dummy (users, classes, students) untuk development
- [x] 28. Implementasi soft delete (`deletedAt`) pada semua tabel utama
- [x] 29. Database indexes untuk query yang sering dipakai
- [ ] 30. Row Level Security (RLS) di Supabase untuk isolasi data per user/role

## Fase 4: API Layer & Server Actions (31–40)

- [x] 31. Implementasi Next.js Server Actions untuk operasi CRUD
- [x] 32. Server Action: CRUD kelas — create, update, delete
- [x] 33. Server Action: CRUD siswa — tambah manual, update, delete (import XLSX belum)
- [x] 34. Server Action: absensi — single upsert, bulk
- [x] 35. Server Action: nilai harian & semester — input, auto-calculate rata-rata
- [x] 36. Server Action: tabungan — setor, tarik, kas umum, hitung saldo
- [x] 37. Server Action: agenda — create, edit, delete, duplicate week
- [ ] 38. Server Action: upload file ke Supabase Storage (materi, foto siswa)
- [x] 39. Validasi input di semua Server Action menggunakan Zod v4
- [ ] 40. Error boundary + toast notification untuk semua operasi (sonner/react-hot-toast)

## Fase 5: Manajemen Kelas & Siswa (41–50)

- [x] 41. Halaman CRUD Kelas (`/dashboard/classes`) — form + daftar
- [ ] 42. Halaman CRUD Siswa — import XLSX drag-and-drop
- [x] 43. Detail Siswa (`/dashboard/students/[id]`) — profil, orang tua, riwayat nilai, absensi
- [ ] 44. Export data siswa ke Excel/PDF
- [ ] 45. Pindah kelas siswa: dropdown pilih kelas tujuan + update otomatis
- [ ] 46. Riwayat kelas siswa: tabel per semester (track mutasi siswa)
- [ ] 47. Filter multi-kriteria: kelas, nama/NIS (search), status aktif/tidak
- [x] 48. Dashboard wali kelas: ringkasan kelas, aksi cepat
- [ ] 49. Manajemen tahun ajaran: CRUD tahun ajaran, set aktif, copy data dari tahun sebelumnya
- [x] 50. Hapus siswa: soft delete (melalui actions, UI via tombol)

## Fase 6: Absensi (51–60)

- [x] 51. Halaman absensi dengan filter kelas + tanggal
- [x] 52. Tampilan grid siswa per kelas: tombol H/S/I/A + simpan bulk
- [ ] 53. QR Code absensi: generate QR per kelas per sesi, scan via kamera
- [ ] 54. Rekap absensi per siswa: tabel + grafik per bulan/semester
- [ ] 55. Laporan absensi PDF siap cetak per siswa & per kelas
- [ ] 56. Export rekap absensi ke format Excel
- [ ] 57. Multiple sesi absensi per hari — kolom session sudah di schema, UI belum
- [ ] 58. Setting jam masuk, jam pulang, toleransi keterlambatan
- [ ] 59. Notifikasi otomatis ke dashboard jika siswa alfa 3x berturut-turut
- [ ] 60. Izin/sakit online: form untuk orang tua, disetujui oleh wali kelas

## Fase 7: Penilaian & Akademik (61–70)

- [x] 61. Halaman penilaian harian: filter kelas + semester + BAB, tabel inline-edit
- [x] 62. Auto-calculate rata-rata pengetahuan, keterampilan per BAB
- [x] 63. Penilaian sikap: dropdown value (SB/B/C/K)
- [x] 64. Halaman penilaian semester: STS, SAS
- [x] 65. Rumus nilai rapor: rekapRapor di server action sudah ada
- [ ] 66. Grafik perkembangan nilai per siswa per semester (Recharts)
- [ ] 67. Cetak rapor PDF: template per halaman siswa, ready-to-print
- [ ] 68. Export nilai ke format Excel Dapodik
- [ ] 69. Analisis butir soal: daya serap per kompetensi, report per kelas
- [ ] 70. Remedial & pengayaan: tracking siswa yang remedial, catatan follow-up

## Fase 8: Agenda Harian & Kalender (71–78)

- [x] 71. Weekly calendar view: 7 kolom (Sen-Min)
- [x] 72. CRUD agenda: form dengan date, class, time slots, catatan
- [x] 73. Duplikasi jadwal mingguan (copy seluruh agenda ke minggu depan)
- [ ] 74. Validasi bentrok waktu: cek overlap sebelum simpan
- [ ] 75. Export agenda ke PDF printable (lesson plan format)
- [ ] 76. Kalender akademik: tampilan bulanan dengan color-coded events
- [ ] 77. CRUD kalender akademik: admin bisa tambah/edit event dinamis
- [ ] 78. Reminder agenda: cron job (Vercel Cron) + notifikasi H-1

## Fase 9: Tabungan & Keuangan (79–84)

- [x] 79. Dashboard keuangan: total saldo, total pemasukan, total pengeluaran (summary cards)
- [x] 80. CRUD transaksi tabungan per siswa: setor, tarik
- [x] 81. Fitur setor ke kas umum (pengeluaran) dengan keterangan
- [ ] 82. Riwayat transaksi per siswa: filter tanggal, pagination, edit/delete
- [ ] 83. Laporan keuangan bulanan PDF
- [ ] 84. Export buku kas ke Excel

## Fase 10: Materi & Konten Digital (85–89)

- [ ] 85. Upload file ke Supabase Storage (PDF, gambar, video) + link sharing
- [ ] 86. Organisasi materi per kelas, per BAB, per semester
- [ ] 87. Embed YouTube / Google Drive / Canva dengan preview embed
- [ ] 88. Tracking akses: siapa, kapan, berapa kali mengakses materi
- [ ] 89. Bank soal multiple choice dengan auto-grading

## Fase 11: PWA, Notifikasi & Offline (90–94)

- [ ] 90. Service Worker via Next.js PWA untuk offline cache
- [ ] 91. Push notification via Supabase Realtime
- [ ] 92. IndexedDB (Dexie.js) untuk cache offline
- [ ] 93. Background sync saat koneksi kembali
- [ ] 94. Manifest.json + "Add to Home Screen"

## Fase 12: UI/UX & Responsivitas (95–99)

- [ ] 95. Dark mode toggle (next-themes)
- [ ] 96. Animasi transisi halaman + skeleton loading
- [ ] 97. Infinite scroll / virtual scroll
- [ ] 98. Shortcut keyboard
- [x] 99. Responsif: mobile-first dengan bottom nav + desktop sidebar

## Fase 13: Testing & Deploy (100–105)

- [ ] 100. Unit testing: Vitest
- [ ] 101. Integration testing: Playwright
- [ ] 102. Setup Supabase local development
- [ ] 103. CI/CD: GitHub Actions
- [x] 104. Deploy ke Vercel — live at https://appguru-jade.vercel.app (DB tables belum ada, perlu migrasi via Supabase SQL Editor atau pooler)
- [ ] 105. Dokumentasi: README, API docs, guide penggunaan
