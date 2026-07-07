import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Loader2, Leaf, Recycle, Package, MessageCircle, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { fetchProductByHandle, ShopifyProduct, formatCLP } from "@/lib/shopify";
import NotifyMeModal from "@/components/NotifyMeModal";
import { useCartStore } from "@/stores/cartStore";
import bolsasTamanos from "@/assets/bolsas-tamanos.webp";
import ref2030Blanca from "@/assets/bolsa-20x30-referencia-blanca.webp";
import ref2030Negra from "@/assets/bolsa-20x30-referencia-negra.webp";
import ref3040Blanca from "@/assets/bolsa-30x40-referencia-blanca.webp";
import ref3040Negra from "@/assets/bolsa-30x40-referencia-negra.webp";
import ref4050Blanca from "@/assets/bolsa-40x50-referencia-blanca.webp";
import ref4050Negra from "@/assets/bolsa-40x50-referencia-negra.webp";
import ref5060Blanca from "@/assets/bolsa-50x60-referencia-blanca.webp";
import ref5060Negra from "@/assets/bolsa-50x60-referencia-negra.webp";

// Media de referencia de tamaño por producto: foto con objeto real (por color) y video (sin audio)
const SIZE_MEDIA: Record<
  string,
  { video: string; poster: string; sizePhoto: Record<string, string>; sizeAlt: string }
> = {
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

const ShopProduct = () => {
  const { handle } = useParams<{ handle: string }>();
  const [searchParams] = useSearchParams();
  const colorParam = searchParams.get("color");
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedPack, setSelectedPack] = useState<string>("");
  const [wantsCustom, setWantsCustom] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);
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

  const getSelectedVariant = () => {
    if (!product) return null;
    return product.node.variants.edges.find(v => {
      const hasColor = v.node.selectedOptions.some(o => o.name === "Color" && o.value === selectedColor);
      const hasPack = v.node.selectedOptions.some(o => o.name === "Pack" && o.value === selectedPack);
      return hasColor && hasPack;
    })?.node;
  };

  const selectedVariant = getSelectedVariant();

  const handleWhatsAppCustom = () => {
    const message = `¡Hola! Me interesa saber más sobre las bolsas personalizadas. ¿Podrían darme más información?`;
    window.open(`https://wa.me/56954244951?text=${encodeURIComponent(message)}`, "_blank");
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
        ]
      : []),
    ...(currentImage
      ? [{ type: "image" as const, url: currentImage.url, alt: currentImage.altText || product.node.title }]
      : []),
    ...(sizeMedia ? [{ type: "video" as const, src: sizeMedia.video, poster: sizeMedia.poster }] : []),
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
                {selectedVariant && !wantsCustom && (
                  <p className="text-2xl text-primary font-semibold mt-4">
                    {formatCLP(selectedVariant.price.amount)}
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
                    <p className="text-xs text-muted-foreground mt-1">Tu logo o diseño</p>
                  </button>
                </div>
              </div>

              {!wantsCustom && packOptions.length > 0 && (
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h3 className="font-semibold text-foreground mb-4">3. Elige el pack</h3>
                  <div className="space-y-3">
                    {packOptions.map((pack) => {
                      const variant = product.node.variants.edges.find(v => {
                        const hasColor = v.node.selectedOptions.some(o => o.name === "Color" && o.value === selectedColor);
                        const hasPack = v.node.selectedOptions.some(o => o.name === "Pack" && o.value === pack);
                        return hasColor && hasPack;
                      })?.node;

                      return (
                        <button
                          key={pack}
                          onClick={() => setSelectedPack(pack)}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                            selectedPack === pack ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-foreground">{pack}</span>
                            {variant && (
                              <span className="text-primary font-semibold">
                                {formatCLP(variant.price.amount)}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {wantsCustom && (
                <div className="bg-accent/20 rounded-2xl p-6 border border-accent/30">
                  <h3 className="font-semibold text-foreground mb-2">Personalización</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Para bolsas personalizadas con tu logo o diseño, contáctanos por WhatsApp para cotización y detalles.
                  </p>
                  <Button
                    onClick={handleWhatsAppCustom}
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Consultar por WhatsApp
                  </Button>
                </div>
              )}

              {!wantsCustom && (
                selectedVariant?.availableForSale ? (
                  <Button
                    onClick={() => {
                      useCartStore.getState().addItem({
                        product,
                        variantId: selectedVariant.id,
                        variantTitle: selectedVariant.title,
                        price: selectedVariant.price,
                        quantity: 1,
                        selectedOptions: selectedVariant.selectedOptions || [],
                      });
                      if (typeof (window as any).fbq === "function") {
                        (window as any).fbq("track", "AddToCart", {
                          content_name: product.node.title,
                          content_ids: [selectedVariant.id],
                          value: parseFloat(selectedVariant.price.amount),
                          currency: "CLP",
                        });
                      }
                    }}
                    className="w-full py-6 text-lg bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Agregar al carrito
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
