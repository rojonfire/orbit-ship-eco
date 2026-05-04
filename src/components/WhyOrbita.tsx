import { Leaf, Shield, RotateCcw, ArrowUpRight, Check } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const features = [
  {
    icon: Leaf,
    title: 'Compostables en casa, sin plantas industriales',
    description: 'Tu cliente las puede compostar en su jardín o macetero en 180 días. Cero microplásticos, cero culpa.',
    bullets: [
      'Certificación OK Compost HOME',
      'Se descomponen en 180 días',
      'Vuelven a la tierra como nutrientes',
    ],
    color: 'lime' as const,
    anchor: 'beneficio-compostable',
  },
  {
    icon: Shield,
    title: 'Resistentes para la logística real chilena',
    description: 'Soportan peso, humedad y el manoseo de los couriers. Olvídate de bolsas rotas y reclamos por productos dañados.',
    bullets: [
      'Cumplen norma EN 13432',
      'Aguantan humedad y golpes',
      'Probadas en envíos a todo Chile',
    ],
    color: 'sky' as const,
    anchor: 'beneficio-resistencia',
  },
  {
    icon: RotateCcw,
    title: 'Doble sello: menos fricción en devoluciones',
    description: 'Tu cliente devuelve con la misma bolsa. Menos costos de logística inversa y una experiencia que fideliza.',
    bullets: [
      'Dos adhesivos independientes',
      'Reutilizable para la devolución',
      'Mejora la experiencia post-compra',
    ],
    color: 'forest' as const,
    anchor: 'beneficio-doble-sello',
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
              Resuelven los <span className="text-primary">3 dolores</span> de enviar con bolsas comunes
            </h2>
            <p className="text-lg text-muted-foreground">
              Plástico que contamina, bolsas que se rompen y devoluciones que cuestan caro. ORBITA ataca los tres a la vez.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={100 + index * 100}>
              <div className={`${colorClasses[feature.color]} rounded-3xl p-8 h-full group transition-transform duration-300 hover:-translate-y-1 flex flex-col`}>
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <ArrowUpRight className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-xl md:text-2xl font-display font-semibold mb-4 leading-tight">
                  {feature.title}
                </h3>
                <p className="opacity-80 leading-relaxed mb-6">
                  {feature.description}
                </p>

                <ul className="mt-auto space-y-2 pt-6 border-t border-white/20">
                  {feature.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm opacity-90">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyOrbita;
