import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { UpdateProfileForm } from "./form";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Profil</h1>
        <p className="mt-1 text-gray-500">Kelola informasi akun Anda.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-2xl font-bold text-white">
              {user?.email?.charAt(0).toUpperCase() ?? "A"}
            </div>
            <h2 className="mt-4 text-lg font-bold text-gray-900">{user?.email}</h2>
            <p className="text-sm text-gray-500">Terdaftar via Supabase</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <UpdateProfileForm email={user?.email ?? ""} />
        </div>
      </div>
    </div>
  );
}
