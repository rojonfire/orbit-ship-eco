import { useState } from 'react';
import { Check, ArrowRight, Package, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedSection from './AnimatedSection';

const sizes = [
  { id: 'xs', name: 'XS', dimensions: '20 × 30 cm', use: 'Accesorios', price: '$2.500' },
  { id: 's', name: 'S', dimensions: '30 × 40 cm', use: 'Ropa ligera', price: '$3.200' },
  { id: 'm', name: 'M', dimensions: '40 × 50 cm', use: 'Ropa y zapatos', price: '$4.100', popular: true },
  { id: 'l', name: 'L', dimensions: '50 × 60 cm', use: 'Paquetes grandes', price: '$5.400' },
];

const ProductOverview = () => {
  const [selectedSize, setSelectedSize] = useState('m');
  const [isCustom, setIsCustom] = useState(false);

  return (
    <section id="productos" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="tag-outline mb-4 inline-block">Productos</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold">
                Elige tu <span className="text-primary">tamaño</span>
              </h2>
            </div>
            
            {/* Toggle */}
            <div className="inline-flex bg-muted rounded-full p-1.5">
              <button
                onClick={() => setIsCustom(false)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  !isCustom ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground'
                }`}
              >
                <Package className="w-4 h-4" />
                Estándar
              </button>
              <button
                onClick={() => setIsCustom(true)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  isCustom ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground'
                }`}
              >
                <Paintbrush className="w-4 h-4" />
                Personalizado
              </button>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {sizes.map((size, index) => (
            <AnimatedSection key={size.id} delay={100 + index * 75}>
              <div
                onClick={() => setSelectedSize(size.id)}
                className={`relative p-6 rounded-3xl cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                  selectedSize === size.id
                    ? 'bg-primary text-primary-foreground shadow-xl'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {size.popular && selectedSize !== size.id && (
                  <span className="absolute top-4 right-4 px-2.5 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    Popular
                  </span>
                )}
                
                {selectedSize === size.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-background rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                )}

                <div className="mb-8">
                  <span className="text-5xl font-display font-bold">{size.name}</span>
                </div>

                <div className="space-y-1 mb-6">
                  <p className={`text-sm ${selectedSize === size.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {size.dimensions}
                  </p>
                  <p className={`font-medium ${selectedSize === size.id ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {size.use}
                  </p>
                </div>

                <p className="text-2xl font-display font-semibold">{size.price}</p>

                {isCustom && (
                  <div className={`mt-4 pt-4 border-t ${selectedSize === size.id ? 'border-primary-foreground/20' : 'border-border'}`}>
                    <p className={`text-xs ${selectedSize === size.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      + Tu logo impreso
                    </p>
                    <p className="text-xs text-accent font-medium">30 días producción</p>
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={500}>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-full px-8 btn-lift group">
              {isCustom ? 'Cotizar personalización' : 'Agregar al carrito'}
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-sm text-muted-foreground">
              Envío gratis sobre $50.000
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ProductOverview;