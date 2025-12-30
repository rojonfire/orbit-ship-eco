import { AnimatedSection } from "./AnimatedSection";
import { Phone, MessageCircle, Mail, ArrowUpRight } from "lucide-react";

export function ContactSection() {
  return (
    <section id="contacto" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-glow-secondary/10 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">¿Necesitas ayuda </span>
                <span className="gradient-text">para elegir?</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Conversemos. Te ayudamos a encontrar la bolsa perfecta para tu negocio.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Schedule Call Card */}
              <a
                href="https://calendly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative glass rounded-3xl p-8 glow-border hover:border-primary/50 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-glow-secondary flex items-center justify-center mb-6">
                    <Phone className="w-6 h-6 text-primary-foreground" />
                  </div>
                  
                  <h3 className="font-display text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    Agendar una llamada
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Conversemos sobre tu proyecto y te asesoramos sin compromiso.
                  </p>
                  
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <span>Reservar horario</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </a>

              {/* WhatsApp Card */}
              <a
                href="https://wa.me/56912345678?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20sobre%20las%20bolsas%20ORBITA"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative glass rounded-3xl p-8 glow-border hover:border-[hsl(142,70%,45%)]/50 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(142,70%,45%)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[hsl(142,70%,45%)] flex items-center justify-center mb-6">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="font-display text-2xl font-bold text-foreground mb-3 group-hover:text-[hsl(142,70%,45%)] transition-colors">
                    WhatsApp
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Escríbenos directamente. Respondemos en minutos.
                  </p>
                  
                  <div className="flex items-center gap-2 text-[hsl(142,70%,45%)] font-medium">
                    <span>Enviar mensaje</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </a>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="text-center">
              <p className="text-muted-foreground flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                También puedes escribirnos a{" "}
                <a href="mailto:hola@orbitabags.cl" className="text-primary hover:underline">
                  hola@orbitabags.cl
                </a>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}