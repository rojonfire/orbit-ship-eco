import { useEffect, useRef, useState, useCallback } from 'react';
import AnimatedSection from './AnimatedSection';

const stages = [
  { day: 0, label: 'Día 0', title: 'Lista para enviar', desc: 'Tu bolsa ORBITA nueva, con doble sello' },
  { day: 30, label: 'Día 30', title: 'Comienza el proceso', desc: 'Fragmentación inicial en tu compost' },
  { day: 90, label: 'Día 90', title: 'Degradación activa', desc: 'Se integra al compost de tu jardín' },
  { day: 180, label: 'Día 180', title: 'Solo nutrientes', desc: 'Vuelve a la tierra, sin planta industrial' },
];

const GrowingPlant = ({ progress, isWow }: { progress: number; isWow: boolean }) => {
  const stemHeight = Math.min(progress * 1.3, 1) * 200;
  
  const leafAppear = (threshold: number) => Math.max(0, Math.min((progress - threshold) * 4, 1));
  const leaf1 = leafAppear(0.1);
  const leaf2 = leafAppear(0.25);
  const leaf3 = leafAppear(0.4);
  const leaf4 = leafAppear(0.55);
  const leaf5 = leafAppear(0.65);

  // WOW phase: massive bloom explosion at the end
  const wowProgress = Math.max(0, Math.min((progress - 0.8) * 5, 1));
  const wowScale = isWow ? 1 + wowProgress * 0.8 : 1;
  
  // Continuous gentle sway
  const [time, setTime] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.02), 30);
    return () => clearInterval(interval);
  }, []);
  const sway = Math.sin(time * 1.5) * 3;

  // Burst particles for wow
  const burstParticles = isWow && wowProgress > 0.2;

  return (
    <svg viewBox="0 0 400 420" className="w-full h-full transition-transform duration-1000" style={{ 
      filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.05))',
      transform: `scale(${wowScale})`,
    }}>
      {/* Background circle */}
      <circle cx="200" cy="210" r="195" fill="hsl(var(--muted))" />
      
      {/* Green glow during wow */}
      {isWow && wowProgress > 0 && (
        <circle cx="200" cy="210" r={195 + wowProgress * 30} fill="none" stroke="hsl(var(--primary))" strokeWidth={wowProgress * 3} opacity={wowProgress * 0.3}>
          <animate attributeName="r" from="195" to={String(230)} dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      
      {/* Soil */}
      <ellipse 
        cx="200" cy="340" rx={55 + progress * 25} ry={10 + progress * 6} 
        fill="hsl(33, 30%, 35%)" 
        opacity={0.5 + progress * 0.5}
      />
      <circle cx="178" cy="338" r="3" fill="hsl(33, 25%, 28%)" opacity={progress * 0.7} />
      <circle cx="212" cy="342" r="2.5" fill="hsl(33, 25%, 28%)" opacity={progress * 0.7} />
      <circle cx="195" cy="335" r="2" fill="hsl(33, 25%, 28%)" opacity={progress * 0.6} />
      <circle cx="228" cy="339" r="2" fill="hsl(33, 25%, 28%)" opacity={progress * 0.5} />

      {/* Roots spreading underground */}
      {progress > 0.05 && (
        <g opacity={Math.min(progress * 2, 0.4)}>
          <path d={`M200,340 Q185,355 170,360`} stroke="hsl(33, 25%, 40%)" strokeWidth="1.5" fill="none" />
          <path d={`M200,340 Q210,358 230,362`} stroke="hsl(33, 25%, 40%)" strokeWidth="1.5" fill="none" />
          <path d={`M200,342 Q195,360 185,368`} stroke="hsl(33, 25%, 40%)" strokeWidth="1" fill="none" />
        </g>
      )}

      {/* Main stem with natural curve */}
      <g>
        <path
          d={`M200,340 C${198 + sway * 0.3},${340 - stemHeight * 0.3} ${202 + sway * 0.6},${340 - stemHeight * 0.7} ${200 + sway},${340 - stemHeight}`}
          stroke="hsl(110, 35%, 35%)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          style={{ 
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            strokeDasharray: 400, 
            strokeDashoffset: 400 - (stemHeight / 200) * 400 
          }}
        />
        {/* Thinner inner stem highlight */}
        <path
          d={`M200,340 C${198 + sway * 0.3},${340 - stemHeight * 0.3} ${202 + sway * 0.6},${340 - stemHeight * 0.7} ${200 + sway},${340 - stemHeight}`}
          stroke="hsl(110, 40%, 45%)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          style={{ 
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            strokeDasharray: 400, 
            strokeDashoffset: 400 - (stemHeight / 200) * 400 
          }}
        />

        {/* Leaf 1 - small right */}
        <g style={{ transition: 'all 0.6s ease-out', transform: `translate(${200 + sway * 0.2}px, 300px) scale(${leaf1}) rotate(${-10 + sway * 2}deg)`, transformOrigin: '0 0', opacity: leaf1 }}>
          <path d="M0,0 Q15,-20 30,-12 Q18,0 0,0" fill="hsl(100, 50%, 45%)" />
          <path d="M0,0 Q12,-12 30,-12" stroke="hsl(100, 40%, 32%)" strokeWidth="0.7" fill="none" />
        </g>

        {/* Leaf 2 - medium left */}
        <g style={{ transition: 'all 0.6s ease-out', transform: `translate(${200 + sway * 0.3}px, 275px) scale(${leaf2}) rotate(${5 - sway * 2}deg)`, transformOrigin: '0 0', opacity: leaf2 }}>
          <path d="M0,0 Q-25,-22 -40,-10 Q-25,8 0,0" fill="hsl(var(--primary))" opacity="0.85" />
          <path d="M0,0 Q-18,-14 -40,-10" stroke="hsl(100, 40%, 28%)" strokeWidth="0.7" fill="none" />
        </g>

        {/* Leaf 3 - larger right */}
        <g style={{ transition: 'all 0.6s ease-out', transform: `translate(${200 + sway * 0.5}px, 245px) scale(${leaf3}) rotate(${-8 + sway * 2.5}deg)`, transformOrigin: '0 0', opacity: leaf3 }}>
          <path d="M0,0 Q30,-28 48,-15 Q30,6 0,0" fill="hsl(95, 55%, 42%)" />
          <path d="M0,0 Q22,-18 48,-15" stroke="hsl(100, 40%, 28%)" strokeWidth="0.7" fill="none" />
        </g>

        {/* Leaf 4 - large left */}
        <g style={{ transition: 'all 0.6s ease-out', transform: `translate(${200 + sway * 0.6}px, 210px) scale(${leaf4}) rotate(${6 - sway * 3}deg)`, transformOrigin: '0 0', opacity: leaf4 }}>
          <path d="M0,0 Q-35,-30 -52,-15 Q-35,10 0,0" fill="hsl(var(--primary))" opacity="0.8" />
          <path d="M0,0 Q-25,-20 -52,-15" stroke="hsl(100, 40%, 28%)" strokeWidth="0.7" fill="none" />
        </g>

        {/* Leaf 5 - top pair */}
        <g style={{ transition: 'all 0.6s ease-out', transform: `translate(${200 + sway * 0.7}px, 175px) scale(${leaf5}) rotate(${sway * 2}deg)`, transformOrigin: '0 0', opacity: leaf5 }}>
          <path d="M0,0 Q-22,-28 -35,-16 Q-22,4 0,0" fill="hsl(95, 55%, 45%)" opacity="0.9" />
          <path d="M0,0 Q22,-28 35,-16 Q22,4 0,0" fill="hsl(var(--primary))" opacity="0.85" />
        </g>

        {/* WOW BLOOM - massive flower explosion at day 180 */}
        {wowProgress > 0 && (
          <g style={{ 
            transform: `translate(${200 + sway}px, ${340 - stemHeight}px) scale(${wowProgress})`,
            transformOrigin: '0 0',
            transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
            opacity: wowProgress,
          }}>
            {/* Outer petals - large */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <ellipse
                key={angle}
                cx="0" cy="-22"
                rx="8" ry="18"
                fill={angle % 90 === 0 ? "hsl(var(--primary))" : "hsl(95, 60%, 50%)"}
                opacity={0.7}
                transform={`rotate(${angle})`}
              />
            ))}
            {/* Inner petals */}
            {[20, 70, 120, 170, 220, 270, 320].map((angle) => (
              <ellipse
                key={`inner-${angle}`}
                cx="0" cy="-14"
                rx="5" ry="12"
                fill="hsl(90, 65%, 55%)"
                opacity={0.6}
                transform={`rotate(${angle})`}
              />
            ))}
            {/* Center */}
            <circle cx="0" cy="0" r="8" fill="hsl(50, 85%, 55%)" />
            <circle cx="0" cy="0" r="5" fill="hsl(45, 90%, 60%)" />
            
            {/* Sparkles around flower */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const dist = 35 + Math.sin(time * 2 + i) * 5;
              return (
                <circle
                  key={`sparkle-${angle}`}
                  cx={Math.cos(rad) * dist}
                  cy={Math.sin(rad) * dist}
                  r={2 + Math.sin(time * 3 + i) * 1}
                  fill="hsl(50, 80%, 60%)"
                  opacity={0.4 + Math.sin(time * 4 + i) * 0.3}
                />
              );
            })}
          </g>
        )}
      </g>

      {/* Floating nutrient particles */}
      {progress > 0.2 && (
        <>
          {[
            { cx: 165, delay: 0, size: 2.5 },
            { cx: 235, delay: 1.2, size: 2 },
            { cx: 185, delay: 0.6, size: 1.8 },
            { cx: 220, delay: 2, size: 2.2 },
            { cx: 200, delay: 1.5, size: 1.5 },
          ].map((p, i) => (
            <circle key={i} cx={p.cx} cy="320" r={p.size} fill={i % 2 === 0 ? "hsl(var(--primary))" : "hsl(50, 70%, 50%)"} opacity="0">
              <animate attributeName="cy" from="330" to="200" dur={`${3 + p.delay}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.4;0" dur={`${3 + p.delay}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </>
      )}

      {/* Burst particles during WOW */}
      {burstParticles && (
        <>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const dist = 60 + wowProgress * 80;
            return (
              <circle
                key={`burst-${i}`}
                cx={200 + sway + Math.cos(angle) * dist}
                cy={340 - stemHeight + Math.sin(angle) * dist}
                r={1.5 + Math.sin(time * 3 + i) * 1}
                fill={i % 3 === 0 ? "hsl(var(--primary))" : i % 3 === 1 ? "hsl(50, 80%, 55%)" : "hsl(95, 55%, 50%)"}
                opacity={wowProgress * (0.3 + Math.sin(time * 2 + i) * 0.2)}
              />
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
  const [isVisible, setIsVisible] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Total animation duration: 8 seconds, with a dramatic pause at the end
  const ANIM_DURATION = 8000;

  // Detect when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animationStarted) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [animationStarted]);

  // Start animation when visible
  useEffect(() => {
    if (!isVisible || animationStarted) return;
    setAnimationStarted(true);
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      
      // Eased progress with dramatic acceleration at the end
      const linear = Math.min(elapsed / ANIM_DURATION, 1);
      // Ease: slow start, steady middle, dramatic burst at end
      let eased: number;
      if (linear < 0.7) {
        // Slow and steady for first 70%
        eased = (linear / 0.7) * 0.75;
      } else {
        // Dramatic acceleration for last 30%
        const burst = (linear - 0.7) / 0.3;
        eased = 0.75 + burst * burst * 0.25;
      }
      
      setProgress(eased);

      if (linear < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isVisible, animationStarted]);

  const currentStageIndex = Math.min(Math.floor(progress * stages.length), stages.length - 1);
  const isWow = progress > 0.85;
  const currentDay = Math.round(progress * 180);

  // Reset animation on click for replay
  const handleReplay = useCallback(() => {
    setProgress(0);
    setAnimationStarted(false);
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 100);
  }, []);

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
                    className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-500 ${
                      index <= currentStageIndex ? 'bg-muted' : ''
                    }`}
                  >
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                        index <= currentStageIndex 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {stage.day}
                    </div>
                    <div>
                      <p className={`font-semibold transition-colors duration-500 ${
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
            <div className="relative cursor-pointer" onClick={handleReplay} title="Click para repetir la animación">
              <GrowingPlant progress={progress} isWow={isWow} />
              {/* Day counter overlay */}
              <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 text-center transition-all duration-700 ${isWow ? 'scale-110' : ''}`}>
                <p className={`font-display font-bold transition-all duration-700 ${isWow ? 'text-5xl md:text-6xl text-primary' : 'text-4xl md:text-5xl text-foreground'}`}>
                  {currentDay}
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  {isWow ? '¡Volvió a la tierra! 🌱' : 'días en tu jardín'}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default DecompositionSection;
