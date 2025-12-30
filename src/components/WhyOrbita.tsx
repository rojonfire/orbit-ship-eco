import { Leaf, Shield, Truck } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const features = [
  {
    icon: Leaf,
    title: 'Material compostable',
    description: 'Fabricadas con biopolímeros certificados que se descomponen completamente en 180 días.',
  },
  {
    icon: Shield,
    title: 'Resistentes y seguras',
    description: 'Misma durabilidad que el plástico tradicional. Protegen tus productos durante el envío.',
  },
  {
    icon: Truck,
    title: 'Diseñadas para Chile',
    description: 'Optimizadas para la logística nacional. Compatibles con todos los operadores.',
  },
];

const WhyOrbita = () => {
  return (
    <section id="nosotros" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      <div className="deco-circle w-[400px] h-[400px] -bottom-40 left-1/2 -translate-x-1/2 opacity-30" />
      
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="tag-primary mb-4 inline-block">Por qué elegirnos</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold mb-6">
              Impacto <span className="text-primary italic">real</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={150 + index * 100}>
              <div className="soft-card p-8 h-full group hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyOrbita;