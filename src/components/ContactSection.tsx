import { MessageCircle, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedSection from './AnimatedSection';

const ContactSection = () => {
  return (
    <section id="contacto" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="soft-card p-8 md:p-12 lg:p-16 text-center">
              <span className="tag mb-6 inline-block">Contacto</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold mb-6">
                ¿Necesitas ayuda para <span className="text-primary italic">elegir</span>?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
                Nuestro equipo te guiará para encontrar la solución perfecta.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="rounded-full px-8 btn-lift group">
                  <MessageCircle className="mr-2 w-5 h-5" />
                  WhatsApp
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 btn-lift">
                  <Calendar className="mr-2 w-5 h-5" />
                  Agendar llamada
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;