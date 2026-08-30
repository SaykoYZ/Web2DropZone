import { NextResponse } from "next/server";
import crypto from "crypto";

import { getCurrentUser } from "@/lib/server/session";
import { JsonOrderRepository } from "@/lib/repositories/orders";
import { JsonProductRepository } from "@/lib/repositories/products";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const orders = await new JsonOrderRepository().getAll();

  return NextResponse.json(
    orders.filter((order) => order.userId === user.id)
  );
}

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Tu dois être connecté pour acheter." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const productId = String(body.productId || "");

    if (!productId) {
      return NextResponse.json(
        { error: "Produit invalide." },
        { status: 400 }
      );
    }

    const productRepo = new JsonProductRepository();
    const product = await productRepo.getById(productId);

    if (!product) {
      return NextResponse.json(
        { error: "Produit introuvable." },
        { status: 404 }
      );
    }

    if (!product.active) {
      return NextResponse.json(
        { error: "Ce produit est désactivé." },
        { status: 400 }
      );
    }

    if (product.stock <= 0) {
      return NextResponse.json(
        { error: "Produit en rupture de stock." },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const order = {
      id: crypto.randomUUID(),
      userId: user.id,
      productId: product.id,
      offerId: "",
      amount: product.price,
      currency: product.currency,
      status: "PENDING" as const,
      createdAt: now,
      updatedAt: now,
    };

    await new JsonOrderRepository().create(order);

    await productRepo.update(product.id, {
      stock: product.stock - 1,
    });

    return NextResponse.json({
      ok: true,
      id: order.id,
    });
  } catch (error) {
    console.error("ORDER_CREATE_ERROR:", error);

    return NextResponse.json(
      { error: "Erreur lors de la création de la commande." },
      { status: 500 }
    );
  }
}
