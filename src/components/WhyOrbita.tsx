import { AnimatedSection } from "./AnimatedSection";
import { Leaf, Shield, Truck, Zap } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "100% compostable",
    description: "Se descompone en 180 días en condiciones de compostaje industrial. Cero microplásticos.",
    gradient: "from-primary to-glow-cyan",
  },
  {
    icon: Shield,
    title: "Resistente de verdad",
    description: "Diseñada para la logística real. Soporta peso, humedad y traslado sin romperse.",
    gradient: "from-glow-secondary to-primary",
  },
  {
    icon: Truck,
    title: "Hecha para Chile",
    description: "Pensada para las condiciones logísticas locales. Envíos a todo el país.",
    gradient: "from-glow-cyan to-glow-secondary",
  },
];

export function WhyOrbita() {
  return (
    <section id="por-que-orbita" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-glow-secondary/10 rounded-full blur-[180px]" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="text-foreground">Por qué </span>
              <span className="gradient-text">ORBITA BAGS</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No es solo sustentable. Es una bolsa que funciona.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={index * 150}>
              <div className="group relative h-full">
                {/* Hover glow effect */}
                <div className={cn(
                  "absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl",
                  `bg-gradient-to-r ${feature.gradient}`
                )} style={{ opacity: 0.15 }} />
                
                <div className="relative glass rounded-3xl p-8 h-full border border-border/50 group-hover:border-primary/30 transition-all duration-500">
                  {/* Icon with glow */}
                  <div className={cn(
                    "relative w-16 h-16 rounded-2xl flex items-center justify-center mb-8 overflow-hidden",
                    "bg-gradient-to-br",
                    feature.gradient
                  )}>
                    <feature.icon className="w-8 h-8 text-primary-foreground relative z-10" />
                  </div>
                  
                  <h3 className="font-display text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}