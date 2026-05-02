import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Loader2, Leaf, Recycle, Package, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { fetchProductByHandle, ShopifyProduct, formatCLP } from "@/lib/shopify";
import NotifyMeModal from "@/components/NotifyMeModal";

const ShopProduct = () => {
  const { handle } = useParams<{ handle: string }>();
  const [searchParams] = useSearchParams();
  const colorParam = searchParams.get("color");
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedPack, setSelectedPack] = useState<string>("");
  const [wantsCustom, setWantsCustom] = useState(false);
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
        title={`${product.node.title} | ORBITA BAGS - Bolsas compostables Chile`}
        description={product.node.description || `Compra ${product.node.title} - bolsa courier compostable en casa. Envío a todo Chile. Certificación OK Compost HOME.`}
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
              <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-border p-8 flex items-center justify-center">
                {currentImage ? (
                  <img
                    src={currentImage.url}
                    alt={currentImage.altText || product.node.title}
                    className="max-h-full max-w-full object-contain"
                    loading="eager"
                    width={600}
                    height={600}
                  />
                ) : (
                  <div className="text-muted-foreground">Sin imagen</div>
                )}
              </div>
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
                <NotifyMeModal 
                  productName={product.node.title}
                  selectedColor={selectedColor}
                  selectedPack={selectedPack}
                  isCustom={false}
                  className="w-full py-6 text-lg"
                />
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
