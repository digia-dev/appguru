export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
          <span className="text-4xl font-bold text-white">A</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">AppGuru</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manajemen Kelas & Pengajaran
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <a
            href="/login"
            className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-xl"
          >
            Masuk
          </a>
          <a
            href="/register"
            className="w-full rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50"
          >
            Daftar
          </a>
        </div>
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} AppGuru. All rights reserved.
        </p>
      </div>
    </div>
  );
}
