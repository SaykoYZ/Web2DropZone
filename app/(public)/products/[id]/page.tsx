import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/server/session";
import { JsonOrderRepository } from "@/lib/repositories/orders";
import { JsonProductRepository } from "@/lib/repositories/products";
import { getSettings } from "@/lib/repositories/settings";
import { PublicNav } from "@/components/layout/PublicNav";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const order = await new JsonOrderRepository().getById(id);

  if (!order || order.userId !== user.id) {
    notFound();
  }

  const product = await new JsonProductRepository().getById(
    order.productId
  );

  const settings = await getSettings();

  return (
    <>
      <PublicNav />

      <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
        <div className="dz-metal rounded-3xl p-8">
          <div className="text-xs tracking-[.4em] text-white/30">
            DROPZONE / COMMANDE
          </div>

          <h1 className="mt-4 text-4xl font-black">
            Finaliser votre commande
          </h1>

          <div className="mt-8 rounded-2xl border border-white/10 p-6">
            <p className="text-white/40">Produit</p>

            <h2 className="mt-2 text-2xl font-black">
              {product?.name || "Produit"}
            </h2>

            <p className="mt-4 text-3xl font-black">
              {order.amount.toFixed(2)} {order.currency}
            </p>

            <p className="mt-3 text-xs text-white/30">
              Commande : {order.id}
            </p>
          </div>

          {settings.paymentEnabled && (
            <div className="mt-6 rounded-2xl border border-white/10 p-6">
              <div className="text-xs font-bold tracking-[.3em] text-white/40">
                PAIEMENT
              </div>

              <h2 className="mt-3 text-2xl font-black">
                {settings.paymentName}
              </h2>

              <p className="mt-4 text-sm text-white/50">
                {settings.paymentInstructions}
              </p>

              <div className="mt-5 rounded-xl border border-white/10 p-4">
                <p className="text-xs text-white/30">
                  Adresse PayPal
                </p>

                <p className="mt-2 font-bold">
                  {settings.paypalEmail}
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-white/10 p-4 text-sm">
            Statut :
            <strong className="ml-2">
              {order.status}
            </strong>
          </div>
        </div>
      </main>
    </>
  );
}
