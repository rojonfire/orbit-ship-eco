// Precio por bolsa personalizada (bolsa + impresión, IVA incluido), por tamaño y N° de colores del logo.
// Fuente única: la usan la página de Bolsas Personalizadas y el Generador de OC.
export const PERSONALIZADA_SIZES = ["20 × 30 cm", "30 × 40 cm", "40 × 50 cm", "50 × 60 cm"] as const;

// Índice = tamaño; cada fila: [1 color, 2 colores, 3 colores, 4 colores]
export const PRICING_100: number[][] = [
  [730, 1180, 1630, 2070],
  [800, 1250, 1700, 2140],
  [880, 1330, 1780, 2220],
  [990, 1440, 1890, 2330],
];

// Desde 200 unidades: mismo precio pidas 200 o 5.000.
export const PRICING_200: number[][] = [
  [510, 730, 950, 1180],
  [580, 800, 1020, 1250],
  [660, 890, 1110, 1330],
  [770, 1000, 1220, 1440],
];

export const PERSONALIZADA_MIN_QTY = 100;

export const personalizadaPrice = (sizeIdx: number, colors: number, qty: number) =>
  (qty >= 200 ? PRICING_200 : PRICING_100)[sizeIdx][colors - 1];
