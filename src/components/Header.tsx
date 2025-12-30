import { Link } from "react-router-dom";
import logo from "@/assets/logo-orbita-bags.svg";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src={logo} 
            alt="ORBITA BAGS" 
            className="h-8 w-auto invert transition-all duration-300 group-hover:drop-shadow-[0_0_10px_hsl(var(--glow-primary)/0.6)]" 
          />
        </Link>
        
        <nav className="hidden md:flex items-center gap-10">
          <a 
            href="#productos" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            Productos
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
          <a 
            href="#por-que-orbita" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            Por qué ORBITA
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
          <a 
            href="#contacto" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            Contacto
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
        </nav>

        <a
          href="#productos"
          className="relative group px-6 py-2.5 rounded-full text-sm font-semibold overflow-hidden transition-all duration-300"
        >
          <span className="absolute inset-0 bg-primary rounded-full transition-all duration-300 group-hover:shadow-[0_0_30px_hsl(var(--glow-primary)/0.5)]" />
          <span className="relative text-primary-foreground">Comprar</span>
        </a>
      </div>
    </header>
  );
}