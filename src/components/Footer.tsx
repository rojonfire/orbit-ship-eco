import { Instagram, Linkedin, Mail, Leaf } from 'lucide-react';
import logo from '@/assets/logo-orbita-bags.svg';

const Footer = () => {
  const links = {
    Productos: ['Bolsas estándar', 'Personalizadas', 'Catálogo', 'Precios'],
    Empresa: ['Nosotros', 'Sustentabilidad', 'Blog'],
    Soporte: ['Contacto', 'FAQ', 'Envíos'],
  };

  return (
    <footer className="bg-foreground text-background pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img src={logo} alt="ORBITA BAGS" className="h-10 w-auto invert mb-6" />
            <p className="text-background/70 max-w-sm mb-6">
              Bolsas courier compostables para el ecommerce chileno. 
              Comprometidos con un futuro sin plástico.
            </p>
            <div className="flex gap-3">
              {[Instagram, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-3 text-sm text-background/70">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-primary transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/50">
          <p>© {new Date().getFullYear()} ORBITA BAGS. Todos los derechos reservados.</p>
          <p className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-primary" />
            Hecho con amor en Chile
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;