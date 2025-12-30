import { useEffect, useRef, useState } from 'react';
import AnimatedSection from './AnimatedSection';
import { Sprout } from 'lucide-react';

const stages = [
  { day: 0, label: 'Día 0', title: 'Lista para enviar', desc: 'Tu bolsa ORBITA nueva' },
  { day: 30, label: 'Día 30', title: 'Comienza el proceso', desc: 'Fragmentación inicial' },
  { day: 90, label: 'Día 90', title: 'Degradación activa', desc: 'Se integra al compost' },
  { day: 180, label: 'Día 180', title: 'Solo nutrientes', desc: 'Vuelve a la tierra' },
];

const DecompositionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const start = window.innerHeight * 0.7;
      const end = -rect.height * 0.3;
      if (rect.top <= start && rect.top >= end) {
        const newProgress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);
        setProgress(newProgress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentStageIndex = Math.min(Math.floor(progress * stages.length), stages.length - 1);

  return (
    <section id="proceso" ref={sectionRef} className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <AnimatedSection>
              <span className="tag-outline mb-4 inline-block">Proceso</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold mb-6">
                De bolsa a <span className="text-primary">tierra</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-12">
                Observa cómo tu bolsa ORBITA completa su ciclo natural en solo 180 días.
              </p>
            </AnimatedSection>

            {/* Timeline */}
            <div className="space-y-6">
              {stages.map((stage, index) => (
                <AnimatedSection key={stage.day} delay={100 + index * 75}>
                  <div 
                    className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 ${
                      index <= currentStageIndex ? 'bg-muted' : ''
                    }`}
                  >
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        index <= currentStageIndex 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {stage.day}
                    </div>
                    <div>
                      <p className={`font-semibold transition-colors duration-300 ${
                        index <= currentStageIndex ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {stage.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{stage.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <AnimatedSection delay={200}>
            <div className="relative">
              {/* Progress circle */}
              <div className="aspect-square rounded-full bg-muted flex items-center justify-center relative overflow-hidden">
                {/* Animated fill */}
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-primary/20 transition-all duration-700"
                  style={{ height: `${progress * 100}%` }}
                />
                
                {/* Center content */}
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                    <Sprout className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <p className="text-5xl md:text-6xl font-display font-bold text-foreground">
                    {Math.round(progress * 180)}
                  </p>
                  <p className="text-muted-foreground">días transcurridos</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default DecompositionSection;