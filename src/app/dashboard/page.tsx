import Link from "next/link";

const quickLinks = [
  { label: "Absensi Hari Ini", href: "/dashboard/attendance", desc: "Catat kehadiran siswa", color: "indigo" },
  { label: "Input Nilai", href: "/dashboard/grades", desc: "Penilaian harian & semester", color: "green" },
  { label: "Tambah Agenda", href: "/dashboard/agenda", desc: "Buat jadwal pembelajaran", color: "blue" },
  { label: "Data Siswa", href: "/dashboard/students", desc: "Kelola data siswa", color: "purple" },
];

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-500">Selamat datang di AppGuru — kelola kelas Anda dengan mudah.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Siswa", value: "-", color: "indigo" },
          { label: "Kelas Aktif", value: "-", color: "green" },
          { label: "Hadir Hari Ini", value: "-", color: "blue" },
          { label: "Total Tabungan", value: "Rp 0", color: "purple" },
        ].map((card) => (
          <div
            key={card.label}
            className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
          >
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Aksi Cepat</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:ring-indigo-200"
            >
              <h3 className="font-semibold text-gray-900">{link.label}</h3>
              <p className="mt-1 text-sm text-gray-500">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
