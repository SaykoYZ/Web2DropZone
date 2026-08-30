import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/server/session";
import { JsonOrderRepository } from "@/lib/repositories/orders";
import { JsonProductRepository } from "@/lib/repositories/products";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

const PAYPAL_API =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal environment variables are missing.");
  }

  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to authenticate with PayPal.");
  }

  const data = await response.json();

  return data.access_token as string;
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Tu dois être connecté." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const productId = String(body.productId || "");

    if (!productId) {
      return NextResponse.json(
        { error: "Produit invalide." },
        { status: 400 }
      );
    }

    const productRepo = new JsonProductRepository();
    const orderRepo = new JsonOrderRepository();

    const product = await productRepo.getById(productId);

    if (!product) {
      return NextResponse.json(
        { error: "Produit introuvable." },
        { status: 404 }
      );
    }

    if (!product.active) {
      return NextResponse.json(
        { error: "Produit indisponible." },
        { status: 400 }
      );
    }

    if (product.stock <= 0) {
      return NextResponse.json(
        { error: "Produit en rupture de stock." },
        { status: 400 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    const order = await orderRepo.create({
      id: crypto.randomUUID(),
      userId: user.id,
      productId: product.id,
      offerId: "",
      amount: product.price,
      currency: product.currency,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const paypalResponse = await fetch(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",

          purchase_units: [
            {
              reference_id: order.id,

              custom_id: order.id,

              description: product.name,

              amount: {
                currency_code: product.currency,
                value: product.price.toFixed(2),
              },
            },
          ],

          application_context: {
            brand_name: "DropZone",
            user_action: "PAY_NOW",

            return_url:
              `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?orderId=${order.id}`,

            cancel_url:
              `${process.env.NEXT_PUBLIC_SITE_URL}/payment/cancel?orderId=${order.id}`,
          },
        }),
      }
    );

    if (!paypalResponse.ok) {
      const error = await paypalResponse.text();

      console.error("PAYPAL CREATE ERROR:", error);

      return NextResponse.json(
        { error: "Impossible de créer le paiement PayPal." },
        { status: 500 }
      );
    }

    const paypalOrder = await paypalResponse.json();

    const approveLink = paypalOrder.links?.find(
      (link: { rel?: string }) => link.rel === "approve"
    );

    if (!approveLink?.href) {
      return NextResponse.json(
        { error: "Lien PayPal introuvable." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      paypalOrderId: paypalOrder.id,
      url: approveLink.href,
    });
  } catch (error) {
    console.error("PAYPAL CREATE ORDER ERROR:", error);

    return NextResponse.json(
      { error: "Erreur lors de la création du paiement." },
      { status: 500 }
    );
  }
}
