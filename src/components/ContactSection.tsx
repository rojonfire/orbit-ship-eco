import { MessageCircle, Calendar, ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedSection from './AnimatedSection';

const WHATSAPP_PHONE = '56954244951';
const WHATSAPP_TEXT = '¡Hola! Me interesa conocer más sobre las bolsas Orbita.';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

const ContactSection = () => {
  return (
    <section id="contacto" className="py-12 md:py-16 lg:py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <AnimatedSection>
              <span className="tag-outline mb-4 inline-block">Contacto</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold mb-6">
                ¿Dudas? <span className="text-primary">Hablemos</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Te ayudamos a encontrar la bolsa perfecta para tu negocio. Sin compromiso.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-full px-8 btn-lift group bg-[#25D366] hover:bg-[#20BD5A]">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 w-5 h-5" />
                    WhatsApp
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>

                <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                  <a href="https://calendar.app.google/3F1aqa9tBhpuFS5H7" target="_blank" rel="noopener noreferrer">
                    <Calendar className="mr-2 w-5 h-5" />
                    Agendar llamada
                  </a>
                </Button>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <p className="mt-8 text-sm text-muted-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Respondemos en menos de 2 horas
              </p>
            </AnimatedSection>
          </div>

          {/* Right: Visual cards */}
          <AnimatedSection delay={150}>
            <div className="grid grid-cols-2 gap-4">
              <div className="card-lime col-span-2">
                <p className="text-5xl font-display font-bold text-primary-foreground mb-2">🇨🇱</p>
                <p className="text-primary-foreground/80">Envío a todo Chile</p>
              </div>
              <div className="bg-foreground text-background rounded-3xl p-6">
                <p className="text-3xl font-display font-bold mb-1">2hrs</p>
                <p className="text-sm opacity-70">tiempo de respuesta</p>
              </div>
              <div className="bg-muted rounded-3xl p-6">
                <p className="text-3xl font-display font-bold text-foreground mb-1">24/7</p>
                <p className="text-sm text-muted-foreground">WhatsApp activo</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;