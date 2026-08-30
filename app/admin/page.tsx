import { JsonProductRepository } from "@/lib/repositories/products";
import { JsonUserRepository } from "@/lib/repositories/users";
import { JsonOrderRepository } from "@/lib/repositories/orders";
import Link from "next/link";
import type { Route } from "next";

export default async function Admin() {
  const [p, u, o] = await Promise.all([
    new JsonProductRepository().getAll(),
    new JsonUserRepository().getAll(),
    new JsonOrderRepository().getAll(),
  ]);

  const cards: [string, string][] = [
    ["CA", "0 €"],
    ["Clients", String(u.filter((x) => x.role === "USER").length)],
    ["Commandes", String(o.length)],
    ["Produits actifs", String(p.filter((x) => x.active).length)],
  ];

  const quickLinks: [string, Route][] = [
    ["Produits", "/admin/products"],
    ["Utilisateurs", "/admin/users"],
    ["Commandes", "/admin/orders"],
    ["Logs", "/admin/logs"],
    ["Paramètres", "/admin/settings"],
  ];

  const activity = [25, 48, 38, 65, 55, 80, 68, 92, 70, 100, 82, 94];

  return (
    <main className="dz-grid min-h-screen p-6 md:p-10">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] tracking-[.5em] text-white/30">
            DROPZONE / CONTROL CENTER
          </div>

          <h1 className="mt-3 text-5xl font-black tracking-[-0.05em]">
            Overview
          </h1>
        </div>

        <Link
          href="/"
          className="rounded-xl border border-white/10 px-4 py-2 text-xs text-white/50 hover:bg-white/5"
        >
          SITE ↗
        </Link>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {cards.map(([title, value]) => (
          <div
            key={title}
            className="dz-metal rounded-2xl p-6 transition hover:-translate-y-1"
          >
            <div className="text-[10px] font-bold tracking-[.3em] text-white/30">
              {title}
            </div>

            <div className="mt-5 text-4xl font-black">
              {value}
            </div>

            <div className="mt-4 h-px bg-gradient-to-r from-white/20 to-transparent" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
        <div className="dz-metal min-h-[350px] rounded-3xl p-7">
          <h2 className="text-xl font-black">
            Activité
          </h2>

          <p className="mt-1 text-xs text-white/30">
            Vue synthétique du système
          </p>

          <div className="mt-16 flex h-44 items-end gap-2">
            {activity.map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t bg-gradient-to-t from-white/[.04] to-white/[.2] transition hover:from-white/[.12] hover:to-white/[.45]"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        <div className="dz-metal rounded-3xl p-7">
          <h2 className="text-xl font-black">
            Accès rapide
          </h2>

          <div className="mt-5 space-y-2">
            {quickLinks.map(([title, href]) => (
              <Link
                key={title}
                href={href}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[.02] px-4 py-3 text-sm text-white/55 hover:bg-white/10 hover:text-white"
              >
                <span>{title}</span>
                <span>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
