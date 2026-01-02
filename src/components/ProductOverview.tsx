import { useState } from 'react';
import { Check, ArrowRight, Package, Paintbrush, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedSection from './AnimatedSection';

const sizes = [
  { id: 'xs', name: 'XS', dimensions: '20 × 30 cm', use: 'Accesorios', price: 2500 },
  { id: 's', name: 'S', dimensions: '30 × 40 cm', use: 'Ropa ligera', price: 3200 },
  { id: 'm', name: 'M', dimensions: '40 × 50 cm', use: 'Ropa y zapatos', price: 4100, popular: true },
  { id: 'l', name: 'L', dimensions: '50 × 60 cm', use: 'Paquetes grandes', price: 5400 },
];

const quantities = [100, 500, 1000];

type CartItem = {
  sizeId: string;
  quantity: number;
  sets: number;
};

const ProductOverview = () => {
  const [selectedSize, setSelectedSize] = useState('m');
  const [isCustom, setIsCustom] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(500);
  const [sets, setSets] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(price);
  };

  const getCurrentSize = () => sizes.find(s => s.id === selectedSize);
  
  const getTotal = () => {
    const size = getCurrentSize();
    if (!size) return 0;
    return size.price * selectedQuantity * sets;
  };

  const addToCart = () => {
    const existingIndex = cart.findIndex(
      item => item.sizeId === selectedSize && item.quantity === selectedQuantity
    );
    
    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].sets += sets;
      setCart(newCart);
    } else {
      setCart([...cart, { sizeId: selectedSize, quantity: selectedQuantity, sets }]);
    }
    setSets(1);
  };

  const getTotalUnits = () => {
    return cart.reduce((acc, item) => acc + (item.quantity * item.sets), 0);
  };

  return (
    <section id="productos" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="tag-outline mb-4 inline-block">Productos</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold">
                Arma tu <span className="text-primary">pedido</span>
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

        {/* Size Selection */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
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

                <div className="mb-6">
                  <span className="text-4xl font-display font-bold">{size.name}</span>
                </div>

                <div className="space-y-1 mb-4">
                  <p className={`text-sm ${selectedSize === size.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {size.dimensions}
                  </p>
                  <p className={`font-medium ${selectedSize === size.id ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {size.use}
                  </p>
                </div>

                <p className="text-xl font-display font-semibold">{formatPrice(size.price)}/u</p>

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

        {/* Quantity Selection */}
        <AnimatedSection delay={400}>
          <div className="bg-muted rounded-3xl p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12">
              {/* Quantity buttons */}
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-3">Cantidad por pack</p>
                <div className="flex gap-3">
                  {quantities.map((qty) => (
                    <button
                      key={qty}
                      onClick={() => setSelectedQuantity(qty)}
                      className={`flex-1 py-4 px-6 rounded-2xl font-display font-bold text-xl transition-all ${
                        selectedQuantity === qty
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'bg-background hover:bg-background/80'
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sets counter */}
              <div>
                <p className="text-sm text-muted-foreground mb-3">Packs a pedir</p>
                <div className="flex items-center gap-4 bg-background rounded-2xl p-2">
                  <button
                    onClick={() => setSets(Math.max(1, sets - 1))}
                    className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-16 text-center text-2xl font-display font-bold">{sets}</span>
                  <button
                    onClick={() => setSets(sets + 1)}
                    className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="lg:text-right">
                <p className="text-sm text-muted-foreground mb-1">Total</p>
                <p className="text-3xl md:text-4xl font-display font-bold text-primary">
                  {formatPrice(getTotal())}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedQuantity * sets} unidades
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={500}>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="rounded-full px-8 btn-lift group"
              onClick={addToCart}
            >
              {isCustom ? 'Cotizar personalización' : (
                <>
                  <ShoppingCart className="mr-2 w-4 h-4" />
                  Agregar al pedido
                </>
              )}
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            {cart.length > 0 && (
              <p className="text-sm font-medium text-primary">
                {getTotalUnits()} unidades en tu pedido
              </p>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ProductOverview;