/**
 * Analítica de producto: OpenPanel (eventos y embudos) + Microsoft Clarity
 * (grabaciones y mapas de calor).
 *
 * Los IDs vienen de variables de entorno de Cloudflare Pages:
 *   VITE_OPENPANEL_CLIENT_ID
 *   VITE_CLARITY_PROJECT_ID
 * Si falta alguno, esa herramienta simplemente no se carga. En desarrollo
 * (npm run dev) no se envía nada para no ensuciar los datos.
 */
import { OpenPanel } from "@openpanel/web";
import Clarity from "@microsoft/clarity";

type Props = Record<string, string | number | boolean | null | undefined>;

const OPENPANEL_CLIENT_ID = import.meta.env.VITE_OPENPANEL_CLIENT_ID as string | undefined;
const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined;
const enabled = import.meta.env.PROD && typeof window !== "undefined";

let op: OpenPanel | null = null;
let clarityReady = false;

export function initAnalytics() {
  if (!enabled) return;

  if (OPENPANEL_CLIENT_ID && !op) {
    op = new OpenPanel({
      clientId: OPENPANEL_CLIENT_ID,
      trackScreenViews: true,
      trackOutgoingLinks: true,
      // Elementos con data-track="nombre_evento" se registran solos
      trackAttributes: true,
    });
  }

  if (CLARITY_PROJECT_ID && !clarityReady) {
    Clarity.init(CLARITY_PROJECT_ID);
    clarityReady = true;
  }
}

/** Registra un evento en OpenPanel y lo marca en Clarity para filtrar grabaciones. */
export function track(event: string, props: Props = {}) {
  if (!enabled) {
    if (import.meta.env.DEV) console.debug("[analytics]", event, props);
    return;
  }
  op?.track(event, props);
  if (clarityReady) Clarity.event(event);
}

/**
 * ID de dispositivo de OpenPanel. Se manda al carrito de Shopify como atributo
 * oculto para que el webhook de compra (functions/api/shopify-order-paid.ts)
 * atribuya la venta al mismo visitante.
 */
export function getAnalyticsDeviceId(): string {
  return op?.getDeviceId() ?? "";
}
