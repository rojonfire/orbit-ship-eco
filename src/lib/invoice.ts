import { z } from 'zod';

/**
 * La copia en la planilla NO se envía desde el sitio: la escribe Shopify vía
 * webhook `orders/paid`, para que solo lleguen facturas de compras efectivamente
 * pagadas. Ver docs/facturacion-google-sheet.md.
 *
 * Desde acá solo viajan los datos como atributos del carrito, que Shopify guarda
 * en la orden.
 */

/** Valida un RUT chileno incluyendo el dígito verificador. */
export function isValidRut(rut: string): boolean {
  const clean = rut.replace(/[.\s]/g, '').toUpperCase();
  const match = clean.match(/^(\d{7,8})-?([\dK])$/);
  if (!match) return false;

  const [, digits, checkDigit] = match;
  let sum = 0;
  let multiplier = 2;

  for (let i = digits.length - 1; i >= 0; i--) {
    sum += parseInt(digits[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  const expected = remainder === 11 ? '0' : remainder === 10 ? 'K' : String(remainder);
  return expected === checkDigit;
}

/** Formatea un RUT como 76.543.210-K */
export function formatRut(rut: string): string {
  const clean = rut.replace(/[^\dkK]/g, '').toUpperCase();
  if (clean.length < 2) return clean;

  const body = clean.slice(0, -1);
  const checkDigit = clean.slice(-1);
  return `${body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${checkDigit}`;
}

export const invoiceSchema = z.object({
  rut: z
    .string()
    .min(1, 'Ingresa el RUT de la empresa')
    .refine(isValidRut, 'El RUT no es válido'),
  razonSocial: z.string().trim().min(3, 'Ingresa la razón social'),
  giro: z.string().trim().min(3, 'Ingresa el giro'),
  direccion: z.string().trim().min(5, 'Ingresa la dirección comercial'),
});

export type InvoiceData = z.infer<typeof invoiceSchema>;

/** Convierte los datos de facturación en atributos para la orden de Shopify. */
export function toCartAttributes(data: InvoiceData) {
  return [
    { key: 'Factura', value: 'Sí' },
    { key: 'RUT', value: formatRut(data.rut) },
    { key: 'Razón social', value: data.razonSocial },
    { key: 'Giro', value: data.giro },
    { key: 'Dirección comercial', value: data.direccion },
  ];
}

