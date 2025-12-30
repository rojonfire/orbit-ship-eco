import { AnimatedSection } from "./AnimatedSection";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-glow-secondary/15 rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-glow-cyan/10 rounded-full blur-[180px]" />
      </div>
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-5 py-2 glass rounded-full mb-8 glow-border">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground/80">
                Envíos sustentables para Chile
              </span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8">
              <span className="text-foreground">Bolsas de courier</span>
              <br />
              <span className="gradient-text">compostables</span>
              <br />
              <span className="text-foreground">para ecommerce</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Resistentes, profesionales y 100% compostables. 
              Envía tus productos sin plástico y destaca tu marca con tecnología sustentable.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#productos"
                className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full text-lg font-semibold overflow-hidden transition-all duration-500"
              >
                {/* Animated gradient background */}
                <span className="absolute inset-0 bg-gradient-to-r from-primary via-glow-secondary to-glow-cyan bg-[length:200%_100%] animate-gradient-shift" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-glow-cyan via-glow-secondary to-primary bg-[length:200%_100%] animate-gradient-shift" />
                <span className="relative text-primary-foreground flex items-center gap-3">
                  Comprar bolsas
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
              <a
                href="#contacto"
                className="group inline-flex items-center gap-3 px-10 py-5 rounded-full text-lg font-medium glass glow-border hover:bg-card/60 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 text-primary" />
                <span className="text-foreground">Hablar con nosotros</span>
              </a>
            </div>
          </AnimatedSection>
        </div>

        {/* Hero visual - Futuristic floating card */}
        <AnimatedSection delay={500} className="mt-20">
          <div className="relative max-w-4xl mx-auto">
            {/* Glow effect behind card */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-glow-secondary/20 to-glow-cyan/30 rounded-3xl blur-3xl scale-105" />
            
            <div className="relative aspect-[16/9] glass rounded-3xl overflow-hidden glow-border">
              {/* Floating bag mockup placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Abstract bag visualization */}
                <div className="relative animate-float">
                  <div className="w-56 h-72 rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-sm flex flex-col items-center justify-center gap-4 glow-primary-subtle">
                    <div className="w-16 h-1 bg-primary/50 rounded-full" />
                    <div className="text-primary/60 text-sm font-medium">ORBITA</div>
                    <div className="w-12 h-1 bg-primary/30 rounded-full" />
                  </div>
                  
                  {/* Floating particles */}
                  <div className="absolute -top-4 -right-4 w-3 h-3 bg-primary rounded-full animate-glow-pulse" />
                  <div className="absolute -bottom-6 -left-6 w-2 h-2 bg-glow-cyan rounded-full animate-glow-pulse" style={{ animationDelay: "0.5s" }} />
                  <div className="absolute top-1/2 -right-8 w-2 h-2 bg-glow-secondary rounded-full animate-glow-pulse" style={{ animationDelay: "1s" }} />
                </div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-primary/30 rounded-tl-3xl" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-primary/30 rounded-br-3xl" />
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: "1s" }}>
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}