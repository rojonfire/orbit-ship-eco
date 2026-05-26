import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

// Content is always visible; previous IntersectionObserver + getBoundingClientRect
// caused forced reflows (~519ms) on mobile. Render plain content for perf.
const AnimatedSection = ({ children, className }: AnimatedSectionProps) => {
  return <div className={cn(className)}>{children}</div>;
};

export default AnimatedSection;
