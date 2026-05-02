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
                  <div className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg group">
                    <Link to={`/shop/${product.node.handle}`}>
                      <div className="aspect-square bg-white p-6 flex items-center justify-center">
                        {product.node.images.edges[0]?.node ? (
                          <img
                            src={product.node.images.edges[0].node.url}
                            alt={product.node.images.edges[0].node.altText || product.node.title}
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
                      <Link to={`/shop/${product.node.handle}`}>
                        <h3 className="font-semibold text-foreground text-lg mb-2 hover:text-primary transition-colors">
                          {product.node.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {product.node.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold text-primary">
                          Desde {formatCLP(product.node.priceRange.minVariantPrice.amount)}
                        </p>
                      </div>
                      <NotifyMeModal 
                        productName={product.node.title}
                        className="w-full mt-4"
                      />
                    </div>
                  </div>
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

export default Tienda;
