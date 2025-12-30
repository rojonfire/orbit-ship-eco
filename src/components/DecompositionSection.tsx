import { AnimatedSection } from "./AnimatedSection";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const decompositionStages = [
  { label: "Día 0", description: "Tu bolsa ORBITA lista para enviar" },
  { label: "Día 30", description: "Comienza la biodegradación" },
  { label: "Día 90", description: "Fragmentación visible" },
  { label: "Día 180", description: "Descomposición completa" },
];

export function DecompositionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const { isVisible } = useScrollAnimation();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setProgress(1);
      return;
    }

    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      // Calculate progress based on section position
      const scrollProgress = Math.max(0, Math.min(1, 
        (viewportHeight - rect.top) / (viewportHeight + sectionHeight * 0.5)
      ));
      
      setProgress(scrollProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentStage = Math.min(3, Math.floor(progress * 4));

  return (
    <section ref={sectionRef} className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              De bolsa a tierra
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mira cómo tu bolsa ORBITA vuelve a la naturaleza en solo 180 días.
            </p>
          </div>
        </AnimatedSection>

        {/* Decomposition Visualization */}
        <div className="relative max-w-4xl mx-auto">
          {/* Progress Timeline */}
          <div className="flex justify-between mb-12">
            {decompositionStages.map((stage, index) => (
              <div key={stage.label} className="text-center flex-1">
                <div className={cn(
                  "w-4 h-4 rounded-full mx-auto mb-2 transition-all duration-500",
                  index <= currentStage ? "bg-primary scale-110" : "bg-border"
                )} />
                <p className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  index <= currentStage ? "text-foreground" : "text-muted-foreground"
                )}>
                  {stage.label}
                </p>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-border rounded-full mb-12 overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* Visual Representation */}
          <AnimatedSection>
            <div className="relative aspect-[16/9] bg-gradient-to-b from-secondary to-muted rounded-3xl overflow-hidden">
              {/* Bag Layers Animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Main bag shape */}
                <div 
                  className="relative transition-all duration-700 ease-out"
                  style={{
                    transform: `scale(${1 - progress * 0.3}) rotate(${progress * 10}deg)`,
                    opacity: 1 - progress * 0.7
                  }}
                >
                  <div className="w-40 h-56 bg-foreground/10 rounded-xl border-2 border-foreground/20" />
                </div>

                {/* Decomposed particles */}
                {progress > 0.3 && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-3 h-3 bg-primary/30 rounded-full"
                        style={{
                          left: `${30 + Math.random() * 40}%`,
                          top: `${30 + Math.random() * 40}%`,
                          transform: `translate(${(progress - 0.3) * (Math.random() - 0.5) * 200}px, ${(progress - 0.3) * Math.random() * 100}px)`,
                          opacity: progress > 0.5 ? (1 - progress) * 2 : (progress - 0.3) * 3,
                          transition: "all 0.5s ease-out"
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Soil/compost at the end */}
                {progress > 0.7 && (
                  <div 
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
                    style={{ opacity: (progress - 0.7) * 3.33 }}
                  >
                    <div className="w-32 h-8 bg-primary/20 rounded-full blur-xl mb-4" />
                    <p className="text-primary font-medium">Compost listo</p>
                  </div>
                )}
              </div>

              {/* Current Stage Description */}
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-foreground font-medium text-lg">
                  {decompositionStages[currentStage].description}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}