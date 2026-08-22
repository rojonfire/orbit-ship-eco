import { Instagram, Linkedin, Mail, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo-orbita-bags.svg';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img src={logo} alt="ORBITA BAGS - Bolsas courier compostables en Chile" className="h-10 w-auto invert mb-6" />
            <p className="text-background/80 max-w-sm mb-6">
              Bolsas courier compostables en casa para ecommerce en Chile. Con doble sello adhesivo 
              para envío y devolución. Certificación OK Compost HOME. Envío a todo Chile.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/orbitabags.cl"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en Instagram"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://linkedin.com/company/orbitabags"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en LinkedIn"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="mailto:orbitabagscontacto@gmail.com"
                aria-label="Envíanos un email"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">Navegación</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/tienda" className="hover:text-primary transition-colors text-background/80">Tienda</Link></li>
              <li><Link to="/personalizadas" className="hover:text-primary transition-colors text-background/80">Bolsas personalizadas</Link></li>
              <li><Link to="/equipo" className="hover:text-primary transition-colors text-background/80">Equipo</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors text-background/80">Preguntas frecuentes</Link></li>
              <li><Link to="/politicas" className="hover:text-primary transition-colors text-background/80">Envío y devoluciones</Link></li>
              <li><a href="/#productos" className="hover:text-primary transition-colors text-background/80">Productos</a></li>
              <li><a href="/#beneficios" className="hover:text-primary transition-colors text-background/80">Beneficios</a></li>
              <li><a href="/#contacto" className="hover:text-primary transition-colors text-background/80">Contacto</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://wa.me/56931726288" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-background/80">
                  WhatsApp: +56 9 3172 6288
                </a>
              </li>
              <li>
                <a href="mailto:orbitabagscontacto@gmail.com" className="hover:text-primary transition-colors text-background/80">
                  orbitabagscontacto@gmail.com
                </a>
              </li>
              <li className="text-background/60">Santiago, Chile 🇨🇱</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/50">
          <p>© {new Date().getFullYear()} ORBITA BAGS. Todos los derechos reservados.</p>
          <p className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-primary" />
            Packaging compostable diseñado en Chile
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
