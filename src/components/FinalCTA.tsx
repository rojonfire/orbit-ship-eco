import { AnimatedSection } from "./AnimatedSection";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-32 bg-foreground text-background relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px"
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-balance">
              Envía mejor. Sin plástico.
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <p className="text-xl text-background/70 mb-10 max-w-2xl mx-auto">
              Únete a las marcas chilenas que ya envían de forma sustentable con ORBITA BAGS.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <a
              href="#productos"
              className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-5 rounded-full text-xl font-medium hover:bg-primary/90 transition-all hover:gap-4"
            >
              Empezar ahora
              <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </a>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}