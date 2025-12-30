import logo from "@/assets/logo-orbita-bags.svg";

export function Footer() {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src={logo} alt="ORBITA BAGS" className="h-6 w-auto" />
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ORBITA BAGS. Todos los derechos reservados.
            </span>
          </div>
          
          <nav className="flex items-center gap-6">
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
        </div>
      </div>
    </footer>
  );
}