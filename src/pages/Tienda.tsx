import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SEOHead from "@/components/SEOHead";
import { fetchShopifyProducts, ShopifyProduct, formatCLP } from "@/lib/shopify";
import NotifyMeModal from "@/components/NotifyMeModal";

const Tienda = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "ViewContent", { content_type: "product_group", content_name: "Tienda" });
    }
    const loadProducts = async () => {
      try {
        const data = await fetchShopifyProducts(10);
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Tienda | Bolsas compostables ORBITA BAGS - Compra online en Chile"
        description="Compra bolsas courier compostables en casa para tu ecommerce. Envío a todo Chile. Doble sello adhesivo, certificación OK Compost HOME. Desde $850 CLP."
        path="/tienda"
      />
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                Tienda Online
              </span>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2 mb-4">
                Compra Bolsas Orbita
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Elige tus bolsas biodegradables favoritas. Todas con envío a todo Chile.
              </p>
            </div>
          </AnimatedSection>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No hay productos disponibles</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <AnimatedSection key={product.node.id} delay={index * 100}>
                  <ProductCard product={product} />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

const ProductCard = ({ product }: { product: ShopifyProduct }) => {
  const colorOption = product.node.options.find(o => o.name === "Color");
  const colorValues = colorOption?.values || [];
  const [selectedColor, setSelectedColor] = useState<string>(colorValues[0] || "");

  const images = product.node.images.edges;
  const getImageForColor = (color: string) => {
    if (!color) return images[0]?.node;
    const matchByAlt = images.find(e =>
      e.node.altText?.toLowerCase().includes(color.toLowerCase())
    );
    if (matchByAlt) return matchByAlt.node;
    const idx = colorValues.indexOf(color);
    return images[idx]?.node || images[0]?.node;
  };

  const currentImage = getImageForColor(selectedColor);
  const linkTo = selectedColor
    ? `/shop/${product.node.handle}?color=${encodeURIComponent(selectedColor)}`
    : `/shop/${product.node.handle}`;

  const swatchClass = (color: string) => {
    const lower = color.toLowerCase();
    if (lower.includes("blanc")) return "bg-white border border-gray-300";
    if (lower.includes("negr")) return "bg-gray-900";
    return "bg-gray-400";
  };

  // Find smallest pack variant for the selected color to show entry price
  const packOption = product.node.options.find(o => o.name === "Pack");
  const packValues = packOption?.values || [];
  const parsePackQty = (label: string) => {
    const m = label.match(/\d[\d.]*/);
    return m ? parseInt(m[0].replace(/\./g, ""), 10) : 0;
  };
  const smallestPack = [...packValues].sort((a, b) => parsePackQty(a) - parsePackQty(b))[0];
  const entryVariant = product.node.variants.edges.find(v => {
    const matchColor = !selectedColor || v.node.selectedOptions.some(o => o.name === "Color" && o.value === selectedColor);
    const matchPack = !smallestPack || v.node.selectedOptions.some(o => o.name === "Pack" && o.value === smallestPack);
    return matchColor && matchPack;
  })?.node;
  const entryPrice = entryVariant
    ? parseFloat(entryVariant.price.amount)
    : parseFloat(product.node.priceRange.minVariantPrice.amount);
  const entryQty = smallestPack ? parsePackQty(smallestPack) : 0;
  const pricePerUnit = entryQty > 0 ? entryPrice / entryQty : 0;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg group">
      <Link to={linkTo}>
        <div className="aspect-square bg-white p-6 flex items-center justify-center">
          {currentImage ? (
            <img
              src={currentImage.url}
              alt={currentImage.altText || product.node.title}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              width={400}
              height={400}
            />
          ) : (
            <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
              <span className="text-muted-foreground">Sin imagen</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-6">
        <Link to={linkTo}>
          <h3 className="font-semibold text-foreground text-lg mb-3 hover:text-primary transition-colors">
            {product.node.title}
          </h3>
        </Link>
        {colorValues.length > 1 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-muted-foreground">Color:</span>
            <div className="flex gap-2">
              {colorValues.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  onMouseEnter={() => setSelectedColor(color)}
                  aria-label={`Ver color ${color}`}
                  title={color}
                  className={`w-6 h-6 rounded-full transition-all ${swatchClass(color)} ${
                    selectedColor === color
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
                      : "hover:scale-110"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <p className="text-2xl font-bold text-primary leading-tight">
              {formatCLP(entryPrice.toString())}
            </p>
            {entryQty > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Pack de {entryQty} · {formatCLP(pricePerUnit.toString())} c/u
              </p>
            )}
          </div>
        </div>
        <NotifyMeModal
          productName={product.node.title}
          className="w-full mt-4"
        />
      </div>
    </div>
  );
};

export default Tienda;
