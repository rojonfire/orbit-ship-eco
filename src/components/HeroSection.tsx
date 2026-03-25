import { ArrowRight, Leaf, ArrowUpRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content — NO animation wrappers for faster FCP/LCP */}
          <div className="order-2 lg:order-1">
            <span className="tag-lime mb-6 inline-flex gap-2">
              <Leaf className="w-4 h-4" />
              Compostable en casa 🌱
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-semibold text-foreground leading-[1.1] mb-6">
              Bolsas courier
              <br />
              que <span className="text-primary">nutren</span> la tierra
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
              Bolsas compostables en casa para ecommerce en Chile. Con doble sello adhesivo 
              para envío y devolución. Se compostan en 180 días en tu jardín, sin planta industrial.
            </p>

            <Button asChild size="lg" className="rounded-full px-10 py-6 text-base font-medium btn-lift group shadow-lg hover:shadow-xl transition-all">
              <Link to="/tienda">
                Comprar ahora
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Right: Visual cards */}
          <div className="hidden lg:block order-1 lg:order-2 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 card-lime relative overflow-hidden">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-sm font-semibold text-primary-foreground/80">Compostaje domiciliario</span>
                  <ArrowUpRight className="w-5 h-5 text-primary-foreground/60" />
                </div>
                <p className="text-6xl md:text-7xl font-display font-bold text-primary-foreground">180</p>
                <p className="text-lg text-primary-foreground/80">días en tu jardín</p>
              </div>
              <div className="card-sky">
                <RotateCcw className="w-8 h-8 mb-2 text-white/80" />
                <p className="text-2xl md:text-3xl font-display font-bold mb-1">Doble sello</p>
                <p className="text-sm text-white/80">envío + devolución</p>
              </div>
              <div className="card-forest">
                <p className="text-3xl md:text-4xl font-display font-bold mb-2">5</p>
                <p className="text-sm text-white/80">tamaños disponibles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default HeroSection;
