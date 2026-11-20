/**
 * Links de WhatsApp en un solo lugar: número, mensaje inicial según la página y
 * registro del clic (OpenPanel + Clarity + Meta Pixel "Contact").
 *
 * El mensaje inicial le dice a Belen desde qué página escribe el cliente, así
 * no hay que preguntarle qué tamaño estaba mirando.
 */
import { track } from "@/lib/analytics";
import { getOrigin } from "@/lib/attribution";

export const WHATSAPP_PHONE = "56931726288";
export const WHATSAPP_DISPLAY = "+56 9 3172 6288";

export function whatsappUrl(text?: string) {
  const base = `https://wa.me/${WHATSAPP_PHONE}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Mensaje inicial según la ruta en que está el cliente. */
export function messageForPath(pathname: string): string {
  const size = pathname.match(/(\d{2}x\d{2})/)?.[1];
  if (pathname.startsWith("/shop/") && size) {
    return `¡Hola! Estoy mirando la bolsa ${size} cm en la web y tengo una consulta.`;
  }
  if (pathname.startsWith("/personalizadas")) {
    return "¡Hola! Quiero cotizar bolsas personalizadas con mi logo.";
  }
  if (pathname.startsWith("/tienda")) {
    return "¡Hola! Estoy en la tienda y quiero ayuda para elegir tamaño.";
  }
  return "¡Hola! Me interesan las bolsas compostables de Orbita Bags.";
}

/** Registra el clic. `ubicacion` dice qué botón fue (flotante, footer, contacto…). */
export function trackWhatsAppClick(ubicacion: string, pathname: string) {
  track("whatsapp_click", { ubicacion, pagina: pathname, origen: getOrigin() });
  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq === "function") {
    fbq("track", "Contact", { content_name: ubicacion });
  }
}
