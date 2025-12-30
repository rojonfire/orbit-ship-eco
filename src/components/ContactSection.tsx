import { AnimatedSection } from "./AnimatedSection";
import { Phone, MessageCircle } from "lucide-react";

export function ContactSection() {
  return (
    <section id="contacto" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              ¿Necesitas ayuda para elegir?
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <p className="text-lg text-muted-foreground mb-10">
              Conversemos. Te ayudamos a encontrar la bolsa perfecta para tu negocio, 
              ya sea básica o personalizada.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://calendly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto justify-center"
              >
                <Phone className="w-5 h-5" />
                Agendar una llamada
              </a>
              <a
                href="https://wa.me/56912345678?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20sobre%20las%20bolsas%20ORBITA"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-[hsl(142,70%,45%)] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[hsl(142,70%,40%)] transition-colors w-full sm:w-auto justify-center"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <p className="text-sm text-muted-foreground mt-8">
              Respondemos en menos de 24 horas hábiles
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}