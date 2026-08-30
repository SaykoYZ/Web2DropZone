import { notFound } from "next/navigation";
import { JsonProductRepository } from "@/lib/repositories/products";
import { getSettings } from "@/lib/repositories/settings";
import { PublicNav } from "@/components/layout/PublicNav";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [p, s] = await Promise.all([new JsonProductRepository().getById(id), getSettings()]);
  if (!p || !p.active) return notFound();
  return <><PublicNav/><main className="mx-auto min-h-screen max-w-6xl px-6 py-16">
    <div className="grid gap-8 md:grid-cols-2">
      <div className="metal flex aspect-square items-center justify-center overflow-hidden rounded-3xl">{p.image?<img src={p.image} alt={p.name} className="h-full w-full object-cover"/>:<span className="text-5xl font-black text-white/10">{p.name}</span>}</div>
      <div className="py-6"><div className="text-xs tracking-[.4em] text-white/35">{p.category}</div><h1 className="mt-3 text-5xl font-black">{p.name}</h1><p className="mt-6 leading-7 text-white/55">{p.description}</p><div className="mt-8 text-3xl font-bold">{p.price.toFixed(2)} {p.currency}</div><div className="mt-4 text-sm text-white/45">{p.stock > 0 ? `${p.stock} en stock` : "Rupture de stock"}</div>
      {s.paymentEnabled && p.stock>0 && <div className="mt-8 rounded-2xl border border-white/10 bg-white/[.03] p-5"><div className="text-[10px] font-bold tracking-[.3em] text-white/35">PAIEMENT</div><div className="mt-3 text-lg font-black">{s.paymentName}</div><div className="mt-2 text-sm text-white/50">{s.paypalEmail}</div><p className="mt-4 text-xs leading-5 text-white/35">{s.paymentInstructions}</p></div>}
      <button disabled={p.stock <= 0 || !s.paymentEnabled} className="mt-8 rounded-2xl bg-white px-7 py-3 font-bold text-black disabled:opacity-30">{s.paymentEnabled?"Acheter":"Paiement désactivé"}</button></div>
    </div>
  </main></>;
}
