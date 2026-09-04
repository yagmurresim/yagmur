import type { Metadata } from "next";
import { AdminLoginForm } from "@/features/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Giriş | Yağmur Sanat Yönetim Paneli",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-paper-alt p-4">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl text-ink mb-1">Yönetim Paneli</h1>
          <p className="text-sm text-ink-muted">Yağmur Sanat Akademisi</p>
        </div>
        <div className="bg-white border border-line rounded-[12px] p-8">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}