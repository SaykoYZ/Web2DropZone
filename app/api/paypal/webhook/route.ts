import { NextResponse } from "next/server";

import { JsonOrderRepository } from "@/lib/repositories/orders";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

const PAYPAL_API =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials are missing.");
  }

  const credentials = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(
    `${PAYPAL_API}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("PayPal authentication failed.");
  }

  const data = await response.json();

  return data.access_token as string;
}

async function verifyWebhook(
  headers: Headers,
  event: unknown
) {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${PAYPAL_API}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: headers.get("paypal-auth-algo"),
        cert_url: headers.get("paypal-cert-url"),
        transmission_id: headers.get("paypal-transmission-id"),
        transmission_sig: headers.get("paypal-transmission-sig"),
        transmission_time: headers.get("paypal-transmission-time"),

        webhook_id: process.env.PAYPAL_WEBHOOK_ID,

        webhook_event: event,
      }),
    }
  );

  if (!response.ok) {
    return false;
  }

  const result = await response.json();

  return result.verification_status === "SUCCESS";
}

export async function POST(req: Request) {
  try {
    const event = await req.json();

    const valid = await verifyWebhook(req.headers, event);

    if (!valid) {
      console.error("Invalid PayPal webhook.");

      return NextResponse.json(
        { error: "Invalid webhook." },
        { status: 400 }
      );
    }

    const eventType = event.event_type;

    /*
     * Paiement capturé avec succès.
     */
    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const resource = event.resource;

      const captureId = resource?.id;

      const paypalOrderId =
        resource?.supplementary_data?.related_ids?.order_id;

      console.log(
        "PAYPAL PAYMENT COMPLETED:",
        captureId,
        paypalOrderId
      );

      /*
       * PayPal met notre ID de commande dans custom_id.
       */
      const customId =
        resource?.custom_id ||
        resource?.supplementary_data?.related_ids?.order_id;

      if (customId) {
        const orderRepo = new JsonOrderRepository();

        const order = await orderRepo.getById(customId);

        if (order && order.status === "PENDING") {
          await orderRepo.update(order.id, {
            status: "PAID",
            updatedAt: new Date().toISOString(),
          });

          console.log(
            `✅ Commande ${order.id} automatiquement passée à PAID.`
          );
        }
      }
    }

    /*
     * Commande PayPal terminée.
     */
    if (eventType === "CHECKOUT.ORDER.COMPLETED") {
      console.log(
        "✅ PAYPAL ORDER COMPLETED:",
        event.resource?.id
      );
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("PAYPAL WEBHOOK ERROR:", error);

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 }
    );
  }
}
