import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo-orbita-bags.svg';
import { CartDrawer } from '@/components/CartDrawer';

interface NavItem {
  label: string;
  href: string;
  type: 'link' | 'scroll';
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Tienda', href: '/tienda', type: 'link' },
  { label: 'Personalizadas', href: '/personalizadas', type: 'link' },
  { label: 'Blog', href: '/blog', type: 'link' },
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
      // Navigate to the page and scroll to top
      navigate(item.href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If we're not on the home page, navigate there first then scroll
      if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation to complete then scroll
        setTimeout(() => {
          const element = document.getElementById(item.href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        // Already on home page, scroll to section
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
          <CartDrawer />
          <Link to="/tienda">
            <Button className="rounded-full px-6 btn-lift group">
              Comprar
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <CartDrawer />
          <button
            className="p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
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
            <div className="flex items-center gap-3 mt-4">
              <CartDrawer />
              <Link to="/tienda" className="flex-1">
                <Button className="rounded-full w-full">Comprar ahora</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;