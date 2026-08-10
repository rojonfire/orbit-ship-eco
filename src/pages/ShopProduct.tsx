import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Loader2, Leaf, Recycle, Package, MessageCircle, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import {
  fetchProductByHandle,
  fetchPersonalizadaBundles,
  fetchRetailPackBundles,
  ShopifyProduct,
  PersonalizadaBundle,
  PersonalizadaTramo,
  RetailPackBundle,
  formatCLP,
} from "@/lib/shopify";
import { uploadToCloudinary } from "@/lib/cloudinary";
import NotifyMeModal from "@/components/NotifyMeModal";
import LogoMockup, { LogoMockupHandle, LogoMockupState } from "@/components/LogoMockup";
import { useCartStore } from "@/stores/cartStore";
import bolsasTamanos from "@/assets/bolsas-tamanos.webp";
import { SIZE_MEDIA } from "@/data/sizeMedia";

const POSITION_LABELS: Record<string, string> = {
  "0,0": "Arriba izquierda",
  "0.5,0": "Arriba centro",
  "1,0": "Arriba derecha",
  "0,0.5": "Centro izquierda",
  "0.5,0.5": "Centro",
  "1,0.5": "Centro derecha",
  "0,1": "Abajo izquierda",
  "0.5,1": "Abajo centro",
  "1,1": "Abajo derecha",
};

const getPositionLabel = (pos: { x: number; y: number }) => {
  const key = `${pos.x},${pos.y}`;
  return POSITION_LABELS[key] ?? `Personalizada (${Math.round(pos.x * 100)}%, ${Math.round(pos.y * 100)}%)`;
};

const ShopProduct = () => {
  const { handle } = useParams<{ handle: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const colorParam = searchParams.get("color");
  const tipoParam = searchParams.get("tipo");
  const coloresParam = Number(searchParams.get("colores"));
  const cantidadParam = Number(searchParams.get("cantidad"));
  const packParam = Number(searchParams.get("pack"));
  const packQtyParam = Number(searchParams.get("packQty"));
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedPack, setSelectedPack] = useState<string>("");
  const [wantsCustom, setWantsCustom] = useState(tipoParam === "personalizada");
  const [mediaIndex, setMediaIndex] = useState(0);

  // Bolsas personalizadas: cada tamaño tiene 8 bundles (2 tramos de cantidad x 4 N° de colores)
  const [personalizadaBundles, setPersonalizadaBundles] = useState<PersonalizadaBundle[] | null>(null);
  const [loadingBundles, setLoadingBundles] = useState(false);
  const [nColores, setNColores] = useState(
    coloresParam >= 1 && coloresParam <= 4 ? coloresParam : 1
  );
  const [cantidad, setCantidad] = useState(
    cantidadParam >= 100 && cantidadParam % 100 === 0 ? cantidadParam : 100
  );
  const [logoState, setLogoState] = useState<LogoMockupState | null>(null);
  const [colorAck, setColorAck] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const mockupRef = useRef<LogoMockupHandle>(null);

  const sizeLabel = handle?.match(/(\d+x\d+)/)?.[1];

  useEffect(() => {
    if (!wantsCustom || !sizeLabel || personalizadaBundles) return;
    setLoadingBundles(true);
    fetchPersonalizadaBundles(sizeLabel)
      .then(setPersonalizadaBundles)
      .finally(() => setLoadingBundles(false));
  }, [wantsCustom, sizeLabel, personalizadaBundles]);

  // Packs con descuento (300/500/1000) para la compra normal — el pack de 100 sigue viniendo
  // del producto real.
  const [retailPackBundles, setRetailPackBundles] = useState<RetailPackBundle[] | null>(null);
  const [selectedPackUnits, setSelectedPackUnits] = useState(
    [100, 300, 500, 1000].includes(packParam) ? packParam : 100
  );
  const [packQuantity, setPackQuantity] = useState(packQtyParam >= 1 ? packQtyParam : 1);

  useEffect(() => {
    if (!sizeLabel || retailPackBundles) return;
    fetchRetailPackBundles(sizeLabel).then(setRetailPackBundles);
  }, [sizeLabel, retailPackBundles]);
  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      try {
        const data = await fetchProductByHandle(handle);
        setProduct(data);
        if (data?.node.options) {
          const colorOption = data.node.options.find(o => o.name === "Color");
          const packOption = data.node.options.find(o => o.name === "Pack");
          const initialColor =
            colorParam && colorOption?.values.includes(colorParam)
              ? colorParam
              : colorOption?.values[0];
          if (initialColor) setSelectedColor(initialColor);
          if (packOption?.values[0]) setSelectedPack(packOption.values[0]);
        }
        if (data && typeof (window as any).fbq === "function") {
          const colorOpt = data.node.options.find(o => o.name === "Color");
          const packOpt = data.node.options.find(o => o.name === "Pack");
          (window as any).fbq("track", "ViewContent", {
            content_name: data.node.title,
            content_type: "product",
            content_ids: [data.node.id],
            value: parseFloat(data.node.priceRange.minVariantPrice.amount),
            currency: "CLP",
            contents: [{
              id: data.node.id,
              quantity: packOpt?.values[0] || "1",
              color: colorOpt?.values[0] || "",
              custom: false,
            }],
          });
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [handle]);

  // Track selection changes
  useEffect(() => {
    if (!product || !selectedColor) return;
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("trackCustom", "ProductOptionSelected", {
        content_name: product.node.title,
        color: selectedColor,
        pack: selectedPack,
        personalizada: wantsCustom ? "Sí" : "No",
      });
    }
  }, [selectedColor, selectedPack, wantsCustom]);

  // Mantiene la URL sincronizada con la selección actual para que el link se pueda compartir
  // con todos los campos preseleccionados (no solo el color).
  useEffect(() => {
    if (!product || !selectedColor) return;
    const params = new URLSearchParams();
    params.set("color", selectedColor);
    if (wantsCustom) {
      params.set("tipo", "personalizada");
      params.set("colores", String(nColores));
      params.set("cantidad", String(cantidad));
    } else {
      params.set("pack", String(selectedPackUnits));
      if (packQuantity > 1) params.set("packQty", String(packQuantity));
    }
    setSearchParams(params, { replace: true });
  }, [product, selectedColor, wantsCustom, nColores, cantidad, selectedPackUnits, packQuantity, setSearchParams]);

  const getSelectedVariant = () => {
    if (!product) return null;
    return product.node.variants.edges.find(v => {
      const hasColor = v.node.selectedOptions.some(o => o.name === "Color" && o.value === selectedColor);
      const hasPack = v.node.selectedOptions.some(o => o.name === "Pack" && o.value === selectedPack);
      return hasColor && hasPack;
    })?.node;
  };

  const baseVariant = getSelectedVariant();

  // Combina el pack real de 100 unidades con los packs-bundle de 300/500/1000 en un solo
  // "variant" con la misma forma, para no duplicar la lógica de precio/carrito de más abajo.
  const activePackVariant = (() => {
    if (selectedPackUnits === 100) return baseVariant;
    const bundle = retailPackBundles?.find((b) => b.units === selectedPackUnits);
    const v = bundle?.variants.find((vv) => vv.color === selectedColor);
    if (!v) return null;
    return {
      id: v.id,
      title: `${selectedColor} / ${selectedPackUnits} unidades`,
      price: { amount: v.price, currencyCode: "CLP" },
      availableForSale: v.availableForSale,
      selectedOptions: [
        { name: "Color", value: selectedColor },
        { name: "Pack", value: `${selectedPackUnits} unidades` },
      ],
    };
  })();

  const handleWhatsAppCustom = () => {
    const message = `¡Hola! Me interesa saber más sobre las bolsas personalizadas. ¿Podrían darme más información?`;
    window.open(`https://wa.me/56931726288?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center pt-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-32 text-center">
          <h1 className="text-2xl font-bold">Producto no encontrado</h1>
          <Link to="/tienda" className="text-primary hover:underline mt-4 inline-block">
            Volver a la tienda
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const colorOptions = product.node.options.find(o => o.name === "Color")?.values || [];
  const packOptions = product.node.options.find(o => o.name === "Pack")?.values || [];
  const images = product.node.images.edges;

  // Bolsas personalizadas: de qué tramo de precio se trata según la cantidad (siempre múltiplos
  // de 100, un pack real = 100 unidades), y cuál de los 8 bundles de este tamaño corresponde.
  const tramoForQuantity = (q: number): PersonalizadaTramo =>
    q <= 100 ? "100" :
    q < 300 ? "200+" :
    q < 500 ? "300+" :
    q < 1000 ? "500+" : "1000+";
  const tramo = tramoForQuantity(cantidad);
  const matchingBundle = personalizadaBundles?.find(b => b.tramo === tramo && b.nColores === nColores) ?? null;
  const matchingVariant = matchingBundle?.variants.find(v => v.color === selectedColor) ?? null;
  const packs = cantidad / 100;
  const personalizadaTotal = matchingVariant ? parseFloat(matchingVariant.price) * packs : null;
  const pricePerBag = matchingVariant ? parseFloat(matchingVariant.price) / 100 : null;

  // Precio de referencia (100 uds, sin descuento por volumen) para mostrar tachado en los
  // botones de cantidad — así el ahorro se ve de entrada, sin tener que llegar al tramo.
  const base100Bundle = personalizadaBundles?.find(b => b.tramo === "100" && b.nColores === nColores) ?? null;
  const base100Variant = base100Bundle?.variants.find(v => v.color === selectedColor) ?? null;
  const base100PerBag = base100Variant ? parseFloat(base100Variant.price) / 100 : null;

  const QUANTITY_TIERS = [100, 200, 300, 500, 1000];
  const quantityTierOptions = QUANTITY_TIERS.map((tierQty) => {
    const tierTramo = tramoForQuantity(tierQty);
    const bundle = personalizadaBundles?.find(b => b.tramo === tierTramo && b.nColores === nColores) ?? null;
    const variant = bundle?.variants.find(v => v.color === selectedColor) ?? null;
    const pricePerBagForTier = variant ? parseFloat(variant.price) / 100 : null;
    const hasDiscount = tierQty !== 100 && pricePerBagForTier !== null && base100PerBag !== null && pricePerBagForTier < base100PerBag;
    return { tierQty, pricePerBagForTier, hasDiscount, available: variant !== null };
  });
  const [bagCmW, bagCmH] = (sizeLabel?.split("x").map(Number) ?? [30, 40]) as [number, number];

  const handleAddPersonalizadaToCart = async () => {
    if (!matchingVariant || !logoState) return;
    setAddingToCart(true);
    try {
      const logoUrl = await uploadToCloudinary(logoState.file, "personalizadas/logos");
      let mockupUrl: string | null = null;
      try {
        const snapshotBlob = await mockupRef.current?.captureSnapshot();
        if (snapshotBlob) {
          mockupUrl = await uploadToCloudinary(snapshotBlob, "personalizadas/maquetas");
        }
      } catch (snapshotError) {
        console.error("No se pudo generar la maqueta:", snapshotError);
      }

      const displayProduct: ShopifyProduct = {
        node: {
          ...product.node,
          title: `${product.node.title} — Personalizada`,
        },
      };

      useCartStore.getState().addItem({
        product: displayProduct,
        variantId: matchingVariant.id,
        variantTitle: `Personalizada — ${selectedColor}, ${nColores} color${nColores > 1 ? "es" : ""}`,
        price: { amount: matchingVariant.price, currencyCode: "CLP" },
        quantity: packs,
        selectedOptions: [
          { name: "Color", value: selectedColor },
          { name: "N° de colores", value: String(nColores) },
        ],
        lineAttributes: [
          { key: "Tipo", value: "Personalizada" },
          { key: "Cantidad", value: `${cantidad} unidades` },
          { key: "N° de colores", value: String(nColores) },
          { key: "Logo (archivo original)", value: logoUrl },
          ...(mockupUrl ? [{ key: "Maqueta (vista previa posicionada)", value: mockupUrl }] : []),
          { key: "Tamaño del logo", value: `${logoState.widthCm.toFixed(1)} x ${logoState.heightCm.toFixed(1)} cm` },
          { key: "Posición del logo", value: getPositionLabel(logoState.pos) },
        ],
      });

      toast.success("Bolsa personalizada agregada al carrito");
      setLogoState(null);
      setColorAck(false);
    } catch (error) {
      console.error("Error al agregar personalizada al carrito:", error);
      toast.error("No se pudo subir tu logo. Intenta de nuevo.");
    } finally {
      setAddingToCart(false);
    }
  };
  const getImageForColor = (color: string) => {
    if (!color) return images[0]?.node;
    const matchByAlt = images.find(e =>
      e.node.altText?.toLowerCase().includes(color.toLowerCase())
    );
    if (matchByAlt) return matchByAlt.node;
    const idx = colorOptions.indexOf(color);
    return images[idx]?.node || images[0]?.node;
  };
  const currentImage = getImageForColor(selectedColor);
  const productImage = currentImage?.url || "";

  const sizeMedia = handle ? SIZE_MEDIA[handle] : undefined;
  type MediaItem =
    | { type: "image"; url: string; alt: string; fullBleed?: boolean }
    | { type: "video"; src: string; poster: string };
  const mediaItems: MediaItem[] = [
    ...(sizeMedia
      ? [
          {
            type: "image" as const,
            url: sizeMedia.sizePhoto[selectedColor] || sizeMedia.sizePhoto.Blanca,
            alt: sizeMedia.sizeAlt,
            fullBleed: true,
          },
          { type: "video" as const, src: sizeMedia.video, poster: sizeMedia.poster },
        ]
      : currentImage
        ? [{ type: "image" as const, url: currentImage.url, alt: currentImage.altText || product.node.title }]
        : []),
    { type: "image" as const, url: bolsasTamanos, alt: "Los 4 tamaños de bolsas compostables Orbita Bags" },
  ];
  const activeMedia = mediaItems[Math.min(mediaIndex, mediaItems.length - 1)];
  const goTo = (i: number) => setMediaIndex((i + mediaItems.length) % mediaItems.length);

  const allImages = product.node.images.edges.map(e => e.node.url).filter(Boolean);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.node.title,
    "description": product.node.description || "Bolsa courier compostable en casa - ORBITA BAGS",
    "image": allImages.length > 0 ? allImages : ["https://orbitabags.cl/placeholder.svg"],
    "brand": {
      "@type": "Brand",
      "name": "ORBITA BAGS"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "CLP",
      "price": product.node.priceRange.minVariantPrice.amount,
      "availability": "https://schema.org/InStock",
      "url": `https://orbitabags.cl/shop/${handle}`
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${product.node.title.length > 35 ? product.node.title.slice(0, 35) : product.node.title} | ORBITA BAGS`}
        description={(product.node.description || `Compra ${product.node.title} - bolsa courier compostable en casa. Envío a todo Chile.`).slice(0, 160)}
        path={`/shop/${handle}`}
        ogImage={productImage}
        type="product"
        jsonLd={productJsonLd}
      />
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link
            to="/tienda"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la tienda
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-border">
                {!activeMedia ? (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Sin imagen
                  </div>
                ) : activeMedia.type === "image" ? (
                  activeMedia.fullBleed ? (
                    <img
                      src={activeMedia.url}
                      alt={activeMedia.alt}
                      className="w-full h-full object-cover"
                      loading="eager"
                      width={600}
                      height={600}
                    />
                  ) : (
                    <div className="w-full h-full p-8 flex items-center justify-center">
                      <img
                        src={activeMedia.url}
                        alt={activeMedia.alt}
                        className="max-h-full max-w-full object-contain"
                        loading="eager"
                        width={600}
                        height={600}
                      />
                    </div>
                  )
                ) : (
                  <>
                    <video
                      key={activeMedia.src}
                      src={activeMedia.src}
                      poster={activeMedia.poster}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-4 pt-8 pb-3 pointer-events-none">
                      <p className="text-white text-sm font-medium">
                        Así se ve el tamaño real
                      </p>
                    </div>
                  </>
                )}

                {mediaItems.length > 1 && (
                  <>
                    <button
                      onClick={() => goTo(mediaIndex - 1)}
                      aria-label="Anterior"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-border flex items-center justify-center text-foreground hover:bg-white transition-colors shadow-sm"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => goTo(mediaIndex + 1)}
                      aria-label="Siguiente"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-border flex items-center justify-center text-foreground hover:bg-white transition-colors shadow-sm"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {mediaItems.length > 1 && (
                <div className="flex gap-3">
                  {mediaItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setMediaIndex(i)}
                      aria-label={item.type === "video" ? "Ver video del tamaño real" : "Ver foto del producto"}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-white ${
                        mediaIndex === i ? "border-primary" : "border-border hover:border-primary/50"
                      }`}
                    >
                      {item.type === "image" ? (
                        <img
                          src={item.url}
                          alt=""
                          className={item.fullBleed ? "w-full h-full object-cover" : "w-full h-full object-contain p-1"}
                          loading="lazy"
                          width={80}
                          height={80}
                        />
                      ) : (
                        <>
                          <img
                            src={item.poster}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                            width={80}
                            height={80}
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <span className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
                              <Play className="w-3.5 h-3.5 text-foreground ml-0.5" fill="currentColor" />
                            </span>
                          </span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-primary text-sm font-medium uppercase tracking-wider">
                  Bolsas Biodegradables
                </span>
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground mt-2">
                  {product.node.title}
                </h1>
                {activePackVariant && !wantsCustom && (
                  <p className="text-2xl text-primary font-semibold mt-4">
                    {formatCLP(parseFloat(activePackVariant.price.amount) * packQuantity)}
                    {packQuantity > 1 && (
                      <span className="text-sm text-muted-foreground font-normal ml-2">
                        ({packQuantity} × {selectedPackUnits} uds = {packQuantity * selectedPackUnits} uds)
                      </span>
                    )}
                  </p>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.node.description}
              </p>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-secondary/30 rounded-xl p-4 text-center border border-border">
                  <Leaf className="w-6 h-6 text-primary mx-auto mb-2" />
                  <span className="text-xs text-muted-foreground">100% Biodegradable</span>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4 text-center border border-border">
                  <Recycle className="w-6 h-6 text-accent mx-auto mb-2" />
                  <span className="text-xs text-muted-foreground">180 días</span>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4 text-center border border-border">
                  <Package className="w-6 h-6 text-forest mx-auto mb-2" />
                  <span className="text-xs text-muted-foreground">Alta resistencia</span>
                </div>
              </div>

              {colorOptions.length > 0 && (
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h3 className="font-semibold text-foreground mb-4">1. Elige el color</h3>
                  <div className="flex gap-4">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                          selectedColor === color ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full mx-auto mb-2 ${
                          color === "Blanca" ? "bg-white border border-gray-300" : "bg-gray-900"
                        }`} />
                        <span className="text-foreground font-medium text-sm">{color}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4">2. ¿Quieres personalización?</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setWantsCustom(false)}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      !wantsCustom ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="text-foreground font-medium text-sm">Con diseño Orbita</span>
                    <p className="text-xs text-muted-foreground mt-1">Listas para usar</p>
                  </button>
                  <button
                    onClick={() => setWantsCustom(true)}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      wantsCustom ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="text-foreground font-medium text-sm">Personalizada</span>
                    <p className="text-xs text-muted-foreground mt-1">Tu logo en un lado, diseño Órbita en el otro</p>
                  </button>
                </div>
              </div>

              {!wantsCustom && packOptions.length > 0 && (
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h3 className="font-semibold text-foreground mb-4">3. Elige el pack</h3>
                  <div className="space-y-3">
                    {[100, 300, 500, 1000].map((units) => {
                      const isBase = units === 100;
                      const bundle = !isBase ? retailPackBundles?.find((b) => b.units === units) : null;
                      const variant = isBase
                        ? baseVariant
                        : bundle?.variants.find((v) => v.color === selectedColor);
                      const price = isBase ? baseVariant?.price.amount : variant && "price" in variant ? variant.price : undefined;
                      const fullPrice = isBase ? undefined : (parseFloat(baseVariant?.price.amount || "0") / 100) * units;
                      const hasDiscount = !isBase && price && fullPrice && parseFloat(price) < fullPrice;

                      if (!isBase && !bundle) return null;

                      return (
                        <button
                          key={units}
                          onClick={() => {
                            setSelectedPackUnits(units);
                            setPackQuantity(1);
                          }}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                            selectedPackUnits === units ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-foreground">{units} unidades</span>
                            {price && (
                              <span className="text-right">
                                {hasDiscount && (
                                  <span className="block text-xs text-muted-foreground line-through">
                                    {formatCLP(fullPrice)}
                                  </span>
                                )}
                                <span className="text-primary font-semibold">{formatCLP(price)}</span>
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      ¿Cuántos packs de {selectedPackUnits} uds?
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPackQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-primary/50"
                        aria-label="Reducir cantidad de packs"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-medium">{packQuantity}</span>
                      <button
                        onClick={() => setPackQuantity((q) => q + 1)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-primary/50"
                        aria-label="Aumentar cantidad de packs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!wantsCustom && activePackVariant && (
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm text-muted-foreground">Precio por pack de {selectedPackUnits}</span>
                    <span className="font-medium">{formatCLP(activePackVariant.price.amount)}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-foreground font-semibold">
                      Total ({packQuantity * selectedPackUnits} uds)
                    </span>
                    <span className="text-2xl text-primary font-semibold">
                      {formatCLP(parseFloat(activePackVariant.price.amount) * packQuantity)}
                    </span>
                  </div>
                </div>
              )}

              {wantsCustom && (
                <div className="space-y-6">
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <h3 className="font-semibold text-foreground mb-4">3. N° de colores del estampado</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((n) => (
                        <button
                          key={n}
                          onClick={() => setNColores(n)}
                          className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                            nColores === n ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                          }`}
                        >
                          {n} color{n > 1 ? "es" : ""}
                        </button>
                      ))}
                    </div>
                  </div>

                  {loadingBundles ? (
                    <div className="bg-card rounded-2xl p-6 border border-border flex items-center justify-center py-6">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="bg-card rounded-2xl p-6 border border-border">
                      <h3 className="font-semibold text-foreground mb-4">4. Cantidad</h3>
                      <div className="space-y-3">
                        {quantityTierOptions.map(({ tierQty, pricePerBagForTier, hasDiscount, available }) => {
                          if (!available) return null;
                          return (
                            <button
                              key={tierQty}
                              onClick={() => setCantidad(tierQty)}
                              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                cantidad === tierQty ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-foreground">{tierQty} unidades</span>
                                <span className="text-right">
                                  {hasDiscount && base100PerBag && (
                                    <span className="block text-xs text-muted-foreground line-through">
                                      {formatCLP(base100PerBag)}
                                    </span>
                                  )}
                                  <span className="text-primary font-semibold">
                                    {formatCLP(pricePerBagForTier ?? 0)}
                                  </span>
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Ajustar cantidad exacta</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setCantidad((c) => Math.max(100, c - 100))}
                            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-primary/50"
                            aria-label="Reducir cantidad"
                          >
                            −
                          </button>
                          <span className="w-16 text-center font-medium">{cantidad} uds</span>
                          <button
                            onClick={() => setCantidad((c) => c + 100)}
                            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-primary/50"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Se pide en múltiplos de 100. Mínimo 100 unidades.
                      </p>
                    </div>
                  )}

                  {matchingVariant && personalizadaTotal !== null ? (
                    <div className="bg-card rounded-2xl p-6 border border-border">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-sm text-muted-foreground">Precio por bolsa</span>
                        <span className="font-medium">{formatCLP(pricePerBag ?? 0)}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-foreground font-semibold">Total ({cantidad} uds)</span>
                        <span className="text-2xl text-primary font-semibold">{formatCLP(personalizadaTotal)}</span>
                      </div>
                    </div>
                  ) : !loadingBundles ? (
                    <p className="text-sm text-destructive">
                      Esta combinación no está disponible por ahora. Prueba con otra cantidad o N° de colores.
                    </p>
                  ) : null}

                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <h3 className="font-semibold text-foreground mb-4">5. Tu logo</h3>
                    <LogoMockup
                      ref={mockupRef}
                      bagCm={{ w: bagCmW, h: bagCmH }}
                      color={(selectedColor as "Blanca" | "Negra") || "Blanca"}
                      onStateChange={setLogoState}
                    />
                  </div>

                  <div className="bg-secondary/30 rounded-2xl p-6 border border-border text-sm text-muted-foreground space-y-2">
                    <p>
                      Tu pedido queda listo dentro de las 2 semanas siguientes a tu pago. Las bolsas
                      se mandan a imprimir tu logo en un ciclo semanal, así que no salen de
                      inmediato — te avisaremos apenas estén en camino.
                    </p>
                    <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-border">
                      <input
                        type="checkbox"
                        checked={colorAck}
                        onChange={(e) => setColorAck(e.target.checked)}
                        className="mt-0.5 w-4 h-4"
                      />
                      <span>
                        Entiendo que si mi arte tiene más colores de los que compré (
                        {nColores} color{nColores > 1 ? "es" : ""}), la entrega se puede atrasar hasta
                        llegar a un acuerdo.
                      </span>
                    </label>
                  </div>

                  <Button
                    onClick={handleAddPersonalizadaToCart}
                    disabled={!matchingVariant || !logoState || !colorAck || addingToCart}
                    className="w-full py-6 text-lg bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    {addingToCart ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <ShoppingCart className="w-5 h-5 mr-2" />
                    )}
                    {addingToCart ? "Subiendo tu logo..." : "Agregar al carrito"}
                  </Button>

                  <Button
                    onClick={handleWhatsAppCustom}
                    variant="outline"
                    className="w-full"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    ¿Dudas? Consultar por WhatsApp
                  </Button>
                </div>
              )}

              {!wantsCustom && (
                activePackVariant?.availableForSale ? (
                  <Button
                    onClick={() => {
                      useCartStore.getState().addItem({
                        product,
                        variantId: activePackVariant.id,
                        variantTitle: activePackVariant.title,
                        price: activePackVariant.price,
                        quantity: packQuantity,
                        selectedOptions: activePackVariant.selectedOptions || [],
                      });
                      if (typeof (window as any).fbq === "function") {
                        (window as any).fbq("track", "AddToCart", {
                          content_name: product.node.title,
                          content_ids: [activePackVariant.id],
                          value: parseFloat(activePackVariant.price.amount) * packQuantity,
                          currency: "CLP",
                        });
                      }
                      toast.success("Agregado al carrito");
                      setPackQuantity(1);
                    }}
                    className="w-full py-6 text-lg bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Agregar al carrito{packQuantity > 1 ? ` (${packQuantity * selectedPackUnits} uds)` : ""}
                  </Button>
                ) : (
                  <NotifyMeModal 
                    productName={product.node.title}
                    selectedColor={selectedColor}
                    selectedPack={selectedPack}
                    isCustom={false}
                    className="w-full py-6 text-lg"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopProduct;
