import { AnimatedSection } from "./AnimatedSection";
import { useState } from "react";
import { cn } from "@/lib/utils";

const sizes = [
  { id: "xs", name: "XS", dimensions: "20 × 30 cm", description: "Ideal para accesorios pequeños" },
  { id: "s", name: "S", dimensions: "25 × 35 cm", description: "Perfecto para ropa liviana" },
  { id: "m", name: "M", dimensions: "30 × 40 cm", description: "El más versátil" },
  { id: "l", name: "L", dimensions: "40 × 50 cm", description: "Para productos grandes" },
];

type ProductType = "basic" | "custom";

export function ProductOverview() {
  const [selectedSize, setSelectedSize] = useState("m");
  const [productType, setProductType] = useState<ProductType>("basic");

  return (
    <section id="productos" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Elige tu bolsa perfecta
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              4 tamaños disponibles. Básicas listas para enviar o personalizadas con tu marca.
            </p>
          </div>
        </AnimatedSection>

        {/* Product Type Toggle */}
        <AnimatedSection delay={100}>
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-secondary rounded-full p-1">
              <button
                onClick={() => setProductType("basic")}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-medium transition-all",
                  productType === "basic"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Básica
              </button>
              <button
                onClick={() => setProductType("custom")}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-medium transition-all",
                  productType === "custom"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Personalizada
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* Product Info Banner */}
        <AnimatedSection delay={150}>
          <div className={cn(
            "mb-12 p-4 rounded-2xl text-center",
            productType === "basic" ? "bg-electric-light" : "bg-secondary"
          )}>
            {productType === "basic" ? (
              <p className="text-foreground">
                <span className="font-semibold">Envío rápido</span> — Disponible en blanco o negro, lista para despachar
              </p>
            ) : (
              <p className="text-foreground">
                <span className="font-semibold">30 días de producción</span> — Personalizada con tu logo y diseño
              </p>
            )}
          </div>
        </AnimatedSection>

        {/* Size Grid */}
        <AnimatedSection delay={200}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size.id)}
                className={cn(
                  "group relative p-6 rounded-2xl border-2 transition-all text-left",
                  selectedSize === size.id
                    ? "border-primary bg-electric-light"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <span className="font-display text-3xl font-bold text-foreground">{size.name}</span>
                <p className="text-sm text-muted-foreground mt-1">{size.dimensions}</p>
                <p className="text-sm text-muted-foreground mt-2">{size.description}</p>
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Color Selection for Basic */}
        {productType === "basic" && (
          <AnimatedSection delay={250}>
            <div className="flex justify-center gap-4 mb-12">
              <button className="w-16 h-16 rounded-full bg-white border-2 border-foreground/20 hover:border-primary transition-colors flex items-center justify-center">
                <span className="sr-only">Blanco</span>
              </button>
              <button className="w-16 h-16 rounded-full bg-foreground border-2 border-foreground hover:border-primary transition-colors flex items-center justify-center">
                <span className="sr-only">Negro</span>
              </button>
            </div>
          </AnimatedSection>
        )}

        {/* CTA */}
        <AnimatedSection delay={300}>
          <div className="text-center">
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {productType === "basic" ? "Comprar ahora" : "Cotizar personalización"}
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}