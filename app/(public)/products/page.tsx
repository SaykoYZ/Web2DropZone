import Link from "next/link";
import { PublicNav } from "@/components/layout/PublicNav";
import { JsonProductRepository } from "@/lib/repositories/products";

export default async function ProductsPage() {
  const products = (await new JsonProductRepository().getAll()).filter(p => p.active);
  return <><PublicNav/><main className="mx-auto min-h-screen max-w-7xl px-6 py-16">
    <div className="mb-10"><div className="text-xs tracking-[.4em] text-white/35">CATALOGUE</div><h1 className="mt-2 text-5xl font-black">Produits</h1></div>
    <div className="grid gap-5 md:grid-cols-3">{products.map(p => <Link key={p.id} href={`/products/${p.id}`} className="metal rounded-3xl p-5 hover:-translate-y-1">
      <div className="aspect-video rounded-2xl bg-white/[.04] p-5 font-black text-white/15">{p.category}</div>
      <h2 className="mt-5 text-xl font-bold">{p.name}</h2><p className="mt-2 text-sm text-white/45">{p.description}</p>
      <div className="mt-5 font-bold">{p.price.toFixed(2)} {p.currency}</div>
    </Link>)}</div>
  </main></>;
}