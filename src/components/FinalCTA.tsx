import { ArrowRight, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedSection from './AnimatedSection';

const FinalCTA = () => {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="card-lime text-center py-16 md:py-24 px-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/20 mb-8">
              <Leaf className="w-8 h-8 text-primary-foreground" />
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-primary-foreground mb-6 max-w-3xl mx-auto">
              Envía mejor. Sin plástico.
            </h2>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl mx-auto mb-10">
              Únete a las empresas chilenas que ya hacen la diferencia con cada envío.
            </p>

            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-full px-10 py-7 text-lg btn-lift group bg-foreground text-background hover:bg-foreground/90"
            >
              <Link to="/tienda" onClick={() => window.scrollTo({ top: 0 })}>
                Comenzar ahora
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FinalCTA;