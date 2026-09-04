import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, MessageSquare, CheckCircle, Clock, BookOpen, Settings } from "lucide-react";
import { getApplicationStats } from "@/server/queries/applications";

export const metadata: Metadata = { title: "Genel Bakış" };

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  href,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  href: string;
}) {
  const colorMap: Record<string, string> = {
    violet: "bg-violet/10 text-violet",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
    gray: "bg-gray-100 text-gray-500",
  };

  return (
    <Link
      href={href}
      className="flex flex-col gap-3 p-5 bg-white border border-line rounded-[10px] hover:border-plum transition-colors"
    >
      <div
        className={`w-9 h-9 rounded-[8px] flex items-center justify-center ${colorMap[color] ?? colorMap.gray}`}
      >
        <Icon size={18} aria-hidden="true" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-ink">{value}</p>
        <p className="text-sm text-ink-muted">{label}</p>
      </div>
    </Link>
  );
}

function QuickLink({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-4 p-5 bg-white border border-line rounded-[10px] hover:border-plum transition-colors"
    >
      <div className="w-9 h-9 rounded-[8px] bg-plum/8 text-plum flex items-center justify-center shrink-0">
        <Icon size={18} aria-hidden="true" />
      </div>
      <div>
        <p className="font-medium text-ink">{title}</p>
        <p className="text-sm text-ink-muted mt-0.5">{description}</p>
      </div>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  let stats = { NEW: 0, CONTACTED: 0, INTRO_PLANNED: 0, ENROLLED: 0, CLOSED: 0, total: 0 };

  try {
    stats = await getApplicationStats();
  } catch {
    // Supabase may not be configured yet — show zeros
  }

  return (
    <div className="max-w-[1100px]">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">Genel Bakış</h1>
        <p className="text-ink-muted mt-1">Yağmur Sanat Akademisi yönetim paneli</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Yeni Başvuru" value={stats.NEW} icon={GraduationCap} color="violet" href="/admin/basvurular?status=NEW" />
        <StatCard label="İletişime Geçildi" value={stats.CONTACTED} icon={Clock} color="blue" href="/admin/basvurular?status=CONTACTED" />
        <StatCard label="Tanışma Dersi" value={stats.INTRO_PLANNED} icon={Clock} color="orange" href="/admin/basvurular?status=INTRO_PLANNED" />
        <StatCard label="Kayıt Oldu" value={stats.ENROLLED} icon={CheckCircle} color="green" href="/admin/basvurular?status=ENROLLED" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <QuickLink href="/admin/basvurular" title="Başvuruları Yönet" description="Tüm başvuruları gör, durumlarını güncelle." icon={GraduationCap} />
        <QuickLink href="/admin/mesajlar" title="İletişim Mesajları" description="Siteden gelen iletişim formlarını gör." icon={MessageSquare} />
        <QuickLink href="/admin/egitimler" title="Eğitimleri Düzenle" description="Program içeriklerini yönet." icon={BookOpen} />
        <QuickLink href="/admin/ayarlar" title="Site Ayarları" description="İletişim bilgileri ve genel ayarlar." icon={Settings} />
      </div>
    </div>
  );
}