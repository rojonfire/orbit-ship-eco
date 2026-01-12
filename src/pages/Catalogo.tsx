import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Package } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import bolsaBlanca from "@/assets/bolsa-blanca.png";
import bolsaNegra from "@/assets/bolsa-negra.png";

const SIZES = [
  { 
    id: "xs", 
    name: "Extra Pequeña", 
    dimensions: "15cm x 20cm", 
    description: "Ideal para accesorios pequeños y joyería"
  },
  { 
    id: "small", 
    name: "Pequeña", 
    dimensions: "20cm x 30cm", 
    description: "Perfecta para ropa interior y accesorios"
  },
  { 
    id: "medium", 
    name: "Mediana", 
    dimensions: "30cm x 40cm", 
    description: "Ideal para camisetas y ropa liviana"
  },
  { 
    id: "large", 
    name: "Grande", 
    dimensions: "40cm x 50cm", 
    description: "Para ropa, zapatos y productos medianos"
  },
  { 
    id: "xl", 
    name: "Extra Grande", 
    dimensions: "50cm x 60cm", 
    description: "Para envíos voluminosos y paquetes grandes"
  },
];

const COLORS = [
  { id: "blanca", name: "Blanca", image: bolsaBlanca },
  { id: "negra", name: "Negra", image: bolsaNegra },
];

const Catalogo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          {/* Header */}
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                Catálogo Completo
              </span>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2 mb-4">
                Nuestras Bolsas
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Descubre todos los tamaños disponibles. Cada bolsa está fabricada con materiales 
                100% biodegradables que se descomponen en 180 días.
              </p>
            </div>
          </AnimatedSection>

          {/* Catalog Grid by Size */}
          <div className="space-y-16">
            {SIZES.map((size, sizeIndex) => (
              <AnimatedSection key={size.id} delay={sizeIndex * 100}>
                <div className="bg-card rounded-3xl border border-border p-8">
                  {/* Size Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Package className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold text-foreground">
                        Bolsa {size.name}
                      </h2>
                      <p className="text-muted-foreground">
                        {size.dimensions}
                      </p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-8">{size.description}</p>

                  {/* Color Options */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    {COLORS.map((color) => (
                      <Link
                        key={`${size.id}-${color.id}`}
                        to={`/producto?size=${size.id}&color=${color.id}`}
                        className="group bg-secondary/30 rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg"
                      >
                        <div className="aspect-square bg-white/50 p-8 flex items-center justify-center">
                          <img
                            src={color.image}
                            alt={`Bolsa ${size.name} ${color.name}`}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-6 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {size.name} - {color.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {size.dimensions}
                            </p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                            <ArrowRight className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* CTA */}
          <AnimatedSection delay={400}>
            <div className="mt-16 text-center">
              <p className="text-muted-foreground mb-4">
                ¿Necesitas bolsas personalizadas con tu logo?
              </p>
              <Link
                to="/producto?custom=personalizada"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                Consultar personalización
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Catalogo;
