import { AnimatedSection } from "./AnimatedSection";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Dramatic gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-gradient-to-r from-primary/20 via-glow-secondary/15 to-glow-cyan/20 rounded-full blur-[150px]" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-5 py-2 glass rounded-full mb-8 glow-border">
              <Sparkles className="w-4 h-4 text-primary animate-glow-pulse" />
              <span className="text-sm font-medium text-foreground/80">
                Únete a +200 marcas chilenas
              </span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.95]">
              <span className="text-foreground">Envía mejor.</span>
              <br />
              <span className="gradient-text glow-text">Sin plástico.</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              El futuro del ecommerce es sustentable. Sé parte del cambio con ORBITA BAGS.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <a
              href="#productos"
              className="group relative inline-flex items-center gap-3 px-14 py-6 rounded-full text-xl font-bold overflow-hidden transition-all duration-500"
            >
              {/* Animated gradient background */}
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-glow-secondary to-glow-cyan bg-[length:200%_100%] animate-gradient-shift" />
              
              {/* Glow effect */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_60px_20px_hsl(var(--glow-primary)/0.4)]" />
              
              <span className="relative text-primary-foreground flex items-center gap-3">
                Empezar ahora
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
              </span>
            </a>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}