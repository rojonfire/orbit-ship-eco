import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { ReactNode, useEffect, useState } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedSection = ({ children, className, delay = 0 }: AnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure content is visible after mount
    setMounted(true);
  }, []);

  // Always show content - animation is just a nice-to-have
  const visible = mounted || isVisible;

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-500 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;