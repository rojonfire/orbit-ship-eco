import { Instagram, Linkedin, Mail } from 'lucide-react';
import logo from '@/assets/logo-orbita-bags.svg';

const Footer = () => {
  return (
    <footer className="bg-secondary/50 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-2">
            <img src={logo} alt="ORBITA BAGS" className="h-10 w-auto mb-6" />
            <p className="text-muted-foreground max-w-sm mb-6">
              Bolsas courier compostables para el ecommerce chileno.
            </p>
            <div className="flex gap-4">
              {[Instagram, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Productos</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Bolsas estándar</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Personalizadas</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Empresa</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Nosotros</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contacto</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ORBITA BAGS. Hecho con 💚 en Chile
        </div>
      </div>
    </footer>
  );
};

export default Footer;