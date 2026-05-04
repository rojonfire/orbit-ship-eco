import { ArrowRight, Leaf, RotateCcw, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedSection from './AnimatedSection';
import bolsasDuo from '@/assets/bolsas-multiples.png';

const ProductOverview = () => {
  return (
    <section id="productos" className="py-12 md:py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="tag-outline mb-4 inline-block">Nuestro Producto</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold">
              Bolsas courier <span className="text-primary">compostables</span>
            </h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              Compostables en casa, con doble sello para devoluciones. Se compostan en 180 días en tu jardín.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Product Image */}
            <div className="aspect-square flex items-center justify-center">
              <img
                src={bolsasDuo}
                alt="Bolsas courier compostables Orbita - packaging sustentable para envío y devolución en Chile"
                className="w-full h-full object-contain hover-scale"
                loading="lazy"
                width={580}
                height={536}
              />
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  Bolsa Compostable Premium
                </h3>
                <p className="text-2xl text-primary font-semibold mt-2">
                  Desde $100 CLP / unidad
                </p>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Packaging diseñado bajo principios de economía circular: une resistencia, calidad 
                y compostabilidad en una sola bolsa pensada para reutilizarse. Mejor experiencia 
                post-venta y menor impacto ambiental.
              </p>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card rounded-xl p-4 text-center border border-border shadow-sm">
                  <Leaf className="w-8 h-8 text-primary mx-auto mb-2" />
                  <span className="text-sm text-foreground font-medium">Compostable en casa</span>
                </div>
                <div className="bg-card rounded-xl p-4 text-center border border-border shadow-sm">
                  <RotateCcw className="w-8 h-8 text-accent mx-auto mb-2" />
                  <span className="text-sm text-foreground font-medium">Doble sello</span>
                </div>
                <div className="bg-card rounded-xl p-4 text-center border border-border shadow-sm">
                  <Package className="w-8 h-8 text-forest mx-auto mb-2" />
                  <span className="text-sm text-foreground font-medium">Alta resistencia</span>
                </div>
              </div>

              {/* CTA */}
              <Link to="/tienda" className="mt-4 inline-block" onClick={() => window.scrollTo({ top: 0 })}>
                <Button size="lg" className="rounded-full px-8 btn-lift group w-full sm:w-auto">
                  Ver tamaños y precios
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ProductOverview;
