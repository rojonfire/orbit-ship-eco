import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Loader2, Leaf, Recycle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchProductByHandle, ShopifyProduct, formatCLP } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const ShopProduct = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedPack, setSelectedPack] = useState<string>("");
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      try {
        const data = await fetchProductByHandle(handle);
        setProduct(data);
        
        // Pre-select first options
        if (data?.node.options) {
          const colorOption = data.node.options.find(o => o.name === "Color");
          const packOption = data.node.options.find(o => o.name === "Pack");
          if (colorOption?.values[0]) setSelectedColor(colorOption.values[0]);
          if (packOption?.values[0]) setSelectedPack(packOption.values[0]);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [handle]);

  const getSelectedVariant = () => {
    if (!product) return null;
    return product.node.variants.edges.find(v => {
      const hasColor = v.node.selectedOptions.some(o => o.name === "Color" && o.value === selectedColor);
      const hasPack = v.node.selectedOptions.some(o => o.name === "Pack" && o.value === selectedPack);
      return hasColor && hasPack;
    })?.node;
  };

  const selectedVariant = getSelectedVariant();

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    });

    toast.success("Agregado al carrito", {
      description: `${product.node.title} - ${selectedVariant.title}`,
      position: "top-center",
    });
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Link
            to="/tienda"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la tienda
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-border p-8 flex items-center justify-center">
                {product.node.images.edges[0]?.node ? (
                  <img
                    src={product.node.images.edges[0].node.url}
                    alt={product.node.images.edges[0].node.altText || product.node.title}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-muted-foreground">Sin imagen</div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="text-primary text-sm font-medium uppercase tracking-wider">
                  Bolsas Biodegradables
                </span>
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground mt-2">
                  {product.node.title}
                </h1>
                {selectedVariant && (
                  <p className="text-2xl text-primary font-semibold mt-4">
                    {formatCLP(selectedVariant.price.amount)}
                  </p>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.node.description}
              </p>

              {/* Features */}
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

              {/* Color Selector */}
              {colorOptions.length > 0 && (
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h3 className="font-semibold text-foreground mb-4">1. Elige el color</h3>
                  <div className="flex gap-4">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                          selectedColor === color
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
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

              {/* Pack Selector */}
              {packOptions.length > 0 && (
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h3 className="font-semibold text-foreground mb-4">2. Elige el pack</h3>
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
                            selectedPack === pack
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
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

              {/* Add to Cart Button */}
              <Button 
                onClick={handleAddToCart}
                className="w-full py-6 text-lg"
                disabled={!selectedVariant}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Agregar al carrito
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopProduct;
