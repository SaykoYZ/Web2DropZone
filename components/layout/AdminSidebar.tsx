import Link from "next/link";
import type { Route } from "next";
import { Logo } from "@/components/Logo";

type AdminLink = {
  label: string;
  href: Route;
};

type AdminGroup = {
  title: string;
  items: AdminLink[];
};

export function AdminSidebar({ logoSrc }: { logoSrc?: string }) {
  const groups: AdminGroup[] = [
    {
      title: "COMMAND CENTER",
      items: [
        ["Overview", "/admin"],
        ["Produits", "/admin/products"],
        ["Commandes", "/admin/orders"],
      ].map(([label, href]) => ({
        label,
        href: href as Route,
      })),
    },
    {
      title: "PEOPLE",
      items: [
        ["Utilisateurs", "/admin/users"],
      ].map(([label, href]) => ({
        label,
        href: href as Route,
      })),
    },
    {
      title: "CONFIG",
      items: [
        ["Paramètres", "/admin/settings"],
        ["Logs", "/admin/logs"],
      ].map(([label, href]) => ({
        label,
        href: href as Route,
      })),
    },
  ];

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-white/10 bg-black/65 p-5 backdrop-blur-2xl lg:block">
      <Logo admin src={logoSrc} />

      <div className="mt-10 space-y-7">
        {groups.map((group) => (
          <div key={group.title}>
            <div className="mb-2 px-3 text-[9px] font-black tracking-[.35em] text-white/25">
              {group.title}
            </div>

            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm text-white/55 transition hover:bg-white/[.07] hover:text-white"
                >
                  <span>{item.label}</span>

                  <span className="translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-50">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t border-white/10 pt-5">
        <Link
          href={"/api/auth/logout" as Route}
          className="block rounded-xl border border-white/10 px-3 py-3 text-xs font-bold text-white/45 hover:bg-white/5 hover:text-white"
        >
          DÉCONNEXION
        </Link>
      </div>
    </aside>
  );
}
