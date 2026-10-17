import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEOHead from "@/components/SEOHead";
import { cn } from "@/lib/utils";
import { storefrontApiRequest } from "@/lib/shopify";
import {
  PERSONALIZADA_MIN_QTY,
  PERSONALIZADA_SIZES,
  personalizadaPrice,
} from "@/data/personalizadas";
import logo from "@/assets/logo-orbita-bags.svg";

type ProviderMode = "orbita" | "otro";

interface Item {
  id: string;
  desc: string;
  qty: number;
  price: number; // precio unitario, IVA incluido
  // Bolsa personalizada: el precio por bolsa depende del tramo de cantidad (100–199 / 200+).
  custom?: { sizeIdx: number; colors: number };
}

const ORBITA = {
  name: "Orbitabags SpA",
  giro: "Fabricación y venta de embalajes compostables",
};

const fmtCLP = (n: number) => "$" + Math.round(n).toLocaleString("es-CL");
// Precio unitario neto: puede tener decimales (ej. $990 IVA incl. → $831,93 neto).
const fmtCLPUnit = (n: number) =>
  "$" + n.toLocaleString("es-CL", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

// El SII exige las líneas en neto. El usuario ingresa el precio con IVA,
// así que cada fila se convierte a neto y el total se mantiene igual a lo pagado.
const unitNeto = (it: Item) => (it.price || 0) / 1.19;
const lineNeto = (it: Item) => Math.round(((it.qty || 0) * (it.price || 0)) / 1.19);
const todayISO = () => new Date().toISOString().slice(0, 10);

let itemSeq = 0;
const newItem = (): Item => ({ id: `item-${++itemSeq}`, desc: "", qty: 1, price: 0 });

// Catálogo de Orbita para autocompletar filas (precio de la tienda, IVA incluido).
interface CatalogOption {
  key: string;
  desc: string;
  price: number;
}

const CATALOG_QUERY = `
  query GetOCCatalog {
    products(first: 50, query: "product_type:'Bolsas Biodegradables'") {
      edges {
        node {
          title
          variants(first: 20) {
            edges { node { id title availableForSale price { amount } } }
          }
        }
      }
    }
  }
`;

type CatalogEdges = Array<{
  node: {
    title: string;
    variants: { edges: Array<{ node: { id: string; title: string; availableForSale: boolean; price: { amount: string } } }> };
  };
}>;

async function fetchCatalog(): Promise<CatalogOption[]> {
  const data = await storefrontApiRequest(CATALOG_QUERY);
  const edges = (data?.data?.products?.edges ?? []) as CatalogEdges;
  return edges
    .flatMap(({ node }) =>
      node.variants.edges
        .filter((v) => v.node.availableForSale)
        .map((v) => ({
          key: v.node.id,
          // "Blanca / 100 unidades" → "Bolsa Biodegradable 20x30 cm · Blanca · 100 unidades"
          desc: [node.title, ...v.node.title.split(" / ")].join(" · "),
          price: Math.round(parseFloat(v.node.price.amount)),
        })),
    )
    .sort((a, b) => a.desc.localeCompare(b.desc, "es", { numeric: true }));
}

// --- RUT chileno (módulo 11) ---
const cleanRut = (rut: string) => rut.replace(/[^0-9kK]/g, "").toUpperCase();
const rutDv = (body: string) => {
  let sum = 0;
  let mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const dv = 11 - (sum % 11);
  return dv === 11 ? "0" : dv === 10 ? "K" : String(dv);
};
const isValidRut = (rut: string) => {
  const c = cleanRut(rut);
  if (c.length < 8 || c.length > 9) return false;
  const body = c.slice(0, -1);
  return /^\d+$/.test(body) && rutDv(body) === c.slice(-1);
};
// "781682225" → "78.168.222-5"
const formatRut = (rut: string) => {
  const c = cleanRut(rut);
  if (c.length < 2) return rut;
  const body = c.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${body}-${c.slice(-1)}`;
};
const rutError = (rut: string) => {
  if (!rut.trim()) return "Falta el RUT";
  if (!isValidRut(rut)) return "RUT inválido: revisa los números y el dígito verificador";
  return undefined;
};

const PERSONALIZADA_OPTIONS = PERSONALIZADA_SIZES.flatMap((size, sizeIdx) =>
  [1, 2, 3, 4].map((colors) => ({
    key: `pers-${sizeIdx}-${colors}`,
    custom: { sizeIdx, colors },
    desc: `Bolsa personalizada ${size.replace(/ /g, "")} · logo ${colors} ${colors === 1 ? "color" : "colores"}`,
  })),
);

// Nombre de archivo seguro: sin tildes, sin símbolos raros.
const slugFile = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const FAQ: { q: string; a: string }[] = [
  {
    q: "¿Sirve solo para comprarle a Orbitabags?",
    a: "No. Puedes usarla para cualquier proveedor: deja seleccionado \"Orbitabags SpA\" si nos estás comprando a nosotros, o elige \"Otro proveedor\" y completa sus datos para generar la OC de cualquier compra de tu empresa.",
  },
  {
    q: "¿Quién tiene que completarla?",
    a: "La empresa que compra (el comprador), ya que es quien necesita el respaldo ante el SII. El proveedor solo aparece como destinatario del documento.",
  },
  {
    q: "¿El precio que ingreso en cada producto lleva IVA o no?",
    a: "Se ingresa el precio unitario CON IVA incluido, tal como te lo vendieron. En el PDF cada fila aparece en neto (sin IVA), como lo pide el SII, y abajo se suman el neto, el IVA (19%) y el total.",
  },
  {
    q: "¿Quién debe firmar?",
    a: "El representante legal de la empresa compradora, o quien esté autorizado a aprobar compras. La firma es manuscrita (con mouse o dedo) y queda embebida en el PDF como respaldo interno.",
  },
  {
    q: "¿Reemplaza a la factura o boleta?",
    a: "No. La OC es un respaldo previo que autoriza la compra; la factura o boleta la emite el proveedor después. Guarda ambos documentos juntos.",
  },
  {
    q: "¿Se guardan mis datos en algún lado?",
    a: "No. Todo se genera en tu navegador — nada se envía ni se almacena en un servidor. Si recargas la página, tienes que completarla de nuevo.",
  },
];

export default function GeneradorOC() {
  const [providerMode, setProviderMode] = useState<ProviderMode>("orbita");
  const [orbitaRut, setOrbitaRut] = useState("78.395.747-7");
  const [orbitaContacto, setOrbitaContacto] = useState("contacto@orbitabags.cl");
  const [otroNombre, setOtroNombre] = useState("");
  const [otroRut, setOtroRut] = useState("");
  const [otroGiro, setOtroGiro] = useState("");
  const [otroContacto, setOtroContacto] = useState("");

  const [ocNumber, setOcNumber] = useState("");
  const [ocDate, setOcDate] = useState(todayISO());

  const [buyerName, setBuyerName] = useState("");
  const [buyerRut, setBuyerRut] = useState("");
  const [buyerGiro, setBuyerGiro] = useState("");
  const [buyerAddr, setBuyerAddr] = useState("");
  const [buyerCity, setBuyerCity] = useState("");

  const [items, setItems] = useState<Item[]>([newItem()]);
  const [observaciones, setObservaciones] = useState("");

  const [signerName, setSignerName] = useState("");
  const [signerRole, setSignerRole] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);
  // Se activa al intentar descargar/imprimir: desde ahí se marcan los campos con error.
  const [showErrors, setShowErrors] = useState(false);
  // RUTs ya editados: su error se muestra al salir del campo, no mientras se escribe.
  const [rutTouched, setRutTouched] = useState({ buyer: false, otro: false });

  const provider =
    providerMode === "orbita"
      ? { name: ORBITA.name, giro: ORBITA.giro, rut: orbitaRut, contacto: orbitaContacto }
      : { name: otroNombre, giro: otroGiro, rut: otroRut, contacto: otroContacto };

  const totals = useMemo(() => {
    const totalConIva = Math.round(items.reduce((sum, it) => sum + (it.qty || 0) * (it.price || 0), 0));
    const neto = items.reduce((sum, it) => sum + lineNeto(it), 0);
    const iva = totalConIva - neto;
    return { neto, iva, total: totalConIva };
  }, [items]);

  const updateItem = (id: string, patch: Partial<Item>) =>
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const next = { ...it, ...patch };
        // Personalizada: al cambiar la cantidad se ajusta solo el precio al tramo que corresponde.
        if (next.custom && patch.qty !== undefined) {
          next.price = personalizadaPrice(next.custom.sizeIdx, next.custom.colors, next.qty || 0);
        }
        // Si edita el precio a mano, deja de recalcularse.
        if (patch.price !== undefined) delete next.custom;
        return next;
      }),
    );
  const removeItem = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id));
  const addItem = () => setItems((prev) => [...prev, newItem()]);

  const [catalog, setCatalog] = useState<CatalogOption[]>([]);
  useEffect(() => {
    fetchCatalog()
      .then(setCatalog)
      .catch((err) => console.error("No se pudo cargar el catálogo", err));
  }, []);
  // Agrega un producto del catálogo; si la única fila está vacía, la reutiliza.
  const addFromCatalog = (key: string) => {
    const opt = catalog.find((c) => c.key === key);
    const pers = PERSONALIZADA_OPTIONS.find((p) => p.key === key);
    let filled: Omit<Item, "id">;
    if (opt) filled = { desc: opt.desc, qty: 1, price: opt.price, custom: undefined };
    else if (pers)
      filled = {
        desc: pers.desc,
        qty: PERSONALIZADA_MIN_QTY,
        price: personalizadaPrice(pers.custom.sizeIdx, pers.custom.colors, PERSONALIZADA_MIN_QTY),
        custom: pers.custom,
      };
    else return;
    setItems((prev) => {
      const blank = prev.find((it) => !it.desc.trim() && !it.price);
      return blank
        ? prev.map((it) => (it.id === blank.id ? { ...it, ...filled } : it))
        : [...prev, { ...newItem(), ...filled }];
    });
  };

  // --- Firma ---
  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };
  const onSigDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const p = getPos(e);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1f2a24";
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    drawingRef.current = true;
  };
  const onSigMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    if (!hasSignature) setHasSignature(true);
  };
  const onSigUp = () => {
    drawingRef.current = false;
  };
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  // --- Validación antes de generar ---
  const errors = {
    buyerName: buyerName.trim() ? undefined : "Falta la razón social",
    buyerRut: rutError(buyerRut),
    otroRut: providerMode === "otro" ? rutError(otroRut) : undefined,
    items: items.some((it) => it.desc.trim() && it.qty > 0 && it.price > 0)
      ? undefined
      : "Agrega al menos un producto con descripción, cantidad y precio",
    customMin: items.some((it) => it.custom && it.qty < PERSONALIZADA_MIN_QTY)
      ? `Las bolsas personalizadas son desde ${PERSONALIZADA_MIN_QTY} unidades`
      : undefined,
    signerName: signerName.trim() ? undefined : "Falta el nombre de quien firma",
    signature: hasSignature ? undefined : "Falta la firma",
  };
  const errorList = Object.values(errors).filter(Boolean) as string[];
  const shown = (msg?: string) => (showErrors ? msg : undefined);

  const validateOrWarn = () => {
    setShowErrors(true);
    if (errorList.length === 0) return true;
    document.getElementById("oc-errores")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  };

  const handlePrint = () => {
    if (validateOrWarn()) window.print();
  };

  // --- PDF ---
  const handleDownload = async () => {
    if (!validateOrWarn()) return;
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const marginX = 48;
      let y = 56;

      const oc = ocNumber || "001";
      const date = ocDate || todayISO();

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(47, 93, 79);
      doc.text((provider.name || "PROVEEDOR").toUpperCase(), marginX, y);
      doc.setFontSize(20);
      doc.setTextColor(31, 42, 36);
      y += 22;
      doc.text("Orden de Compra", marginX, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`N° OC: ${oc}`, 400, y - 22);
      doc.text(`Fecha: ${date}`, 400, y - 6);

      y += 26;
      doc.setDrawColor(216, 210, 196);
      doc.line(marginX, y, 547, y);
      y += 20;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(194, 106, 63);
      doc.text("PROVEEDOR", marginX, y);
      y += 14;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(31, 42, 36);
      doc.setFontSize(10);
      doc.text(provider.name || "—", marginX, y);
      y += 13;
      doc.text(`RUT: ${provider.rut || "—"}`, marginX, y);
      y += 13;
      doc.text(`Giro: ${provider.giro || "—"}`, marginX, y);
      y += 13;
      doc.text(`Contacto: ${provider.contacto || "—"}`, marginX, y);
      y += 24;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(194, 106, 63);
      doc.text("COMPRADOR", marginX, y);
      y += 14;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(31, 42, 36);
      doc.setFontSize(10);
      doc.text(`Razón social: ${buyerName || "—"}`, marginX, y);
      y += 13;
      doc.text(`RUT: ${buyerRut || "—"}`, marginX, y);
      y += 13;
      doc.text(`Giro: ${buyerGiro || "—"}`, marginX, y);
      y += 13;
      doc.text(`Dirección: ${buyerAddr || "—"}, ${buyerCity || "—"}`, marginX, y);
      y += 26;

      doc.line(marginX, y, 547, y);
      y += 18;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(122, 115, 104);
      doc.text("DESCRIPCIÓN", marginX, y);
      doc.text("CANT.", 330, y);
      doc.text("P. UNIT. NETO", 380, y);
      doc.text("SUBTOTAL", 480, y);
      y += 6;
      doc.setDrawColor(31, 42, 36);
      doc.line(marginX, y, 547, y);
      y += 16;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(31, 42, 36);

      items.forEach((it) => {
        const descLines = doc.splitTextToSize(it.desc || "—", 250);
        doc.text(descLines, marginX, y);
        doc.text(String(it.qty || 0), 330, y);
        doc.text(fmtCLPUnit(unitNeto(it)), 380, y);
        doc.text(fmtCLP(lineNeto(it)), 480, y);
        y += Math.max(14, descLines.length * 13);
        if (y > 720) {
          doc.addPage();
          y = 56;
        }
      });

      y += 10;
      doc.line(360, y, 547, y);
      y += 16;

      doc.setFontSize(10);
      doc.text("Neto", 390, y);
      doc.text(fmtCLP(totals.neto), 470, y);
      y += 15;
      doc.text("IVA (19%)", 390, y);
      doc.text(fmtCLP(totals.iva), 470, y);
      y += 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Total", 390, y);
      doc.text(fmtCLP(totals.total), 470, y);
      y += 30;

      if (observaciones.trim()) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(194, 106, 63);
        doc.text("OBSERVACIONES", marginX, y);
        y += 14;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(31, 42, 36);
        const obsLines = doc.splitTextToSize(observaciones, 499);
        doc.text(obsLines, marginX, y);
        y += obsLines.length * 13;
      }

      y += 30;
      if (y > 680) {
        doc.addPage();
        y = 56;
      }

      const canvas = canvasRef.current;
      if (hasSignature && canvas) {
        doc.addImage(canvas.toDataURL("image/png"), "PNG", marginX, y, 170, 51);
        y += 55;
      } else {
        y += 40;
      }
      doc.setDrawColor(31, 42, 36);
      doc.line(marginX, y, marginX + 220, y);
      y += 14;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(31, 42, 36);
      doc.text(signerName || "—", marginX, y);
      y += 13;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(122, 115, 104);
      doc.text(signerRole || "Representante legal", marginX, y);

      // Crédito discreto — visible sobre todo cuando el proveedor no es Orbitabags.
      doc.setFontSize(8);
      doc.setTextColor(160, 155, 145);
      doc.text("Generado con la herramienta gratuita de Orbitabags SpA · orbitabags.cl", marginX, 806);

      const fileName = `OC_${slugFile(oc) || "sin-numero"}_${slugFile(buyerName) || "orden-compra"}.pdf`;

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      // En celular, compartir un File con nombre evita que llegue como "Unknown.pdf" (ej. por WhatsApp).
      const file = new File([doc.output("blob")], fileName, { type: "application/pdf" });
      if (isMobile && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: fileName });
        } catch (err) {
          if ((err as Error).name !== "AbortError") throw err;
        }
      } else if (isMobile) {
        const win = window.open(doc.output("bloburl") as unknown as string, "_blank");
        if (!win) {
          alert(
            'El navegador bloqueó la ventana emergente. Habilita ventanas emergentes para este sitio, o usa el botón "Imprimir" y elige "Guardar como PDF".',
          );
        }
      } else {
        doc.save(fileName);
      }
    } catch (err) {
      console.error(err);
      alert(
        `Ocurrió un error al generar el PDF: ${(err as Error).message}\n\nPuedes usar el botón "Imprimir" y guardar como PDF desde ahí como alternativa.`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 print:py-0 print:px-0">
      <SEOHead
        title="Generador de Orden de Compra (OC) gratis | Orbita Bags"
        description="Genera tu Orden de Compra en PDF gratis: sirve para cualquier proveedor, no solo para comprarle a Orbita Bags. Completa los datos, firma y descarga — listo para tu contabilidad y el SII."
        path="/herramientas/generador-oc"
      />
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <img src={logo} alt="Orbitabags" className="h-6 w-6" />
            Orbitabags SpA
          </Link>
          <span className="text-xs text-muted-foreground">Herramienta gratuita para tus clientes</span>
        </div>

        <header className="flex items-end justify-between gap-4 flex-wrap border-b-2 border-foreground pb-4 mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-forest font-bold">Generador gratuito</p>
            <h1 className="font-display text-3xl font-semibold -mt-0.5">Orden de Compra</h1>
          </div>
          <div className="text-right">
            <Label htmlFor="ocNumber" className="text-[11px] text-muted-foreground uppercase tracking-wide">
              N° de tu OC (correlativo interno)
            </Label>
            <Input
              id="ocNumber"
              value={ocNumber}
              onChange={(e) => setOcNumber(e.target.value)}
              placeholder="Ej: 0245"
              className="w-32 text-right font-display text-base mt-1"
            />
            <p className="text-[11px] text-muted-foreground mt-1">Lo asigna tu propia empresa</p>
          </div>
        </header>

        <section className="mb-10 print:hidden bg-muted/30 border border-border rounded-md px-4 py-4 sm:px-5 sm:py-5">
          <p className="text-sm font-medium mb-1.5">¿Qué es una Orden de Compra?</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Es el documento con el que tu empresa autoriza formalmente una compra a un proveedor: qué se compra, a
            quién, en qué cantidad y por qué monto. El SII lo pide como respaldo cuando registras esa compra como
            gasto o costo del negocio — sin OC, la factura o boleta queda "sin sustento" ante una fiscalización.
            Complétala, agrega la firma de quien autoriza y descárgala en PDF para guardarla junto con el
            comprobante de pago.
          </p>
        </section>

        <section className="mb-6">
          <SectionTitle>Proveedor</SectionTitle>

          <div className="inline-flex rounded-md border border-input p-1 gap-1 mb-4 print:hidden">
            <button
              type="button"
              onClick={() => setProviderMode("orbita")}
              className={cn(
                "px-3 py-1.5 rounded text-sm font-medium transition-colors",
                providerMode === "orbita" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              Orbitabags SpA <span className="opacity-70 text-xs">(recomendado)</span>
            </button>
            <button
              type="button"
              onClick={() => setProviderMode("otro")}
              className={cn(
                "px-3 py-1.5 rounded text-sm font-medium transition-colors",
                providerMode === "otro" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              Otro proveedor
            </button>
          </div>

          {providerMode === "orbita" ? (
            <div className="bg-muted/40 border border-border rounded-md px-4 py-3 text-sm leading-relaxed">
              <strong className="block font-display text-base mb-1">{ORBITA.name}</strong>
              <p>
                RUT:{" "}
                <input
                  value={orbitaRut}
                  onChange={(e) => setOrbitaRut(e.target.value)}
                  className="bg-transparent border-b border-dotted border-muted-foreground focus:outline-none focus:border-foreground"
                  style={{ width: `${Math.max(orbitaRut.length, 6)}ch` }}
                />
              </p>
              <p>Giro: {ORBITA.giro}</p>
              <p>
                Contacto:{" "}
                <input
                  value={orbitaContacto}
                  onChange={(e) => setOrbitaContacto(e.target.value)}
                  className="bg-transparent border-b border-dotted border-muted-foreground focus:outline-none focus:border-foreground"
                  style={{ width: `${Math.max(orbitaContacto.length, 6)}ch` }}
                />
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Razón social" value={otroNombre} onChange={setOtroNombre} placeholder="Nombre del proveedor" />
              <Field
                label="RUT"
                value={otroRut}
                onChange={setOtroRut}
                onBlur={() => {
                  setOtroRut(formatRut(otroRut));
                  setRutTouched((t) => ({ ...t, otro: true }));
                }}
                placeholder="XX.XXX.XXX-X"
                error={rutTouched.otro && otroRut.trim() ? errors.otroRut : shown(errors.otroRut)}
              />
              <Field label="Giro" value={otroGiro} onChange={setOtroGiro} placeholder="Giro comercial" />
              <Field label="Contacto" value={otroContacto} onChange={setOtroContacto} placeholder="Email o teléfono" />
            </div>
          )}
        </section>

        <section className="mb-6">
          <SectionTitle>Datos del comprador</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="Razón social"
              value={buyerName}
              onChange={setBuyerName}
              placeholder="Nombre de tu empresa"
              error={shown(errors.buyerName)}
            />
            <Field
              label="RUT"
              value={buyerRut}
              onChange={setBuyerRut}
              onBlur={() => {
                setBuyerRut(formatRut(buyerRut));
                setRutTouched((t) => ({ ...t, buyer: true }));
              }}
              placeholder="XX.XXX.XXX-X"
              error={rutTouched.buyer && buyerRut.trim() ? errors.buyerRut : shown(errors.buyerRut)}
            />
            <Field label="Giro" value={buyerGiro} onChange={setBuyerGiro} placeholder="Giro comercial" />
            <Field label="Dirección" value={buyerAddr} onChange={setBuyerAddr} placeholder="Dirección de facturación" />
            <Field label="Ciudad" value={buyerCity} onChange={setBuyerCity} placeholder="Ciudad" />
            <div>
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wide">Fecha</Label>
              <Input type="date" value={ocDate} onChange={(e) => setOcDate(e.target.value)} className="mt-1" />
            </div>
          </div>
        </section>

        <section className="mb-6">
          <SectionTitle>Detalle del pedido</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[560px]">
              <thead>
                <tr>
                  <th className="text-left text-[10px] uppercase tracking-wide text-muted-foreground border-b border-foreground pb-1.5 w-[42%]">
                    Descripción
                  </th>
                  <th className="text-left text-[10px] uppercase tracking-wide text-muted-foreground border-b border-foreground pb-1.5 w-[13%]">
                    Cant.
                  </th>
                  <th className="text-left text-[10px] uppercase tracking-wide text-muted-foreground border-b border-foreground pb-1.5 w-[20%]">
                    Precio unit. (IVA incl.)
                  </th>
                  <th className="text-right text-[10px] uppercase tracking-wide text-muted-foreground border-b border-foreground pb-1.5 w-[18%]">
                    Subtotal neto
                  </th>
                  <th className="w-[7%] border-b border-foreground pb-1.5 print:hidden" />
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td className="py-1.5 pr-2 align-top">
                      <Input
                        value={it.desc}
                        onChange={(e) => updateItem(it.id, { desc: e.target.value })}
                        placeholder="Ej: Bolsa courier mediana 30x40cm"
                      />
                    </td>
                    <td className="py-1.5 pr-2 align-top">
                      <Input
                        type="number"
                        min={1}
                        value={it.qty}
                        onChange={(e) => updateItem(it.id, { qty: parseFloat(e.target.value) || 0 })}
                      />
                    </td>
                    <td className="py-1.5 pr-2 align-top">
                      <Input
                        type="number"
                        min={0}
                        value={it.price || ""}
                        onChange={(e) => updateItem(it.id, { price: parseFloat(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </td>
                    <td className="py-1.5 pt-4 text-sm text-right align-top">
                      {fmtCLP(lineNeto(it))}
                      {it.price > 0 && (
                        <div className="text-[11px] text-muted-foreground">{fmtCLPUnit(unitNeto(it))} neto c/u</div>
                      )}
                      {it.custom && (
                        <div className="text-[11px] text-muted-foreground">
                          {it.qty >= 200 ? "Precio 200+ uds" : "Precio 100–199 uds"}
                        </div>
                      )}
                    </td>
                    <td className="py-1.5 pt-3 text-center align-top print:hidden">
                      <button
                        type="button"
                        onClick={() => removeItem(it.id)}
                        className="text-destructive hover:opacity-70 p-1"
                        aria-label="Eliminar fila"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 print:hidden">
            {providerMode === "orbita" && (
              <select
                value=""
                onChange={(e) => addFromCatalog(e.target.value)}
                aria-label="Agregar producto de Orbitabags"
                className="h-9 rounded-md border border-primary bg-background px-3 text-sm font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="" disabled>
                  + Elegir producto de Orbitabags
                </option>
                {catalog.length > 0 && (
                  <optgroup label="Bolsas compostables (pack)">
                    {catalog.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.desc} — {fmtCLP(c.price)}
                      </option>
                    ))}
                  </optgroup>
                )}
                <optgroup label="Bolsas personalizadas con logo (precio por bolsa)">
                  {PERSONALIZADA_OPTIONS.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.desc} — desde {fmtCLP(personalizadaPrice(p.custom.sizeIdx, p.custom.colors, 200))} c/u
                    </option>
                  ))}
                </optgroup>
              </select>
            )}
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              + Agregar producto manual
            </Button>
          </div>

          <div className="mt-4 ml-auto w-full sm:w-64 space-y-1">
            <div className="flex justify-between text-sm border-b border-border py-1.5">
              <span>Neto</span>
              <span>{fmtCLP(totals.neto)}</span>
            </div>
            <div className="flex justify-between text-sm border-b border-border py-1.5">
              <span>IVA (19%)</span>
              <span>{fmtCLP(totals.iva)}</span>
            </div>
            <div className="flex justify-between font-display text-lg font-semibold pt-2">
              <span>Total</span>
              <span>{fmtCLP(totals.total)}</span>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <SectionTitle>Observaciones</SectionTitle>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows={3}
            placeholder="Condiciones de pago, dirección de despacho, referencias, etc."
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </section>

        <section className="mb-8">
          <SectionTitle>Firma del representante legal</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-4 mb-3">
            <Field
              label="Nombre completo"
              value={signerName}
              onChange={setSignerName}
              placeholder="Nombre del representante legal"
              error={shown(errors.signerName)}
            />
            <Field
              label="Cargo"
              value={signerRole}
              onChange={setSignerRole}
              placeholder="Ej: Representante legal / Gerente general"
            />
          </div>
          <Label className="text-[11px] text-muted-foreground uppercase tracking-wide">Firma</Label>
          <canvas
            ref={canvasRef}
            width={500}
            height={150}
            onPointerDown={onSigDown}
            onPointerMove={onSigMove}
            onPointerUp={onSigUp}
            className={cn(
              "w-full max-w-[500px] h-[150px] border bg-white rounded-sm mt-1 touch-none",
              shown(errors.signature) ? "border-destructive border-2" : "border-border",
            )}
          />
          {shown(errors.signature) && (
            <p className="text-xs text-destructive mt-1">Falta la firma: firma dentro del recuadro antes de descargar.</p>
          )}
          <div className="mt-2 flex items-center gap-3 print:hidden">
            <Button type="button" variant="outline" size="sm" onClick={clearSignature}>
              Borrar firma
            </Button>
            <span className="text-xs text-muted-foreground">Firma con el mouse o el dedo dentro del recuadro.</span>
          </div>
        </section>

        {showErrors && errorList.length > 0 && (
          <div
            id="oc-errores"
            role="alert"
            className="mb-4 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm print:hidden"
          >
            <p className="font-semibold text-destructive mb-1">Antes de descargar, completa lo siguiente:</p>
            <ul className="list-disc pl-5 space-y-0.5 text-foreground">
              {errorList.map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3 flex-wrap mb-10 print:hidden">
          <Button type="button" onClick={handleDownload}>
            Descargar PDF
          </Button>
          <Button type="button" variant="outline" onClick={handlePrint}>
            Imprimir
          </Button>
        </div>

        <section className="mb-10 print:hidden">
          <SectionTitle>Preguntas frecuentes</SectionTitle>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group bg-card rounded-2xl border border-border hover:border-primary/30 transition-colors"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-sm sm:text-base font-display font-bold text-foreground">{item.q}</h3>
                  <span
                    className="shrink-0 w-7 h-7 rounded-full bg-secondary/50 flex items-center justify-center text-primary transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="px-4 pb-4 sm:px-5 sm:pb-5 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="border-t border-border pt-4 text-center text-xs text-muted-foreground print:hidden">
          Documento generado para respaldar la compra ante el SII.
          <br />
          Herramienta gratuita de{" "}
          <Link to="/" className="underline hover:text-foreground">
            Orbitabags SpA
          </Link>{" "}
          — ¿vendes bolsas courier compostables? Conócenos.
        </footer>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[11px] uppercase tracking-wide text-foreground/70 font-bold">{children}</span>
      <span className="flex-1 h-px bg-border" />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <Label className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={cn("mt-1", error && "border-destructive focus-visible:ring-destructive")}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
