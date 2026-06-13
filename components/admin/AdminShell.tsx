"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Image, LayoutDashboard, LogOut, Settings, ScrollText, Tv } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/slides", label: "Slides", icon: Tv },
  { href: "/admin/media", label: "Medien", icon: Image },
  { href: "/admin/sources", label: "Quellen", icon: ScrollText },
  { href: "/admin/settings", label: "Einstellungen", icon: Settings }
];

export function AdminShell({ children, userEmail }: { children: React.ReactNode; userEmail?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#F7FAFF] text-[#1A1A1A]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[#0033A0]/10 bg-white px-4 py-5 lg:block">
        <Link href="/" className="block rounded-md p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0033A0]">CMS</p>
          <p className="mt-2 text-xl font-semibold">Kernenergie Präsentation</p>
        </Link>
        <nav className="mt-8 grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition ${
                  active ? "bg-[#0033A0] text-white" : "text-[#1A1A1A]/75 hover:bg-[#EEF4FF] hover:text-[#0033A0]"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-5 left-4 right-4">
          <p className="mb-3 truncate text-xs text-slate-500">{userEmail}</p>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-[#0033A0] transition hover:bg-[#EEF4FF]"
          >
            <LogOut size={18} />
            Abmelden
          </button>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#0033A0]/10 bg-white/85 px-4 backdrop-blur lg:px-8">
          <Link href="/admin" className="font-semibold text-[#0033A0] lg:hidden">
            Admin
          </Link>
          <Link href="/" className="rounded-md px-3 py-2 text-sm font-semibold text-[#0033A0] hover:bg-[#EEF4FF]">
            Präsentation ansehen
          </Link>
        </header>
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
