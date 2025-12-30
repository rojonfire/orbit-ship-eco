import { Link } from "react-router-dom";
import logo from "@/assets/logo-orbita-bags.svg";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="ORBITA BAGS" className="h-8 w-auto" />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#productos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Productos
          </a>
          <a href="#por-que-orbita" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Por qué ORBITA
          </a>
          <a href="#contacto" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Contacto
          </a>
        </nav>

        <a
          href="#productos"
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Comprar
        </a>
      </div>
    </header>
  );
}