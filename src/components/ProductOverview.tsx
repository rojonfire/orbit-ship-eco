import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedSection from './AnimatedSection';

const sizes = [
  { id: 'xs', name: 'XS', dimensions: '20 × 30 cm', use: 'Accesorios pequeños' },
  { id: 's', name: 'S', dimensions: '30 × 40 cm', use: 'Ropa ligera' },
  { id: 'm', name: 'M', dimensions: '40 × 50 cm', use: 'Ropa y zapatos' },
  { id: 'l', name: 'L', dimensions: '50 × 60 cm', use: 'Paquetes grandes' },
];

const ProductOverview = () => {
  const [selectedSize, setSelectedSize] = useState('m');
  const [isCustom, setIsCustom] = useState(false);

  return (
    <section id="productos" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="deco-circle w-[500px] h-[500px] top-0 right-0 opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="tag-primary mb-4 inline-block">Productos</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold mb-6">
              Encuentra tu <span className="text-primary italic">tamaño</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Cuatro tamaños diseñados para cubrir todas las necesidades de tu ecommerce.
            </p>
          </div>
        </AnimatedSection>

        {/* Toggle Basic/Custom */}
        <AnimatedSection delay={100}>
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-secondary rounded-full p-1.5">
              <button
                onClick={() => setIsCustom(false)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  !isCustom
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Estándar
              </button>
              <button
                onClick={() => setIsCustom(true)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  isCustom
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Personalizado
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* Product cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sizes.map((size, index) => (
            <AnimatedSection key={size.id} delay={150 + index * 100}>
              <div
                onClick={() => setSelectedSize(size.id)}
                className={`soft-card p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2 ${
                  selectedSize === size.id
                    ? 'ring-2 ring-primary shadow-lg'
                    : ''
                }`}
              >
                {/* Size indicator */}
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                    <span className="text-xl font-display font-semibold text-primary">
                      {size.name}
                    </span>
                  </div>
                  {selectedSize === size.id && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>

                {/* Product illustration placeholder */}
                <div className="aspect-square rounded-2xl bg-secondary/50 mb-6 flex items-center justify-center overflow-hidden">
                  <div className="organic-blob w-3/4 h-3/4 bg-accent/30" />
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <h3 className="font-display font-semibold text-lg">
                    Bolsa {size.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {size.dimensions}
                  </p>
                  <p className="text-sm text-foreground/70">
                    {size.use}
                  </p>
                </div>

                {isCustom && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      + Impresión personalizada
                    </p>
                    <p className="text-xs text-accent font-medium">
                      30 días de producción
                    </p>
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection delay={600}>
          <div className="text-center mt-12">
            <Button size="lg" className="rounded-full px-8 btn-lift group">
              Ver catálogo completo
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ProductOverview;