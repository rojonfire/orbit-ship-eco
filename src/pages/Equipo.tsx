import { Link } from "react-router-dom";
import { ArrowLeft, Linkedin, Instagram, Twitter } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

interface CoFounder {
  name: string;
  role: string;
  description: string;
  image: string;
  socials: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
  };
}

const CO_FOUNDERS: CoFounder[] = [
  {
    name: "Nombre Fundador 1",
    role: "CEO & Co-Fundador",
    description: "Apasionado por la sustentabilidad y el emprendimiento. Con más de 10 años de experiencia en el sector de packaging, lidera la visión de Orbita hacia un futuro más verde.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    socials: {
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
  },
  {
    name: "Nombre Fundador 2",
    role: "COO & Co-Fundadora",
    description: "Experta en operaciones y cadena de suministro sostenible. Se encarga de que cada bolsa llegue a tiempo y con el menor impacto ambiental posible.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    name: "Nombre Fundador 3",
    role: "CTO & Co-Fundador",
    description: "Ingeniero de materiales especializado en biopolímeros. Desarrolló la fórmula única que hace que nuestras bolsas se degraden en solo 180 días.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    socials: {
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
    },
  },
  {
    name: "Nombre Fundador 4",
    role: "CMO & Co-Fundadora",
    description: "Estratega de marca con experiencia en startups de impacto. Conecta a Orbita con empresas que quieren hacer la diferencia en el mundo.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    socials: {
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
  },
];

const Equipo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          {/* Header */}
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                Conoce al equipo
              </span>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2 mb-4">
                Los Co-Fundadores
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Somos un equipo apasionado por crear soluciones de empaque que cuiden el planeta. 
                Unidos por la misión de hacer que cada envío sea una oportunidad para nutrir la tierra.
              </p>
            </div>
          </AnimatedSection>

          {/* Team Photo */}
          <AnimatedSection delay={100}>
            <div className="mb-16 rounded-3xl overflow-hidden border border-border">
              <div className="aspect-[21/9] bg-secondary/30 flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="text-muted-foreground text-lg">
                    📸 Foto del equipo completo
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-2">
                    Sube una imagen de todo el equipo aquí
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Co-Founders Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {CO_FOUNDERS.map((founder, index) => (
              <AnimatedSection key={founder.name} delay={150 + index * 100}>
                <div className="bg-card rounded-3xl border border-border p-8 hover:border-primary/30 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Image */}
                    <div className="shrink-0">
                      <img
                        src={founder.image}
                        alt={founder.name}
                        className="w-32 h-32 rounded-2xl object-cover mx-auto sm:mx-0"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-xl font-display font-bold text-foreground">
                        {founder.name}
                      </h3>
                      <p className="text-primary font-medium mb-3">
                        {founder.role}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {founder.description}
                      </p>

                      {/* Social Links */}
                      <div className="flex gap-3 justify-center sm:justify-start">
                        {founder.socials.linkedin && (
                          <a
                            href={founder.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        {founder.socials.instagram && (
                          <a
                            href={founder.socials.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                        {founder.socials.twitter && (
                          <a
                            href={founder.socials.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Twitter className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* CTA */}
          <AnimatedSection delay={600}>
            <div className="mt-16 text-center bg-primary/10 rounded-3xl p-12 border border-primary/20">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                ¿Quieres unirte a nuestra misión?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Siempre estamos buscando personas apasionadas por la sustentabilidad. 
                Contáctanos si quieres ser parte del cambio.
              </p>
              <Link
                to="/#contacto"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                Contáctanos
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Equipo;
