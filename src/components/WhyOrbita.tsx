import { AnimatedSection } from "./AnimatedSection";
import { Leaf, Shield, Truck } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "100% compostable",
    description: "Se descompone en 180 días en condiciones de compostaje industrial. Sin microplásticos.",
  },
  {
    icon: Shield,
    title: "Resistente de verdad",
    description: "Diseñada para la logística real. Soporta el peso, la humedad y el traslado sin romperse.",
  },
  {
    icon: Truck,
    title: "Hecha para Chile",
    description: "Pensada para las condiciones logísticas locales. Envíos a todo el país.",
  },
];

export function WhyOrbita() {
  return (
    <section id="por-que-orbita" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Por qué ORBITA BAGS
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No es solo sustentable. Es una bolsa que funciona.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={index * 100}>
              <div className="bg-card rounded-3xl p-8 h-full border border-border/50">
                <div className="w-14 h-14 bg-electric-light rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}