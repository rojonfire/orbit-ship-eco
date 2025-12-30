import { AnimatedSection } from "./AnimatedSection";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Leaf, Droplets, Sprout, TreeDeciduous } from "lucide-react";

const decompositionStages = [
  { 
    label: "Día 0", 
    description: "Tu bolsa ORBITA lista para enviar",
    icon: Leaf,
    color: "primary"
  },
  { 
    label: "Día 30", 
    description: "Comienza la biodegradación",
    icon: Droplets,
    color: "glow-cyan"
  },
  { 
    label: "Día 90", 
    description: "Fragmentación visible",
    icon: Sprout,
    color: "glow-secondary"
  },
  { 
    label: "Día 180", 
    description: "Descomposición completa",
    icon: TreeDeciduous,
    color: "primary"
  },
];

export function DecompositionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

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
      
      const scrollProgress = Math.max(0, Math.min(1, 
        (viewportHeight - rect.top) / (viewportHeight + sectionHeight * 0.3)
      ));
      
      setProgress(scrollProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentStage = Math.min(3, Math.floor(progress * 4));

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[200px] transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, 
              hsl(var(--glow-primary) / ${0.1 + progress * 0.2}) 0%, 
              hsl(var(--glow-secondary) / ${0.05 + progress * 0.1}) 50%, 
              transparent 70%)`
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="text-foreground">De bolsa </span>
              <span className="gradient-text">a tierra</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mira cómo tu bolsa ORBITA vuelve a la naturaleza en solo 180 días.
            </p>
          </div>
        </AnimatedSection>

        <div className="max-w-5xl mx-auto">
          {/* Timeline */}
          <div className="relative mb-16">
            {/* Progress line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-border/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary via-glow-secondary to-glow-cyan rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            {/* Stage markers */}
            <div className="relative flex justify-between">
              {decompositionStages.map((stage, index) => {
                const isActive = index <= currentStage;
                const isCurrent = index === currentStage;
                const StageIcon = stage.icon;

                return (
                  <div key={stage.label} className="flex flex-col items-center text-center">
                    <div 
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 relative",
                        isActive 
                          ? "bg-gradient-to-br from-primary to-glow-secondary" 
                          : "bg-card border border-border/50",
                        isCurrent && "scale-125"
                      )}
                    >
                      {isCurrent && (
                        <div className="absolute inset-0 rounded-full bg-primary/50 animate-ping" />
                      )}
                      <StageIcon className={cn(
                        "w-5 h-5 relative z-10 transition-colors duration-300",
                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                      )} />
                    </div>
                    <p className={cn(
                      "text-sm font-semibold mt-4 transition-colors duration-300",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {stage.label}
                    </p>
                    <p className={cn(
                      "text-xs mt-1 max-w-[120px] transition-colors duration-300",
                      isCurrent ? "text-primary" : "text-muted-foreground/70"
                    )}>
                      {stage.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Representation */}
          <AnimatedSection>
            <div className="relative aspect-video glass rounded-3xl overflow-hidden glow-border">
              {/* Animated decomposition visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Bag layers that separate */}
                <div className="relative" style={{ perspective: "1000px" }}>
                  {/* Layer 1 - Outer */}
                  <div 
                    className="absolute w-48 h-64 rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/20 to-transparent transition-all duration-700"
                    style={{
                      transform: `
                        translateX(${progress * -80}px) 
                        translateY(${progress * -40}px) 
                        rotateY(${progress * -20}deg)
                        scale(${1 - progress * 0.3})
                      `,
                      opacity: 1 - progress * 0.7
                    }}
                  />
                  
                  {/* Layer 2 - Middle */}
                  <div 
                    className="absolute w-48 h-64 rounded-2xl border-2 border-glow-secondary/40 bg-gradient-to-br from-glow-secondary/20 to-transparent transition-all duration-700"
                    style={{
                      transform: `
                        translateY(${progress * 30}px)
                        scale(${1 - progress * 0.2})
                      `,
                      opacity: 1 - progress * 0.5
                    }}
                  />
                  
                  {/* Layer 3 - Inner */}
                  <div 
                    className="absolute w-48 h-64 rounded-2xl border-2 border-glow-cyan/40 bg-gradient-to-br from-glow-cyan/20 to-transparent transition-all duration-700"
                    style={{
                      transform: `
                        translateX(${progress * 80}px) 
                        translateY(${progress * -20}px)
                        rotateY(${progress * 20}deg)
                        scale(${1 - progress * 0.3})
                      `,
                      opacity: 1 - progress * 0.6
                    }}
                  />

                  {/* Main bag - center */}
                  <div 
                    className="relative w-48 h-64 rounded-2xl border-2 border-foreground/20 bg-gradient-to-br from-foreground/10 to-transparent flex flex-col items-center justify-center gap-3 transition-all duration-700"
                    style={{
                      transform: `scale(${1 - progress * 0.5}) rotate(${progress * 15}deg)`,
                      opacity: 1 - progress * 0.8
                    }}
                  >
                    <div className="w-16 h-1 bg-foreground/30 rounded-full" />
                    <span className="text-foreground/40 text-sm font-medium">ORBITA</span>
                    <div className="w-10 h-1 bg-foreground/20 rounded-full" />
                  </div>
                </div>

                {/* Particles that appear during decomposition */}
                {progress > 0.3 && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                          width: `${4 + Math.random() * 8}px`,
                          height: `${4 + Math.random() * 8}px`,
                          left: `${35 + Math.random() * 30}%`,
                          top: `${30 + Math.random() * 40}%`,
                          background: i % 3 === 0 
                            ? 'hsl(var(--glow-primary))' 
                            : i % 3 === 1 
                              ? 'hsl(var(--glow-secondary))' 
                              : 'hsl(var(--glow-cyan))',
                          transform: `
                            translate(
                              ${(progress - 0.3) * (Math.random() - 0.5) * 400}px, 
                              ${(progress - 0.3) * Math.random() * 200}px
                            )
                          `,
                          opacity: progress > 0.7 ? (1 - progress) * 3 : (progress - 0.3) * 2,
                          transition: 'all 0.8s ease-out',
                          boxShadow: `0 0 10px currentColor`
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Final compost glow */}
                {progress > 0.7 && (
                  <div 
                    className="absolute flex flex-col items-center gap-4 transition-all duration-700"
                    style={{ opacity: (progress - 0.7) * 3.33 }}
                  >
                    <div className="w-40 h-40 bg-gradient-to-r from-primary via-glow-secondary to-glow-cyan rounded-full blur-3xl animate-glow-pulse" />
                    <div className="relative z-10 text-center">
                      <TreeDeciduous className="w-12 h-12 text-primary mx-auto mb-3" />
                      <p className="text-xl font-display font-bold gradient-text">Compost listo</p>
                      <p className="text-sm text-muted-foreground mt-1">Vuelve a la tierra</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}