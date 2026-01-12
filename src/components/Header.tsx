import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo-orbita-bags.svg';

interface NavItem {
  label: string;
  href: string;
  type: 'link' | 'scroll';
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Productos', href: '/catalogo', type: 'link' },
  { label: 'Equipo', href: '/equipo', type: 'link' },
  { label: 'Proceso', href: 'proceso', type: 'scroll' },
  { label: 'Contacto', href: 'contacto', type: 'scroll' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (item: NavItem) => {
    setIsMobileMenuOpen(false);
    
    if (item.type === 'link') {
      navigate(item.href);
    } else {
      // If we're not on the home page, navigate there first
      if (location.pathname !== '/') {
        navigate(`/#${item.href}`);
      } else {
        // Scroll to section
        const element = document.getElementById(item.href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="ORBITA BAGS" className="h-10 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className="text-foreground/80 hover:text-foreground transition-colors text-sm font-medium link-underline bg-transparent border-none cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" className="rounded-full">
            Iniciar sesión
          </Button>
          <Button className="rounded-full px-6 btn-lift group">
            Cotizar
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-t shadow-lg">
          <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="text-foreground/80 hover:text-foreground py-2 font-medium text-left bg-transparent border-none cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <Button className="rounded-full mt-4">Cotizar ahora</Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;