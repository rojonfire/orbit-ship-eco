import { AnimatedSection } from "./AnimatedSection";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Package, Paintbrush, Clock, Truck } from "lucide-react";

const sizes = [
  { id: "xs", name: "XS", dimensions: "20 × 30 cm", description: "Accesorios pequeños", price: "$2.500" },
  { id: "s", name: "S", dimensions: "25 × 35 cm", description: "Ropa liviana", price: "$3.200" },
  { id: "m", name: "M", dimensions: "30 × 40 cm", description: "El más versátil", price: "$4.100", popular: true },
  { id: "l", name: "L", dimensions: "40 × 50 cm", description: "Productos grandes", price: "$5.400" },
];

type ProductType = "basic" | "custom";

export function ProductOverview() {
  const [selectedSize, setSelectedSize] = useState("m");
  const [productType, setProductType] = useState<ProductType>("basic");
  const [selectedColor, setSelectedColor] = useState<"white" | "black">("white");

  return (
    <section id="productos" className="py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[200px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="text-foreground">Elige tu bolsa </span>
              <span className="gradient-text">perfecta</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              4 tamaños disponibles. Básicas listas para enviar o personalizadas con tu marca.
            </p>
          </div>
        </AnimatedSection>

        {/* Product Type Toggle */}
        <AnimatedSection delay={100}>
          <div className="flex justify-center mb-12">
            <div className="inline-flex glass rounded-full p-1.5 glow-border">
              <button
                onClick={() => setProductType("basic")}
                className={cn(
                  "flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold transition-all duration-300",
                  productType === "basic"
                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--glow-primary)/0.4)]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Package className="w-4 h-4" />
                Básica
              </button>
              <button
                onClick={() => setProductType("custom")}
                className={cn(
                  "flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold transition-all duration-300",
                  productType === "custom"
                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--glow-primary)/0.4)]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Paintbrush className="w-4 h-4" />
                Personalizada
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* Product Info Banner */}
        <AnimatedSection delay={150}>
          <div className={cn(
            "mb-12 p-5 rounded-2xl glass glow-border flex items-center justify-center gap-3",
          )}>
            {productType === "basic" ? (
              <>
                <Truck className="w-5 h-5 text-primary" />
                <p className="text-foreground">
                  <span className="font-semibold text-primary">Envío rápido</span>
                  <span className="text-muted-foreground"> — Disponible en blanco o negro, lista para despachar</span>
                </p>
              </>
            ) : (
              <>
                <Clock className="w-5 h-5 text-glow-secondary" />
                <p className="text-foreground">
                  <span className="font-semibold text-glow-secondary">30 días de producción</span>
                  <span className="text-muted-foreground"> — Personalizada con tu logo y diseño</span>
                </p>
              </>
            )}
          </div>
        </AnimatedSection>

        {/* Size Grid */}
        <AnimatedSection delay={200}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size.id)}
                className={cn(
                  "group relative p-6 rounded-2xl border transition-all duration-300 text-left overflow-hidden",
                  selectedSize === size.id
                    ? "border-primary bg-primary/10 glow-primary-subtle"
                    : "border-border/50 glass hover:border-primary/50"
                )}
              >
                {size.popular && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    Popular
                  </span>
                )}
                
                <span className="font-display text-4xl font-bold gradient-text">{size.name}</span>
                <p className="text-sm text-muted-foreground mt-2">{size.dimensions}</p>
                <p className="text-sm text-foreground/70 mt-1">{size.description}</p>
                <p className="text-lg font-bold text-primary mt-4">{size.price}</p>
                
                {selectedSize === size.id && (
                  <div className="absolute bottom-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Color Selection for Basic */}
        {productType === "basic" && (
          <AnimatedSection delay={250}>
            <div className="flex justify-center gap-6 mb-12">
              <button 
                onClick={() => setSelectedColor("white")}
                className={cn(
                  "group flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300",
                  selectedColor === "white" ? "glass glow-border" : "hover:bg-card/30"
                )}
              >
                <div className={cn(
                  "w-16 h-16 rounded-full bg-foreground border-4 transition-all duration-300",
                  selectedColor === "white" ? "border-primary shadow-[0_0_20px_hsl(var(--glow-primary)/0.5)]" : "border-transparent"
                )} />
                <span className="text-sm font-medium text-foreground">Blanco</span>
              </button>
              <button 
                onClick={() => setSelectedColor("black")}
                className={cn(
                  "group flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300",
                  selectedColor === "black" ? "glass glow-border" : "hover:bg-card/30"
                )}
              >
                <div className={cn(
                  "w-16 h-16 rounded-full bg-background border-4 border-foreground/30 transition-all duration-300",
                  selectedColor === "black" ? "border-primary shadow-[0_0_20px_hsl(var(--glow-primary)/0.5)]" : ""
                )} />
                <span className="text-sm font-medium text-foreground">Negro</span>
              </button>
            </div>
          </AnimatedSection>
        )}

        {/* CTA */}
        <AnimatedSection delay={300}>
          <div className="text-center">
            <a
              href="#"
              className="group relative inline-flex items-center gap-3 px-12 py-5 rounded-full text-lg font-semibold overflow-hidden transition-all duration-500"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-glow-secondary to-glow-cyan bg-[length:200%_100%] animate-gradient-shift" />
              <span className="relative text-primary-foreground">
                {productType === "basic" ? "Comprar ahora" : "Cotizar personalización"}
              </span>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}