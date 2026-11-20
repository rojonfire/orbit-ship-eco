import { ArrowRight, Leaf, ArrowUpRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import bolsasDuo from '@/assets/bolsas-duo.webp';
import { WhatsAppIcon } from '@/components/WhatsAppButton';
import { messageForPath, trackWhatsAppClick, whatsappUrl } from '@/lib/whatsapp';

// Precio de referencia: pack de 100 bolsas 20x30 ($9.996) = ~$100 por bolsa. Mantener igual a ProductOverview y llms.txt.
const PRECIO_DESDE = '$100';

// GIF vacío para que en escritorio (donde la portada usa tarjetas) el navegador no descargue la foto
const EMPTY_GIF = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

const HeroSection = () => {
  const { pathname } = useLocation();
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
              Bolsas courier compostables
              <br />
              para <span className="text-primary">ir y volver</span>
            </h1>

            {/* Solo móvil: la bolsa y un precio de referencia a la vista, sin tener que bajar */}
            <Link
              to="/tienda"
              data-track="hero_movil_producto_click"
              className="lg:hidden flex items-center gap-4 mb-6 rounded-2xl border border-border bg-card/80 p-3 pr-4 shadow-sm"
            >
              <picture className="shrink-0">
                <source media="(min-width: 1024px)" srcSet={EMPTY_GIF} />
                <img
                  src={bolsasDuo}
                  alt="Bolsas courier compostables Orbita Bags en blanco y negro"
                  width={112}
                  height={139}
                  fetchPriority="high"
                  decoding="async"
                  className="w-24 h-auto sm:w-28 object-contain"
                />
              </picture>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Desde</p>
                <p className="text-3xl font-display font-bold text-primary leading-none">
                  {PRECIO_DESDE}
                  <span className="text-base font-sans font-medium text-muted-foreground"> / bolsa</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">Packs de 100 · 4 tamaños · blanca o negra</p>
                <p className="text-sm font-semibold text-foreground mt-1 inline-flex items-center gap-1">
                  Ver precios <ArrowRight className="w-4 h-4" />
                </p>
              </div>
            </Link>

            <p className="sm:hidden text-base text-muted-foreground mb-6 leading-relaxed">
              Doble sello para envío y devolución. Se compostan en 180 días en tu jardín.
            </p>
            <p className="hidden sm:block text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
              Bolsas compostables en casa para ecommerce en Chile. Con doble sello adhesivo 
              para envío y devolución. Se compostan en 180 días en tu jardín, sin planta industrial.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="rounded-full px-10 py-6 text-base font-medium btn-lift group shadow-lg hover:shadow-xl transition-all">
                <Link to="/tienda">
                  Comprar ahora
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-base font-medium border-[#25D366] text-foreground hover:bg-[#25D366]/10">
                <a
                  href={whatsappUrl(messageForPath(pathname))}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick('portada', pathname)}
                >
                  <WhatsAppIcon className="mr-2 w-5 h-5 text-[#25D366]" />
                  Cotizar por WhatsApp
                </a>
              </Button>
            </div>
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
                <p className="text-lg text-primary-foreground/80">días en jardín</p>
              </div>
              <div className="card-sky">
                <RotateCcw className="w-8 h-8 mb-2 text-white/80" />
                <p className="text-xl md:text-2xl font-display font-bold mb-1">Doble sello</p>
                <p className="text-sm text-white/80">envío + devolución</p>
              </div>
              <div className="card-forest">
                <p className="text-2xl md:text-3xl font-display font-bold mb-2">4</p>
                <p className="text-sm text-white/80">tamaños</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
