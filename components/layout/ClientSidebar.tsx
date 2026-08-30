import Link from "next/link";

export function ClientSidebar() {
  return <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-black/60 p-5 md:block">
    <div className="mb-8 text-xl font-black tracking-[.2em]">DROPZONE</div>
    <nav className="space-y-2 text-sm">
      <Link className="block rounded-xl px-4 py-3 hover:bg-white/10" href="/dashboard">Dashboard</Link>
      <Link className="block rounded-xl px-4 py-3 hover:bg-white/10" href="/products">Produits</Link>
      <Link className="block rounded-xl px-4 py-3 hover:bg-white/10" href="/orders">Mes commandes</Link>
      <Link className="block rounded-xl px-4 py-3 hover:bg-white/10" href="/account">Mon compte</Link>
      <Link className="block rounded-xl px-4 py-3 hover:bg-white/10" href="/support">Support</Link>
    </nav>
  </aside>;
}