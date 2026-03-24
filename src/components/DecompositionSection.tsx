import { useEffect, useRef, useState } from 'react';
import AnimatedSection from './AnimatedSection';

const stages = [
  { day: 0, label: 'Día 0', title: 'Lista para enviar', desc: 'Tu bolsa ORBITA nueva, con doble sello' },
  { day: 30, label: 'Día 30', title: 'Comienza el proceso', desc: 'Fragmentación inicial en tu compost' },
  { day: 90, label: 'Día 90', title: 'Degradación activa', desc: 'Se integra al compost de tu jardín' },
  { day: 180, label: 'Día 180', title: 'Solo nutrientes', desc: 'Vuelve a la tierra, sin planta industrial' },
];

const GrowingPlant = ({ progress }: { progress: number }) => {
  // Stem grows from bottom
  const stemHeight = Math.min(progress * 1.3, 1) * 200;
  // Leaves appear at different progress stages
  const leaf1Opacity = Math.max(0, Math.min((progress - 0.15) * 4, 1));
  const leaf2Opacity = Math.max(0, Math.min((progress - 0.3) * 4, 1));
  const leaf3Opacity = Math.max(0, Math.min((progress - 0.45) * 4, 1));
  const leaf4Opacity = Math.max(0, Math.min((progress - 0.6) * 4, 1));
  const flowerOpacity = Math.max(0, Math.min((progress - 0.75) * 4, 1));
  
  const leaf1Scale = Math.max(0, Math.min((progress - 0.15) * 3, 1));
  const leaf2Scale = Math.max(0, Math.min((progress - 0.3) * 3, 1));
  const leaf3Scale = Math.max(0, Math.min((progress - 0.45) * 3, 1));
  const leaf4Scale = Math.max(0, Math.min((progress - 0.6) * 3, 1));
  const flowerScale = Math.max(0, Math.min((progress - 0.75) * 3, 1));

  // Gentle sway based on progress
  const sway = Math.sin(progress * Math.PI * 3) * 2;

  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.05))' }}>
      {/* Background circle */}
      <circle cx="200" cy="200" r="190" fill="hsl(var(--muted))" />
      
      {/* Soil/earth at bottom */}
      <ellipse 
        cx="200" cy="320" rx={60 + progress * 20} ry={12 + progress * 5} 
        fill="hsl(33, 30%, 35%)" 
        opacity={0.6 + progress * 0.4}
        className="transition-all duration-700"
      />
      {/* Soil texture dots */}
      {progress > 0.05 && (
        <>
          <circle cx="175" cy="318" r="3" fill="hsl(33, 25%, 28%)" opacity={progress} />
          <circle cx="210" cy="322" r="2.5" fill="hsl(33, 25%, 28%)" opacity={progress} />
          <circle cx="195" cy="315" r="2" fill="hsl(33, 25%, 28%)" opacity={progress} />
          <circle cx="225" cy="319" r="2" fill="hsl(33, 25%, 28%)" opacity={progress} />
        </>
      )}

      {/* Main stem */}
      <g transform={`translate(${sway}, 0)`}>
        <path
          d={`M200,320 Q${198 + sway},${320 - stemHeight * 0.5} ${200 + sway * 0.5},${320 - stemHeight}`}
          stroke="hsl(var(--primary))"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          className="transition-all duration-700"
          style={{ strokeDasharray: 300, strokeDashoffset: 300 - (stemHeight / 200) * 300 }}
        />

        {/* Leaf pair 1 - small, low */}
        <g 
          transform={`translate(200, 280) scale(${leaf1Scale})`} 
          opacity={leaf1Opacity}
          className="transition-all duration-500"
        >
          <path d="M0,0 Q-25,-15 -35,-5 Q-25,5 0,0" fill="hsl(var(--primary))" opacity="0.8" />
          <path d="M0,0 Q-17,-8 -35,-5" stroke="hsl(90, 50%, 30%)" strokeWidth="0.5" fill="none" />
        </g>
        <g 
          transform={`translate(200, 275) scale(${leaf1Scale})`} 
          opacity={leaf1Opacity}
          className="transition-all duration-500"
        >
          <path d="M0,0 Q20,-18 32,-8 Q22,2 0,0" fill="hsl(90, 55%, 45%)" opacity="0.9" />
          <path d="M0,0 Q15,-10 32,-8" stroke="hsl(90, 50%, 30%)" strokeWidth="0.5" fill="none" />
        </g>

        {/* Leaf pair 2 - medium */}
        <g 
          transform={`translate(${200 + sway * 0.3}, 245) scale(${leaf2Scale})`} 
          opacity={leaf2Opacity}
          className="transition-all duration-500"
        >
          <path d="M0,0 Q-30,-20 -42,-8 Q-30,8 0,0" fill="hsl(90, 60%, 40%)" opacity="0.85" />
          <path d="M0,0 Q-20,-12 -42,-8" stroke="hsl(90, 50%, 28%)" strokeWidth="0.5" fill="none" />
        </g>
        <g 
          transform={`translate(${200 + sway * 0.3}, 240) scale(${leaf2Scale})`} 
          opacity={leaf2Opacity}
          className="transition-all duration-500"
        >
          <path d="M0,0 Q28,-22 40,-10 Q28,6 0,0" fill="hsl(var(--primary))" opacity="0.8" />
          <path d="M0,0 Q18,-14 40,-10" stroke="hsl(90, 50%, 28%)" strokeWidth="0.5" fill="none" />
        </g>

        {/* Leaf pair 3 - larger */}
        <g 
          transform={`translate(${200 + sway * 0.5}, 200) scale(${leaf3Scale})`} 
          opacity={leaf3Opacity}
          className="transition-all duration-500"
        >
          <path d="M0,0 Q-35,-25 -48,-12 Q-35,10 0,0" fill="hsl(90, 55%, 42%)" opacity="0.9" />
          <path d="M0,0 Q-22,-15 -48,-12" stroke="hsl(90, 50%, 28%)" strokeWidth="0.5" fill="none" />
        </g>
        <g 
          transform={`translate(${200 + sway * 0.5}, 195) scale(${leaf3Scale})`} 
          opacity={leaf3Opacity}
          className="transition-all duration-500"
        >
          <path d="M0,0 Q32,-28 48,-14 Q32,8 0,0" fill="hsl(var(--primary))" opacity="0.75" />
          <path d="M0,0 Q20,-18 48,-14" stroke="hsl(90, 50%, 28%)" strokeWidth="0.5" fill="none" />
        </g>

        {/* Leaf pair 4 - top leaves */}
        <g 
          transform={`translate(${200 + sway * 0.7}, 160) scale(${leaf4Scale})`} 
          opacity={leaf4Opacity}
          className="transition-all duration-500"
        >
          <path d="M0,0 Q-28,-30 -40,-18 Q-28,5 0,0" fill="hsl(90, 60%, 45%)" opacity="0.9" />
          <path d="M0,0 Q28,-30 40,-18 Q28,5 0,0" fill="hsl(var(--primary))" opacity="0.85" />
        </g>

        {/* Flower/bloom at top */}
        <g 
          transform={`translate(${200 + sway * 0.8}, ${320 - stemHeight}) scale(${flowerScale})`} 
          opacity={flowerOpacity}
          className="transition-all duration-700"
        >
          {/* Petals */}
          <circle cx="0" cy="-12" r="6" fill="hsl(90, 60%, 50%)" opacity="0.6" />
          <circle cx="-10" cy="-5" r="6" fill="hsl(90, 55%, 45%)" opacity="0.5" />
          <circle cx="10" cy="-5" r="6" fill="hsl(90, 55%, 45%)" opacity="0.5" />
          <circle cx="-6" cy="5" r="5" fill="hsl(90, 50%, 40%)" opacity="0.4" />
          <circle cx="6" cy="5" r="5" fill="hsl(90, 50%, 40%)" opacity="0.4" />
          {/* Center */}
          <circle cx="0" cy="-3" r="4" fill="hsl(50, 80%, 55%)" />
        </g>
      </g>

      {/* Nutrient particles floating up */}
      {progress > 0.3 && (
        <>
          <circle cx="170" cy={300 - progress * 120} r="2" fill="hsl(var(--primary))" opacity={0.3 * progress}>
            <animate attributeName="cy" from={String(300 - progress * 100)} to={String(280 - progress * 120)} dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.4" to="0" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="230" cy={310 - progress * 130} r="1.5" fill="hsl(var(--primary))" opacity={0.2 * progress}>
            <animate attributeName="cy" from={String(310 - progress * 110)} to={String(290 - progress * 130)} dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.3" to="0" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="190" cy={295 - progress * 110} r="1.8" fill="hsl(50, 70%, 50%)" opacity={0.25 * progress}>
            <animate attributeName="cy" from={String(295 - progress * 90)} to={String(275 - progress * 110)} dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.35" to="0" dur="3.5s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
};

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
              <span className="tag-outline mb-4 inline-block">Compostaje domiciliario</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold mb-6">
                De bolsa a <span className="text-primary">tierra</span> en tu jardín
              </h2>
              <p className="text-lg text-muted-foreground mb-12">
                Tu bolsa ORBITA se composta en casa en solo 180 días. Sin planta industrial, 
                sin microplásticos. Solo nutrientes para el suelo.
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

          {/* Right: Growing plant visual */}
          <AnimatedSection delay={200}>
            <div className="relative">
              <GrowingPlant progress={progress} />
              {/* Day counter overlay */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
                <p className="text-4xl md:text-5xl font-display font-bold text-foreground">
                  {Math.round(progress * 180)}
                </p>
                <p className="text-sm text-muted-foreground font-medium">días en tu jardín</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default DecompositionSection;
