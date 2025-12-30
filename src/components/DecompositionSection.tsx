import { useEffect, useRef, useState } from 'react';
import AnimatedSection from './AnimatedSection';

const stages = [
  { day: 0, label: 'Día 0', description: 'Bolsa intacta' },
  { day: 30, label: 'Día 30', description: 'Comienza fragmentación' },
  { day: 90, label: 'Día 90', description: 'Degradación activa' },
  { day: 180, label: 'Día 180', description: 'Solo nutrientes' },
];

const DecompositionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const start = window.innerHeight * 0.8;
      const end = -rect.height * 0.5;
      if (rect.top <= start && rect.top >= end) {
        const newProgress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);
        setProgress(newProgress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentStageIndex = Math.floor(progress * (stages.length - 0.01));

  return (
    <section id="sustentabilidad" ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="tag-primary mb-4 inline-block">Sustentabilidad</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold mb-6">
              De bolsa a <span className="text-primary italic">nutrientes</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {stages.map((stage, i) => (
                <span key={i} className={`text-xs font-medium ${i <= currentStageIndex ? 'text-primary' : 'text-muted-foreground'}`}>
                  {stage.label}
                </span>
              ))}
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>

          <div className="soft-card p-8 md:p-12">
            <div className="aspect-video rounded-2xl bg-secondary/50 relative overflow-hidden flex items-center justify-center">
              <div
                className="relative transition-all duration-700"
                style={{ opacity: 1 - progress * 0.5, transform: `scale(${1 - progress * 0.3})` }}
              >
                <div className="w-40 h-52 md:w-56 md:h-72 rounded-3xl bg-primary/80" />
              </div>
              {progress > 0.6 && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-accent/40 to-transparent transition-all duration-700"
                  style={{ height: `${(progress - 0.6) * 250}%`, opacity: (progress - 0.6) * 2.5 }}
                />
              )}
            </div>
            <div className="mt-8 text-center">
              <h3 className="font-display font-semibold text-2xl mb-2">{stages[currentStageIndex].label}</h3>
              <p className="text-muted-foreground">{stages[currentStageIndex].description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DecompositionSection;