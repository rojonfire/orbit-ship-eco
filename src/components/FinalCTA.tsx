import { ArrowRight, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedSection from './AnimatedSection';

const FinalCTA = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="deco-circle w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40" />
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 mb-8">
              <Leaf className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold mb-6">
              Envía <span className="text-primary italic">mejor</span>.<br />Sin plástico.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10">
              Únete a las empresas chilenas que ya hacen la diferencia.
            </p>
            <Button size="lg" className="rounded-full px-10 py-7 text-lg btn-lift group">
              Comenzar ahora
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FinalCTA;