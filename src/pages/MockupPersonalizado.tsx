import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import bolsaBlancaPlana from "@/assets/bolsa-blanca-plana.webp";
import bolsaNegraPlana from "@/assets/bolsa-negra-plana.webp";
import bolsaNegraOrbita from "@/assets/bolsa-negra-orbita.webp";
import bolsaBlancaOrbita from "@/assets/bolsa-blanca-orbita.webp";

type Color = "Blanca" | "Negra";

interface BagSizeOption {
  id: string;
  label: string;
  bagCm: { w: number; h: number };
}

const BAG_SIZES: BagSizeOption[] = [
  { id: "20x30", label: "20 × 30 cm", bagCm: { w: 20, h: 30 } },
  { id: "30x40", label: "30 × 40 cm", bagCm: { w: 30, h: 40 } },
  { id: "40x50", label: "40 × 50 cm", bagCm: { w: 40, h: 50 } },
  { id: "50x60", label: "50 × 60 cm", bagCm: { w: 50, h: 60 } },
];

// Área máxima de estampado real (confirmada): desde 1 cm hasta tamaño A4, en una sola posición
// de la bolsa. Es igual para los 4 tamaños de bolsa (con un tope adicional más abajo para que
// el logo nunca sea físicamente más grande que la propia bolsa).
const MAX_PRINT_CM = { w: 21, h: 29.7 };
const MIN_CM = 1;

// Es un sellado simple tipo pillow-pack (no un flap grande de adhesivo doble como las bolsas con
// diseño) — solo se deja un margen chico bajo el borde superior sellado.
const FLAP_PCT = 6;

// Las fotos originales son cuadradas (1254×1254), con la bolsa flotando sobre fondo gris y su
// sombra — se muestran completas, sin recortar. El contenedor usa esta misma proporción.
const BAG_PHOTO_ASPECT: Record<Color, number> = { Blanca: 1254 / 1254, Negra: 1254 / 1254 };

// Dónde está la bolsa DENTRO de la foto completa (% del lienzo de 1254×1254). El contraste bolsa/
// fondo es muy bajo (sobre todo en la blanca), así que se midió por transición de brillo píxel a
// píxel en varias filas/columnas, no a ojo ni con trim automático (que daba resultados asimétricos
// y no calzaba con el centro real de la bolsa). Blanca y Negra dieron prácticamente el mismo
// recuadro, como se espera de la misma cámara/set fotográfico.
const BAG_BBOX_PCT: Record<Color, { x: number; y: number; w: number; h: number }> = {
  Blanca: { x: 23, y: 16.4, w: 54.5, h: 73.4 },
  Negra: { x: 23, y: 16.4, w: 54.5, h: 73.4 },
};

// Foto real de la cara CON el diseño de Órbita, para mostrarla al lado de la cara con el logo del
// cliente. Falta la equivalente en Blanca (mismo encuadre que las "plana") — pedirla si se retoma.
const BRANDED_PHOTO: Partial<Record<Color, string>> = { Negra: bolsaNegraOrbita, Blanca: bolsaBlancaOrbita };

const POSITION_PRESETS: { id: string; label: string; x: number; y: number }[] = [
  { id: "top-left", label: "↖", x: 0, y: 0 },
  { id: "top-center", label: "↑", x: 0.5, y: 0 },
  { id: "top-right", label: "↗", x: 1, y: 0 },
  { id: "middle-left", label: "←", x: 0, y: 0.5 },
  { id: "center", label: "•", x: 0.5, y: 0.5 },
  { id: "middle-right", label: "→", x: 1, y: 0.5 },
  { id: "bottom-left", label: "↙", x: 0, y: 1 },
  { id: "bottom-center", label: "↓", x: 0.5, y: 1 },
  { id: "bottom-right", label: "↘", x: 1, y: 1 },
];

export default function MockupPersonalizado() {
  const [sizeId, setSizeId] = useState(BAG_SIZES[2].id);
  const [color, setColor] = useState<Color>("Blanca");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [aspect, setAspect] = useState(1); // alto / ancho del logo
  const [widthCm, setWidthCm] = useState(15);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 }); // fracción 0-1 del cuerpo imprimible (bajo el pliegue)

  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ offsetX: number; offsetY: number } | null>(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  const bagSize = BAG_SIZES.find((s) => s.id === sizeId) ?? BAG_SIZES[0];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
    };
  }, [logoUrl]);

  // Tope real: lo menor entre A4 y un margen de la propia bolsa (no puede estampar más grande que ella).
  const maxWidthCmFor = (bagW: number, bagH: number, a: number) =>
    Math.min(MAX_PRINT_CM.w, MAX_PRINT_CM.h / a, bagW * 0.9, (bagH * (1 - FLAP_PCT / 100) * 0.85) / a);

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const a = img.naturalHeight / img.naturalWidth || 1;
      setAspect(a);
      const maxW = maxWidthCmFor(bagSize.bagCm.w, bagSize.bagCm.h, a);
      setWidthCm(Math.min(maxW, Math.max(MIN_CM, maxW * 0.7)));
      setPos({ x: 0.5, y: 0.5 });
    };
    img.src = url;
    setLogoUrl(url);
  };

  const maxWidthCm = maxWidthCmFor(bagSize.bagCm.w, bagSize.bagCm.h, aspect);
  const heightCm = widthCm * aspect;

  // La foto se muestra siempre igual (completa, sin recortes ni márgenes) — lo único que cambia
  // según el "Tamaño de bolsa" es el tamaño relativo del logo sobre ella: el mismo estampado de
  // X cm ocupa más de una bolsa chica y menos de una grande.
  const getBagBboxPx = () => {
    const bbox = BAG_BBOX_PCT[color];
    return {
      x: (bbox.x / 100) * containerSize.w,
      y: (bbox.y / 100) * containerSize.h,
      w: (bbox.w / 100) * containerSize.w,
      h: (bbox.h / 100) * containerSize.h,
    };
  };

  const scalePxPerCm = () => getBagBboxPx().w / bagSize.bagCm.w;

  const logoPxSize = () => {
    const scale = scalePxPerCm();
    return { w: widthCm * scale, h: heightCm * scale };
  };

  // Cuerpo imprimible: el ancho de la bolsa (no de toda la foto), desde el borde inferior del
  // pliegue hacia abajo.
  const getBodyPx = () => {
    const bbox = getBagBboxPx();
    const flapPx = (FLAP_PCT / 100) * bbox.h;
    return { x: bbox.x, y: bbox.y + flapPx, w: bbox.w, h: bbox.h - flapPx };
  };

  const centerPx = () => {
    const body = getBodyPx();
    const { w: logoW, h: logoH } = logoPxSize();
    const rangeX = Math.max(body.w - logoW, 0);
    const rangeY = Math.max(body.h - logoH, 0);
    return {
      x: body.x + logoW / 2 + pos.x * rangeX,
      y: body.y + logoH / 2 + pos.y * rangeY,
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const el = containerRef.current;
    if (!el) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    const rect = el.getBoundingClientRect();
    const c = centerPx();
    dragState.current = {
      offsetX: e.clientX - rect.left - c.x,
      offsetY: e.clientY - rect.top - c.y,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const body = getBodyPx();
    const { w: logoW, h: logoH } = logoPxSize();

    let cx = e.clientX - rect.left - dragState.current.offsetX;
    let cy = e.clientY - rect.top - dragState.current.offsetY;

    const minX = body.x + logoW / 2;
    const maxX = body.x + body.w - logoW / 2;
    const minY = body.y + logoH / 2;
    const maxY = body.y + body.h - logoH / 2;
    cx = Math.min(Math.max(cx, minX), maxX);
    cy = Math.min(Math.max(cy, minY), maxY);

    const rangeX = Math.max(body.w - logoW, 0);
    const rangeY = Math.max(body.h - logoH, 0);
    setPos({
      x: rangeX > 0 ? (cx - minX) / rangeX : 0.5,
      y: rangeY > 0 ? (cy - minY) / rangeY : 0.5,
    });
  };

  const onPointerUp = () => {
    dragState.current = null;
  };

  const logoSize = logoPxSize();
  const center = centerPx();
  const body = getBodyPx();
  const isDark = color === "Negra";

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Vista previa de logo en bolsa (prueba interna)</h1>
          <p className="text-muted-foreground mt-2 text-sm max-w-2xl">
            Herramienta interna, no está enlazada ni visible en el sitio. Es una sola bolsa, con dos
            caras: el <strong>Lado A</strong> siempre trae el diseño de Órbita (no es opcional). El{" "}
            <strong>Lado B</strong> viene en blanco si no se personaliza, o con el logo del cliente si
            se personaliza — se puede arrastrar a cualquier parte, incluidas las esquinas, y ajustar
            de tamaño dentro del máximo real de estampado.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-sm font-medium mb-2 text-center">Lado A — diseño de Órbita (siempre)</p>
            <div
              className="relative w-full rounded-lg overflow-hidden shadow-sm bg-neutral-100"
              style={{ aspectRatio: `${BAG_PHOTO_ASPECT[color]}` }}
            >
              {BRANDED_PHOTO[color] ? (
                <img
                  src={BRANDED_PHOTO[color]}
                  alt={`Bolsa ${color.toLowerCase()} con el diseño de Órbita`}
                  className="absolute inset-0 w-full h-full object-contain"
                  draggable={false}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground text-center p-6">
                  Falta la foto de la bolsa {color.toLowerCase()} con el diseño de Órbita
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2 text-center">
              Lado B — {logoUrl ? "con tu logo" : "en blanco (sin personalizar)"}
            </p>
            <div
              ref={containerRef}
              className="relative w-full select-none touch-none rounded-lg overflow-hidden shadow-sm"
              style={{
                aspectRatio: `${BAG_PHOTO_ASPECT[color]}`,
                backgroundColor: "rgb(217, 215, 217)",
              }}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              <img
                src={isDark ? bolsaNegraPlana : bolsaBlancaPlana}
                alt={`Bolsa ${color.toLowerCase()} lisa, cara sin diseño`}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                draggable={false}
              />

              {/* Zona imprimible real de la bolsa (bajo el pliegue) — referencia visual para chequear
                  que calza con la foto */}
              <div
                className="absolute border border-dashed border-primary/30 pointer-events-none"
                style={{ left: body.x, top: body.y, width: body.w, height: body.h }}
              />

              {logoUrl && (
                <div
                  onPointerDown={onPointerDown}
                  className="absolute cursor-grab active:cursor-grabbing border-2 border-dashed border-primary/50"
                  style={{
                    left: center.x - logoSize.w / 2,
                    top: center.y - logoSize.h / 2,
                    width: logoSize.w,
                    height: logoSize.h,
                  }}
                >
                  <img
                    src={logoUrl}
                    alt="Logo del cliente"
                    className="w-full h-full object-contain pointer-events-none"
                    draggable={false}
                  />
                </div>
              )}

              {!logoUrl && (
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center text-sm pointer-events-none",
                    isDark ? "text-neutral-300" : "text-neutral-600",
                  )}
                >
                  <span className={cn("px-2 py-1 rounded", isDark ? "bg-black/40" : "bg-white/60")}>
                    Sube un logo para empezar
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 max-w-2xl mx-auto">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium block mb-2">Logo del cliente</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                className="text-sm file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-secondary file:text-secondary-foreground file:text-sm file:cursor-pointer cursor-pointer w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Solo para previsualizar acá (PNG/JPG/SVG). Para producción seguimos pidiendo el arte
                vectorizado (.AI/.PDF) como siempre.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Tamaño de bolsa</label>
              <div className="grid grid-cols-2 gap-2">
                {BAG_SIZES.map((s) => (
                  <Button
                    key={s.id}
                    type="button"
                    size="sm"
                    variant={s.id === sizeId ? "default" : "outline"}
                    onClick={() => setSizeId(s.id)}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Color de bolsa</label>
              <div className="grid grid-cols-2 gap-2">
                {(["Blanca", "Negra"] as Color[]).map((c) => (
                  <Button
                    key={c}
                    type="button"
                    size="sm"
                    variant={c === color ? "default" : "outline"}
                    onClick={() => setColor(c)}
                  >
                    {c}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Tamaño del logo</label>
                <span className="text-xs text-muted-foreground">
                  {widthCm.toFixed(1)} × {heightCm.toFixed(1)} cm
                </span>
              </div>
              <input
                type="range"
                min={MIN_CM}
                max={maxWidthCm}
                step={0.5}
                value={Math.min(widthCm, maxWidthCm)}
                onChange={(e) => setWidthCm(parseFloat(e.target.value))}
                disabled={!logoUrl}
                className={cn("w-full", !logoUrl && "opacity-50")}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tope: hasta A4 (21 × 29,7 cm), limitado también por el tamaño de esta bolsa.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Posición rápida</label>
              <div className="grid grid-cols-3 gap-2 w-32">
                {POSITION_PRESETS.map((p) => (
                  <Button
                    key={p.id}
                    type="button"
                    size="icon"
                    variant="outline"
                    disabled={!logoUrl}
                    onClick={() => setPos({ x: p.x, y: p.y })}
                    aria-label={p.id}
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                También se puede arrastrar el logo directamente sobre la bolsa. La franja de arriba es
                el pliegue de sellado, no es imprimible.
              </p>
            </div>
        </div>
      </div>
    </div>
  );
}
