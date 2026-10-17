/**
 * Origen de la visita (de dónde llegó el cliente), para verlo en cada pedido.
 *
 * Shopify no puede saberlo solo: el cliente navega en orbitabags.cl y recién
 * salta a Shopify al pagar, así que Shopify siempre ve "orbitabags.cl" como
 * origen. Por eso lo guardamos acá al entrar y lo mandamos como atributo del
 * carrito ("Origen"), que Shopify muestra en "Información adicional" del pedido.
 *
 * Links para mandar por WhatsApp:
 *   https://orbitabags.cl/tienda?utm_source=whatsapp
 *   https://orbitabags.cl/tienda?utm_source=whatsapp&utm_campaign=personalizadas
 *
 * Regla: un link con utm_* (o un clic de anuncio de Meta, fbclid) reemplaza lo
 * guardado. Un simple referido (Google, Instagram) solo se guarda si no había
 * nada, para no pisar un origen de WhatsApp cuando el cliente vuelve por Google.
 */

const STORAGE_KEY = "orbita-origen";
const MAX_AGE_DAYS = 30;

type Origin = { value: string; savedAt: number };

function read(): Origin | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const origin = JSON.parse(raw) as Origin;
    const ageDays = (Date.now() - origin.savedAt) / 86_400_000;
    return ageDays <= MAX_AGE_DAYS ? origin : null;
  } catch {
    return null;
  }
}

function save(value: string) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, savedAt: Date.now() }));
  } catch {
    // Navegador sin almacenamiento (modo privado de algunas apps): se pierde el origen
  }
}

/** Arma el texto del origen a partir de la URL y el referido. Exportada para probarla. */
export function originFromVisit(search: string, referrer: string, ownHost: string) {
  const params = new URLSearchParams(search);
  const utm = ["utm_source", "utm_medium", "utm_campaign", "utm_content"]
    .map((key) => params.get(key)?.trim())
    .filter(Boolean);

  if (utm.length) return { value: utm.join(" / "), strong: true };
  if (params.has("fbclid")) return { value: "meta / anuncio", strong: true };

  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (host && !host.endsWith(ownHost.replace(/^www\./, ""))) {
      return { value: `${host} / referido`, strong: false };
    }
  } catch {
    // Sin referido (link escrito a mano, app de WhatsApp, etc.)
  }
  return null;
}

/** Se llama una vez al cargar el sitio. */
export function captureOrigin() {
  if (typeof window === "undefined") return;
  const visit = originFromVisit(window.location.search, document.referrer, window.location.hostname);
  if (!visit) return;
  if (visit.strong || !read()) save(visit.value);
}

/** Origen guardado, o "directo" si no hay ninguno. */
export function getOrigin(): string {
  return read()?.value ?? "directo";
}
