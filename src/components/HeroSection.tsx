import { ArrowRight, Leaf, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedSection from './AnimatedSection';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div className="order-2 lg:order-1">
            <AnimatedSection delay={0}>
              <span className="tag-lime mb-6 inline-flex gap-2">
                <Leaf className="w-4 h-4" />
                100% Compostable
              </span>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-semibold text-foreground leading-[1.1] mb-6">
                Envíos que
                <br />
                <span className="text-primary">nutren</span> la tierra
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
                Bolsas courier compostables para ecommerce. Se degradan en 180 días, 
                dejando solo nutrientes para el suelo. Diseñadas en Chile.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-full px-8 text-base btn-lift group">
                  Comprar bolsas
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 text-base">
                  Ver catálogo
                </Button>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={400}>
              <div className="mt-12 flex items-center gap-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">+500 empresas</p>
                  <p className="text-sm text-muted-foreground">confían en ORBITA</p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right: Visual cards - Greenado style */}
          <div className="order-1 lg:order-2 relative">
            <AnimatedSection delay={200}>
              <div className="grid grid-cols-2 gap-4">
                {/* Main lime card */}
                <div className="col-span-2 card-lime relative overflow-hidden">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-sm font-semibold text-primary-foreground/80">Tiempo de degradación</span>
                    <ArrowUpRight className="w-5 h-5 text-primary-foreground/60" />
                  </div>
                  <p className="text-6xl md:text-7xl font-display font-bold text-primary-foreground">180</p>
                  <p className="text-lg text-primary-foreground/80">días en compostar</p>
                </div>

                {/* Sky blue card */}
                <div className="card-sky">
                  <p className="text-3xl md:text-4xl font-display font-bold mb-2">0%</p>
                  <p className="text-sm text-white/80">plástico convencional</p>
                </div>

                {/* Forest green card */}
                <div className="card-forest">
                  <p className="text-3xl md:text-4xl font-display font-bold mb-2">4</p>
                  <p className="text-sm text-white/80">tamaños disponibles</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;