
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BuyButton({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function buy() {
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        alert(data.error || "Impossible de créer la commande.");
        return;
      }

      router.push(`/orders/${data.id}`);
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={buy}
      disabled={loading}
      className="mt-8 rounded-2xl bg-white px-7 py-3 font-bold text-black transition hover:scale-[1.02] disabled:opacity-40"
    >
      {loading ? "Création..." : "Acheter"}
    </button>
  );
}
