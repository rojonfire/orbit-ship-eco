import { Leaf, Shield, RotateCcw, ArrowUpRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const features = [
  {
    icon: Leaf,
    title: 'Compostable en casa',
    description: 'Certificación OK Compost HOME. Se compostan en tu jardín en 180 días, sin necesidad de planta industrial. Cero microplásticos.',
    color: 'lime' as const,
  },
  {
    icon: Shield,
    title: 'Resistente de verdad',
    description: 'Soporta peso, humedad y la logística real chilena sin romperse. Probada en envíos a todo Chile.',
    color: 'sky' as const,
  },
  {
    icon: RotateCcw,
    title: 'Doble sello adhesivo',
    description: 'Tu cliente puede devolver con la misma bolsa. Envío, devolución y luego compostaje: un ciclo completo y sustentable.',
    color: 'forest' as const,
  },
];

const colorClasses = {
  lime: 'bg-primary text-primary-foreground',
  sky: 'bg-sky text-white',
  forest: 'bg-forest text-white',
};

const WhyOrbita = () => {
  return (
    <section id="beneficios" className="py-12 md:py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="max-w-2xl mb-16">
            <span className="tag-outline mb-4 inline-block">Beneficios</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold mb-6">
              Bolsas compostables con <span className="text-primary">doble sello</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Compostables en casa, aptas para devolución y diseñadas para el ecommerce en Chile.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={100 + index * 100}>
              <div className={`${colorClasses[feature.color]} rounded-3xl p-8 h-full group transition-transform duration-300 hover:-translate-y-1`}>
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <ArrowUpRight className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h3 className="text-2xl font-display font-semibold mb-4">
                  {feature.title}
                </h3>
                <p className="opacity-80 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Trust badges */}
        <AnimatedSection delay={400}>
          <div className="mt-16 max-w-3xl mx-auto bg-card rounded-3xl border border-border shadow-sm p-8">
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Certificación', value: 'OK Compost HOME' },
                { label: 'Norma', value: 'EN 13432' },
                { label: 'Origen', value: '100% Chile' },
              ].map((badge, i) => (
                <div key={i} className="text-center">
                  <p className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-foreground">{badge.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{badge.label}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default WhyOrbita;
