"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Image,
  Settings,
  LogOut,
  GraduationCap,
  HelpCircle,
  CalendarClock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { label: "Genel Bakış", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Takip", href: "/admin/basvurular", icon: GraduationCap },
  { label: "Saatler", href: "/admin/saatler", icon: CalendarClock },
  { label: "Eğitimler", href: "/admin/egitimler", icon: BookOpen },
  { label: "Eğitmenler", href: "/admin/egitmenler", icon: Users },
  { label: "SSS", href: "/admin/sss", icon: HelpCircle },
  { label: "Medya", href: "/admin/medya", icon: Image },
  { label: "Ayarlar", href: "/admin/ayarlar", icon: Settings },
];

interface AdminSidebarProps {
  userEmail: string;
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-line flex flex-col z-40 hidden lg:flex">
        <div className="p-5 border-b border-line">
          <Logo className="mb-1" />
          <p className="text-xs text-ink-muted mt-2">Yönetim paneli</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto" aria-label="Admin navigasyon">
          <ul className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-medium transition-colors",
                      active
                        ? "bg-plum/8 text-plum"
                        : "text-ink-muted hover:bg-gray-50 hover:text-ink"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <item.icon size={16} aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-line">
          <p className="text-xs text-ink-muted mb-3 truncate px-1">{userEmail}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-ink-muted hover:text-red-600 transition-colors px-1"
          >
            <LogOut size={15} aria-hidden="true" />
            Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  );
}