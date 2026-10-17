/**
 * Webhook de Shopify (orders/paid) → evento "purchase" en OpenPanel.
 *
 * Se usa un webhook y no un Custom Pixel porque el pixel corre en un iframe
 * aislado que manda Origin: null, y OpenPanel rechaza orígenes no permitidos.
 * Además así la compra se registra aunque el cliente tenga bloqueador o cierre
 * la pestaña, y el client secret nunca llega al navegador.
 *
 * El sitio guarda el deviceId de OpenPanel en el atributo oculto del carrito
 * "_op_device_id" (src/stores/cartStore.ts), y aquí se usa para unir la compra
 * con la navegación previa del mismo visitante.
 *
 * Variables en Cloudflare Pages (producción):
 *   VITE_OPENPANEL_CLIENT_ID   texto (el mismo que usa el sitio)
 *   OPENPANEL_CLIENT_SECRET    secreto
 *   SHOPIFY_WEBHOOK_SECRET     secreto (firma de webhooks en Shopify → Notificaciones)
 */

interface Env {
  VITE_OPENPANEL_CLIENT_ID?: string;
  OPENPANEL_CLIENT_SECRET?: string;
  SHOPIFY_WEBHOOK_SECRET?: string;
}

interface ShopifyOrder {
  id: number;
  name?: string;
  total_price?: string;
  subtotal_price?: string;
  currency?: string;
  browser_ip?: string | null;
  client_details?: { user_agent?: string | null } | null;
  note_attributes?: Array<{ name: string; value: string }>;
  discount_codes?: Array<{ code: string }>;
  line_items?: Array<{ quantity: number }>;
  customer?: { orders_count?: number } | null;
}

const OPENPANEL_TRACK_URL = "https://api.openpanel.dev/track";

async function isValidShopifySignature(rawBody: string, hmacHeader: string | null, secret: string) {
  if (!hmacHeader) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  let signature: Uint8Array;
  try {
    signature = Uint8Array.from(atob(hmacHeader), (c) => c.charCodeAt(0));
  } catch {
    return false;
  }
  return crypto.subtle.verify("HMAC", key, signature, new TextEncoder().encode(rawBody));
}

export function buildPurchaseEvent(order: ShopifyOrder) {
  const attrs = Object.fromEntries((order.note_attributes ?? []).map((a) => [a.name, a.value]));
  const total = Math.round(parseFloat(order.total_price ?? "0"));
  const deviceId = attrs["_op_device_id"];

  return {
    type: "track",
    payload: {
      name: "purchase",
      properties: {
        order_id: String(order.id),
        order_name: order.name,
        total,
        subtotal: Math.round(parseFloat(order.subtotal_price ?? "0")),
        currency: order.currency,
        items: (order.line_items ?? []).reduce((sum, li) => sum + li.quantity, 0),
        wants_invoice: attrs["Factura"] === "Sí",
        discount_code: order.discount_codes?.[0]?.code,
        returning_customer: (order.customer?.orders_count ?? 1) > 1,
        __revenue: total,
        ...(deviceId ? { __deviceId: deviceId } : {}),
      },
    },
  };
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const { VITE_OPENPANEL_CLIENT_ID: clientId, OPENPANEL_CLIENT_SECRET: clientSecret, SHOPIFY_WEBHOOK_SECRET: webhookSecret } = env;
  if (!clientId || !clientSecret || !webhookSecret) {
    return new Response("Missing configuration", { status: 500 });
  }

  const rawBody = await request.text();
  const valid = await isValidShopifySignature(rawBody, request.headers.get("X-Shopify-Hmac-Sha256"), webhookSecret);
  if (!valid) return new Response("Invalid signature", { status: 401 });

  const order = JSON.parse(rawBody) as ShopifyOrder;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "openpanel-client-id": clientId,
    "openpanel-client-secret": clientSecret,
  };
  // Sin esto OpenPanel tomaría la IP y el navegador de Cloudflare, no del cliente
  if (order.browser_ip) headers["x-client-ip"] = order.browser_ip;
  if (order.client_details?.user_agent) headers["user-agent"] = order.client_details.user_agent;

  const res = await fetch(OPENPANEL_TRACK_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(buildPurchaseEvent(order)),
  });

  // Si OpenPanel falla devolvemos 502 para que Shopify reintente el webhook
  if (!res.ok) return new Response(`OpenPanel error ${res.status}`, { status: 502 });
  return new Response("ok");
};
