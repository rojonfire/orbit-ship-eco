import { ArrowRight, Leaf, Recycle, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedSection from './AnimatedSection';

const ProductOverview = () => {
  return (
    <section id="productos" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="tag-outline mb-4 inline-block">Nuestro Producto</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold">
              Bolsas <span className="text-primary">Orbita</span>
            </h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              Bolsas biodegradables de alta resistencia que se descomponen en 180 días
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Product Image */}
            <div className="aspect-square bg-secondary/30 rounded-3xl overflow-hidden border border-border">
              <img
                src="/placeholder.svg"
                alt="Bolsa Orbita Biodegradable"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  Bolsa Biodegradable Premium
                </h3>
                <p className="text-2xl text-primary font-semibold mt-2">
                  Desde $0.85 USD / unidad
                </p>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Nuestra bolsa insignia combina resistencia y sostenibilidad. Fabricada con 
                materiales 100% biodegradables, perfecta para retail, supermercados y 
                comercios que buscan reducir su huella ambiental.
              </p>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-secondary/30 rounded-xl p-4 text-center border border-border">
                  <Leaf className="w-8 h-8 text-primary mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">100% Biodegradable</span>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4 text-center border border-border">
                  <Recycle className="w-8 h-8 text-accent mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">180 días</span>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4 text-center border border-border">
                  <Package className="w-8 h-8 text-forest mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">Alta resistencia</span>
                </div>
              </div>

              {/* CTA */}
              <Link to="/producto">
                <Button size="lg" className="rounded-full px-8 btn-lift group w-full sm:w-auto">
                  Arma tu pedido
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
