import ref2030Blanca from "@/assets/bolsa-20x30-referencia-blanca.webp";
import ref2030Negra from "@/assets/bolsa-20x30-referencia-negra.webp";
import ref3040Blanca from "@/assets/bolsa-30x40-referencia-blanca.webp";
import ref3040Negra from "@/assets/bolsa-30x40-referencia-negra.webp";
import ref4050Blanca from "@/assets/bolsa-40x50-referencia-blanca.webp";
import ref4050Negra from "@/assets/bolsa-40x50-referencia-negra.webp";
import ref5060Blanca from "@/assets/bolsa-50x60-referencia-blanca.webp";
import ref5060Negra from "@/assets/bolsa-50x60-referencia-negra.webp";

export interface SizeMedia {
  video: string;
  poster: string;
  sizePhoto: Record<string, string>;
  sizeAlt: string;
}

// Media de referencia de tamaño por producto: foto con objeto real (por color) y video (sin audio)
export const SIZE_MEDIA: Record<string, SizeMedia> = {
  "bolsa-biodegradable-20x30-cm": {
    video: "/videos/bolsa-20x30.mp4",
    poster: "/videos/bolsa-20x30-poster.jpg",
    sizePhoto: { Blanca: ref2030Blanca, Negra: ref2030Negra },
    sizeAlt: "Bolsa compostable 20x30 cm comparada con un teléfono",
  },
  "bolsa-biodegradable-30x40-cm": {
    video: "/videos/bolsa-30x40.mp4",
    poster: "/videos/bolsa-30x40-poster.jpg",
    sizePhoto: { Blanca: ref3040Blanca, Negra: ref3040Negra },
    sizeAlt: "Bolsa compostable 30x40 cm comparada con un cuaderno",
  },
  "bolsa-biodegradable-40x50-cm": {
    video: "/videos/bolsa-40x50.mp4",
    poster: "/videos/bolsa-40x50-poster.jpg",
    sizePhoto: { Blanca: ref4050Blanca, Negra: ref4050Negra },
    sizeAlt: "Bolsa compostable 40x50 cm comparada con un chaleco doblado",
  },
  "bolsa-biodegradable-50x60-cm": {
    video: "/videos/bolsa-50x60.mp4",
    poster: "/videos/bolsa-50x60-poster.jpg",
    sizePhoto: { Blanca: ref5060Blanca, Negra: ref5060Negra },
    sizeAlt: "Bolsa compostable 50x60 cm comparada con una caja de zapatos",
  },
};
