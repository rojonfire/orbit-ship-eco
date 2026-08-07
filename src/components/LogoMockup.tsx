import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import bolsaBlancaPlana from "@/assets/bolsa-blanca-plana.webp";
import bolsaNegraPlana from "@/assets/bolsa-negra-plana.webp";

type Color = "Blanca" | "Negra";

// Mismos parámetros reales que /herramientas/mockup-logo (ver ese archivo para el detalle de
// cómo se midieron). Se mantienen acá duplicados a propósito: son solo 3 constantes y evita
// acoplar la herramienta interna de pruebas con el flujo real de compra.
const MAX_PRINT_CM = { w: 21, h: 29.7 };
const MIN_CM = 1;
const FLAP_PCT = 6;
const BAG_BBOX_PCT = { x: 23, y: 16.4, w: 54.5, h: 73.4 };

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

export interface LogoMockupState {
  file: File;
  widthCm: number;
  heightCm: number;
  pos: { x: number; y: number };
}

export interface LogoMockupHandle {
  /** Renderiza la bolsa + logo posicionados en un PNG, para mandarlo como "maqueta" a producción. */
  captureSnapshot: () => Promise<Blob | null>;
}

interface LogoMockupProps {
  bagCm: { w: number; h: number };
  color: Color;
  onStateChange: (state: LogoMockupState | null) => void;
}

const LogoMockup = forwardRef<LogoMockupHandle, LogoMockupProps>(({ bagCm, color, onStateChange }, ref) => {
  const [file, setFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [aspect, setAspect] = useState(1);
  const [widthCm, setWidthCm] = useState(15);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });

  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ offsetX: number; offsetY: number } | null>(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

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

  const maxWidthCmFor = (bagW: number, bagH: number, a: number) =>
    Math.min(MAX_PRINT_CM.w, MAX_PRINT_CM.h / a, bagW * 0.9, (bagH * (1 - FLAP_PCT / 100) * 0.85) / a);

  const handleFile = (f: File | null) => {
    if (!f) return;
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      const a = img.naturalHeight / img.naturalWidth || 1;
      setAspect(a);
      const maxW = maxWidthCmFor(bagCm.w, bagCm.h, a);
      setWidthCm(Math.min(maxW, Math.max(MIN_CM, maxW * 0.7)));
      setPos({ x: 0.5, y: 0.5 });
    };
    img.src = url;
    setFile(f);
    setLogoUrl(url);
  };

  const maxWidthCm = maxWidthCmFor(bagCm.w, bagCm.h, aspect);
  const heightCm = widthCm * aspect;

  const getBagBboxPx = () => ({
    x: (BAG_BBOX_PCT.x / 100) * containerSize.w,
    y: (BAG_BBOX_PCT.y / 100) * containerSize.h,
    w: (BAG_BBOX_PCT.w / 100) * containerSize.w,
    h: (BAG_BBOX_PCT.h / 100) * containerSize.h,
  });

  const scalePxPerCm = () => getBagBboxPx().w / bagCm.w;

  const logoPxSize = () => {
    const scale = scalePxPerCm();
    return { w: widthCm * scale, h: heightCm * scale };
  };

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
    dragState.current = { offsetX: e.clientX - rect.left - c.x, offsetY: e.clientY - rect.top - c.y };
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

  useEffect(() => {
    if (!file) {
      onStateChange(null);
      return;
    }
    onStateChange({ file, widthCm, heightCm, pos });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, widthCm, heightCm, pos.x, pos.y]);

  useImperativeHandle(ref, () => ({
    captureSnapshot: async () => {
      if (!logoUrl || !containerSize.w) return null;
      const canvas = document.createElement("canvas");
      canvas.width = containerSize.w;
      canvas.height = containerSize.h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const bagImg = new Image();
      bagImg.src = color === "Negra" ? bolsaNegraPlana : bolsaBlancaPlana;
      await new Promise((resolve) => {
        bagImg.onload = resolve;
      });
      ctx.drawImage(bagImg, 0, 0, canvas.width, canvas.height);

      const logoImg = new Image();
      logoImg.src = logoUrl;
      await new Promise((resolve) => {
        logoImg.onload = resolve;
      });
      const { w: logoW, h: logoH } = logoPxSize();
      const c = centerPx();
      ctx.drawImage(logoImg, c.x - logoW / 2, c.y - logoH / 2, logoW, logoH);

      return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/png"));
    },
  }));

  const logoSize = logoPxSize();
  const center = centerPx();
  const body = getBodyPx();
  const isDark = color === "Negra";

  return (
    <div>
      <div>
        <label className="text-sm font-medium block mb-2">Tu logo</label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,application/pdf,.ai"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          className="text-sm file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-secondary file:text-secondary-foreground file:text-sm file:cursor-pointer cursor-pointer w-full"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Si subes tu arte ya vectorizado (.AI/.PDF con textos trazados), producimos más rápido. Si
          subes una imagen (PNG/JPG), nosotros la vectorizamos por ti — te avisaremos cuando esté
          listo, solo toma un poco más de tiempo.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full select-none touch-none rounded-lg overflow-hidden shadow-sm mt-4"
        style={{ aspectRatio: "1 / 1", backgroundColor: "rgb(217, 215, 217)" }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <img
          src={isDark ? bolsaNegraPlana : bolsaBlancaPlana}
          alt={`Bolsa ${color.toLowerCase()} lisa, lado para tu logo`}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          draggable={false}
        />

        <div
          className="absolute border border-dashed border-primary/30 pointer-events-none"
          style={{ left: body.x, top: body.y, width: body.w, height: body.h }}
        />

        {logoUrl && (
          <div
            onPointerDown={onPointerDown}
            className="absolute cursor-grab active:cursor-grabbing border-2 border-dashed border-primary/50"
            style={{ left: center.x - logoSize.w / 2, top: center.y - logoSize.h / 2, width: logoSize.w, height: logoSize.h }}
          >
            <img src={logoUrl} alt="Tu logo" className="w-full h-full object-contain pointer-events-none" draggable={false} />
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
              Sube tu logo para verlo aquí
            </span>
          </div>
        )}
      </div>

      {logoUrl && (
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 mt-4">
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
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Posición</label>
            <div className="grid grid-cols-3 gap-1 w-28">
              {POSITION_PRESETS.map((p) => (
                <Button
                  key={p.id}
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => setPos({ x: p.x, y: p.y })}
                  aria-label={p.id}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

LogoMockup.displayName = "LogoMockup";

export default LogoMockup;
