import logo from "@/assets/logo-orbita-bags.svg";
import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-16 border-t border-border/30 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center lg:items-start gap-4">
            <img 
              src={logo} 
              alt="ORBITA BAGS" 
              className="h-8 w-auto invert" 
            />
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Leaf className="w-4 h-4 text-primary" />
              Bolsas compostables para un futuro mejor
            </p>
          </div>
          
          <nav className="flex flex-wrap items-center justify-center gap-8">
            <a href="#productos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Productos
            </a>
            <a href="#por-que-orbita" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Por qué ORBITA
            </a>
            <a href="#contacto" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contacto
            </a>
          </nav>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ORBITA BAGS. Chile.
          </p>
        </div>
      </div>
    </footer>
  );
}