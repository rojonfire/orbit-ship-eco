import { AnimatedSection } from "./AnimatedSection";
import { ArrowRight, MessageCircle } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-electric-light/30 to-background" />
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 bg-electric-light text-primary rounded-full text-sm font-medium mb-6">
              Envíos sustentables para Chile
            </span>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 text-balance">
              Bolsas de courier compostables para ecommerce en Chile
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Resistentes, profesionales y 100% compostables. Envía tus productos sin plástico y destaca tu marca.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#productos"
                className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-primary/90 transition-all hover:gap-3"
              >
                Comprar bolsas
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-secondary/80 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Hablar con nosotros
              </a>
            </div>
          </AnimatedSection>
        </div>

        {/* Hero visual - Abstract bag illustration */}
        <AnimatedSection delay={400} className="mt-16">
          <div className="relative max-w-3xl mx-auto">
            <div className="aspect-[16/10] bg-gradient-to-br from-secondary to-muted rounded-3xl flex items-center justify-center overflow-hidden">
              {/* Placeholder for product hero image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-48 h-64 bg-foreground/5 rounded-2xl border-2 border-dashed border-foreground/20 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Imagen del producto</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}