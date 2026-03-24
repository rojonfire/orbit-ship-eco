import { useEffect, useRef, useState, useCallback } from 'react';
import AnimatedSection from './AnimatedSection';

const stages = [
  { day: 0, label: 'Día 0', title: 'Lista para enviar', desc: 'Tu bolsa ORBITA nueva, con doble sello' },
  { day: 30, label: 'Día 30', title: 'Comienza el proceso', desc: 'Fragmentación inicial en tu compost' },
  { day: 90, label: 'Día 90', title: 'Degradación activa', desc: 'Se integra al compost de tu jardín' },
  { day: 180, label: 'Día 180', title: 'Solo nutrientes', desc: 'Vuelve a la tierra, sin planta industrial' },
];

const useAnimatedTime = () => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.02), 30);
    return () => clearInterval(interval);
  }, []);
  return time;
};

const Leaf = ({ x, y, scale, opacity, angle, d, fill }: {
  x: number; y: number; scale: number; opacity: number; angle: number; d: string; fill: string;
}) => (
  <g transform={`translate(${x}, ${y}) rotate(${angle}) scale(${scale})`} opacity={opacity}>
    <path d={d} fill={fill} />
  </g>
);

const GrowingPlant = ({ progress, isWow }: { progress: number; isWow: boolean }) => {
  const time = useAnimatedTime();
  
  const stemHeight = Math.min(progress * 1.3, 1) * 200;
  const sway = Math.sin(time * 1.5) * 3;
  
  const leafAppear = (t: number) => Math.max(0, Math.min((progress - t) * 4, 1));
  const l1 = leafAppear(0.1);
  const l2 = leafAppear(0.25);
  const l3 = leafAppear(0.4);
  const l4 = leafAppear(0.55);
  const l5 = leafAppear(0.65);

  const wowProgress = Math.max(0, Math.min((progress - 0.8) * 5, 1));
  const wowScale = 1 + wowProgress * 0.15;
  const stemTopY = 340 - stemHeight;

  return (
    <svg viewBox="0 0 400 420" className="w-full h-full">
      {/* Background circle */}
      <circle cx="200" cy="210" r="195" fill="hsl(var(--muted))" />
      
      {/* Wow glow ring */}
      {isWow && wowProgress > 0 && (
        <>
          <circle cx="200" cy="210" r="195" fill="none" stroke="hsl(var(--primary))" strokeWidth={wowProgress * 3} opacity={wowProgress * 0.2} />
          <circle cx="200" cy="210" r="195" fill="none" stroke="hsl(var(--primary))" strokeWidth={wowProgress * 1.5} opacity={wowProgress * 0.15}>
            <animate attributeName="r" from="195" to="225" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.2" to="0" dur="2s" repeatCount="indefinite" />
          </circle>
        </>
      )}
      
      {/* Soil */}
      <ellipse cx="200" cy="340" rx={55 + progress * 25} ry={10 + progress * 6} fill="hsl(33, 30%, 35%)" opacity={0.5 + progress * 0.5} />
      <circle cx="178" cy="338" r="3" fill="hsl(33, 25%, 28%)" opacity={progress * 0.7} />
      <circle cx="212" cy="342" r="2.5" fill="hsl(33, 25%, 28%)" opacity={progress * 0.7} />
      <circle cx="228" cy="339" r="2" fill="hsl(33, 25%, 28%)" opacity={progress * 0.5} />

      {/* Roots */}
      {progress > 0.05 && (
        <g opacity={Math.min(progress * 2, 0.4)}>
          <path d="M200,340 Q185,355 170,360" stroke="hsl(33, 25%, 40%)" strokeWidth="1.5" fill="none" />
          <path d="M200,340 Q210,358 230,362" stroke="hsl(33, 25%, 40%)" strokeWidth="1.5" fill="none" />
          <path d="M200,342 Q195,360 185,368" stroke="hsl(33, 25%, 40%)" strokeWidth="1" fill="none" />
        </g>
      )}

      {/* Stem */}
      <path
        d={`M200,340 C${198 + sway * 0.3},${340 - stemHeight * 0.3} ${202 + sway * 0.6},${340 - stemHeight * 0.7} ${200 + sway},${stemTopY}`}
        stroke="hsl(110, 35%, 35%)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M200,340 C${198 + sway * 0.3},${340 - stemHeight * 0.3} ${202 + sway * 0.6},${340 - stemHeight * 0.7} ${200 + sway},${stemTopY}`}
        stroke="hsl(110, 40%, 45%)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Leaves using SVG transforms */}
      <Leaf x={200 + sway * 0.2} y={300} scale={l1} opacity={l1} angle={-10 + sway * 2}
        d="M0,0 Q15,-20 30,-12 Q18,0 0,0" fill="hsl(100, 50%, 45%)" />
      
      <Leaf x={200 + sway * 0.3} y={275} scale={l2} opacity={l2} angle={5 - sway * 2}
        d="M0,0 Q-25,-22 -40,-10 Q-25,8 0,0" fill="hsl(90, 55%, 42%)" />
      
      <Leaf x={200 + sway * 0.5} y={245} scale={l3} opacity={l3} angle={-8 + sway * 2.5}
        d="M0,0 Q30,-28 48,-15 Q30,6 0,0" fill="hsl(95, 55%, 42%)" />
      
      <Leaf x={200 + sway * 0.6} y={215} scale={l4} opacity={l4} angle={6 - sway * 3}
        d="M0,0 Q-35,-30 -52,-15 Q-35,10 0,0" fill="hsl(90, 60%, 40%)" />

      {/* Top leaf pair */}
      <g transform={`translate(${200 + sway * 0.7}, 180) scale(${l5})`} opacity={l5}>
        <path d="M0,0 Q-22,-28 -35,-16 Q-22,4 0,0" fill="hsl(95, 55%, 45%)" />
        <path d="M0,0 Q22,-28 35,-16 Q22,4 0,0" fill="hsl(90, 60%, 40%)" />
      </g>

      {/* Small vein lines on visible leaves */}
      {l2 > 0.5 && (
        <g transform={`translate(${200 + sway * 0.3}, 275) scale(${l2})`} opacity={l2 * 0.5}>
          <path d="M0,0 Q-18,-14 -40,-10" stroke="hsl(90, 40%, 28%)" strokeWidth="0.6" fill="none" />
        </g>
      )}
      {l3 > 0.5 && (
        <g transform={`translate(${200 + sway * 0.5}, 245) scale(${l3})`} opacity={l3 * 0.5}>
          <path d="M0,0 Q22,-18 48,-15" stroke="hsl(90, 40%, 28%)" strokeWidth="0.6" fill="none" />
        </g>
      )}

      {/* WOW BLOOM */}
      {wowProgress > 0 && (
        <g transform={`translate(${200 + sway}, ${stemTopY}) scale(${wowProgress * wowScale})`} opacity={wowProgress}>
          {/* Outer petals */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <ellipse key={angle} cx="0" cy="-20" rx="7" ry="16"
              fill={angle % 90 === 0 ? "hsl(90, 55%, 50%)" : "hsl(95, 60%, 55%)"}
              opacity={0.7} transform={`rotate(${angle})`} />
          ))}
          {/* Inner petals */}
          {[22, 67, 112, 157, 202, 247, 292, 337].map((angle) => (
            <ellipse key={`i-${angle}`} cx="0" cy="-12" rx="4" ry="10"
              fill="hsl(90, 65%, 58%)" opacity={0.5} transform={`rotate(${angle})`} />
          ))}
          {/* Center */}
          <circle cx="0" cy="0" r="7" fill="hsl(50, 85%, 55%)" />
          <circle cx="0" cy="0" r="4" fill="hsl(45, 90%, 62%)" />
          
          {/* Sparkles */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const dist = 32 + Math.sin(time * 2 + i) * 5;
            return (
              <circle key={`s-${angle}`}
                cx={Math.cos(rad) * dist} cy={Math.sin(rad) * dist}
                r={1.5 + Math.sin(time * 3 + i) * 0.8}
                fill="hsl(50, 80%, 60%)"
                opacity={0.3 + Math.sin(time * 4 + i) * 0.25} />
            );
          })}
        </g>
      )}

      {/* Floating particles */}
      {progress > 0.2 && (
        <>
          {[
            { cx: 165, delay: 0 }, { cx: 235, delay: 1.2 },
            { cx: 185, delay: 0.6 }, { cx: 220, delay: 2 },
          ].map((p, i) => (
            <circle key={`p-${i}`} cx={p.cx} cy="330" r={2} fill={i % 2 === 0 ? "hsl(90, 55%, 50%)" : "hsl(50, 70%, 50%)"} opacity="0">
              <animate attributeName="cy" from="330" to="180" dur={`${3.5 + p.delay}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.35;0" dur={`${3.5 + p.delay}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </>
      )}

      {/* Burst particles during WOW */}
      {isWow && wowProgress > 0.3 && (
        <>
          {Array.from({ length: 10 }).map((_, i) => {
            const angle = (i * 36 * Math.PI) / 180;
            const dist = 50 + wowProgress * 70;
            return (
              <circle key={`b-${i}`}
                cx={200 + sway + Math.cos(angle) * dist}
                cy={stemTopY + Math.sin(angle) * dist}
                r={1.5 + Math.sin(time * 3 + i)}
                fill={i % 3 === 0 ? "hsl(90, 55%, 50%)" : i % 3 === 1 ? "hsl(50, 80%, 55%)" : "hsl(95, 55%, 50%)"}
                opacity={wowProgress * (0.25 + Math.sin(time * 2 + i) * 0.15)} />
            );
          })}
        </>
      )}
    </svg>
  );
};

const DecompositionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [animationStarted, setAnimationStarted] = useState(false);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const ANIM_DURATION = 8000;

  // Detect when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animationStarted) {
          startAnimation();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationStarted]);

  const startAnimation = useCallback(() => {
    setAnimationStarted(true);
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const linear = Math.min(elapsed / ANIM_DURATION, 1);
      
      // Ease: slow start, steady middle, dramatic burst at end
      let eased: number;
      if (linear < 0.7) {
        eased = (linear / 0.7) * 0.75;
      } else {
        const burst = (linear - 0.7) / 0.3;
        eased = 0.75 + burst * burst * 0.25;
      }
      
      setProgress(eased);
      if (linear < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const currentStageIndex = Math.min(Math.floor(progress * stages.length), stages.length - 1);
  const isWow = progress > 0.85;
  const currentDay = Math.round(progress * 180);

  const handleReplay = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setProgress(0);
    setAnimationStarted(false);
    setTimeout(() => {
      startAnimation();
    }, 150);
  }, [startAnimation]);

  return (
    <section id="proceso" ref={sectionRef} className="py-12 md:py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <div>
            <AnimatedSection>
              <span className="tag-outline mb-3 inline-block">Compostaje domiciliario</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold mb-4">
                De bolsa a <span className="text-primary">tierra</span> en tu jardín
              </h2>
              <p className="text-base lg:text-lg text-muted-foreground mb-6 lg:mb-10">
                Tu bolsa ORBITA se composta en casa en solo 180 días. Sin planta industrial, 
                sin microplásticos. Solo nutrientes para el suelo.
              </p>
            </AnimatedSection>

            {/* Timeline */}
            <div className="space-y-3 lg:space-y-4">
              {stages.map((stage, index) => (
                <AnimatedSection key={stage.day} delay={100 + index * 75}>
                  <div 
                    className={`flex items-start gap-3 p-3 rounded-2xl transition-all duration-500 ${
                      index <= currentStageIndex ? 'bg-muted' : ''
                    }`}
                  >
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-500 ${
                        index <= currentStageIndex 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {stage.day}
                    </div>
                    <div>
                      <p className={`font-semibold text-sm lg:text-base transition-colors duration-500 ${
                        index <= currentStageIndex ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {stage.title}
                      </p>
                      <p className="text-xs lg:text-sm text-muted-foreground">{stage.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Right: Growing plant visual */}
          <AnimatedSection delay={200}>
            <div className="relative cursor-pointer group max-w-md mx-auto" onClick={handleReplay} title="Click para repetir">
              <GrowingPlant progress={progress} isWow={isWow} />
              <div className={`absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 text-center transition-all duration-700 ${isWow ? 'scale-110' : ''}`}>
                <p className={`font-display font-bold transition-all duration-700 ${isWow ? 'text-4xl lg:text-5xl text-primary' : 'text-3xl lg:text-4xl text-foreground'}`}>
                  {currentDay}
                </p>
                <p className="text-xs lg:text-sm text-muted-foreground font-medium">
                  {isWow ? '¡Volvió a la tierra! 🌱' : 'días en tu jardín'}
                </p>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-60 transition-opacity text-xs text-muted-foreground">
                ↻ Repetir
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default DecompositionSection;
