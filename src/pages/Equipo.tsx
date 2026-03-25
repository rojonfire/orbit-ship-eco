import { Link } from "react-router-dom";
import { ArrowLeft, Linkedin, Instagram, Twitter } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SEOHead from "@/components/SEOHead";
import teamRaimundo from "@/assets/team-raimundo.webp";

interface TeamMember {
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

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Raimundo Vives",
    role: "CSO (Chief Sales Officer)",
    description: "Ingeniero Civil Industrial con mención en Medio Ambiente. Lidera la estrategia comercial de Orbita, conectando a empresas con soluciones de packaging sustentable.",
    image: teamRaimundo,
    socials: {
      linkedin: "https://www.linkedin.com/in/raimundo-vives/",
    },
  },
];

const Equipo = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Nuestro Equipo | ORBITA BAGS - Packaging sustentable en Chile"
        description="Conoce al equipo detrás de ORBITA BAGS. Profesionales apasionados por la sustentabilidad y el packaging ecológico para ecommerce en Chile."
        path="/equipo"
      />
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                Conoce al equipo
              </span>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2 mb-4">
                Nuestro Equipo
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Somos un equipo apasionado por crear soluciones de empaque que cuiden el planeta. 
                Unidos por la misión de hacer que cada envío sea una oportunidad para nutrir la tierra.
              </p>
            </div>
          </AnimatedSection>

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

          <div className="grid md:grid-cols-2 gap-8">
            {TEAM_MEMBERS.map((member, index) => (
              <AnimatedSection key={member.name} delay={150 + index * 100}>
                <div className="bg-card rounded-3xl border border-border p-8 hover:border-primary/30 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="shrink-0">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-32 h-32 rounded-2xl object-cover mx-auto sm:mx-0"
                        loading="lazy"
                        width={128}
                        height={128}
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-xl font-display font-bold text-foreground">
                        {member.name}
                      </h3>
                      <p className="text-primary font-medium mb-3">
                        {member.role}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {member.description}
                      </p>
                      <div className="flex gap-3 justify-center sm:justify-start">
                        {member.socials.linkedin && (
                          <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        {member.socials.instagram && (
                          <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                        {member.socials.twitter && (
                          <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
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

          <AnimatedSection delay={600}>
            <div className="mt-16 text-center bg-primary/10 rounded-3xl p-12 border border-primary/20">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                ¿Quieres unirte a nuestra misión?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Siempre estamos buscando personas apasionadas por la sustentabilidad. 
                Contáctanos si quieres ser parte del cambio.
              </p>
              <a
                href="mailto:orbitabagscontacto@gmail.com"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                Contáctanos
              </a>
            </div>
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Equipo;
