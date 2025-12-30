import { ArrowRight, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedSection from './AnimatedSection';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large decorative blobs */}
        <div className="deco-circle w-[600px] h-[600px] -top-40 -right-40 opacity-30" />
        <div className="deco-circle w-[400px] h-[400px] bottom-20 -left-20 opacity-20" />
        
        {/* Floating leaf decoration */}
        <div className="absolute top-1/4 right-1/4 animate-float-slow">
          <div className="w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tag */}
          <AnimatedSection delay={100}>
            <div className="tag mb-8 inline-flex gap-2">
              <Leaf className="w-4 h-4" />
              <span>100% Compostable</span>
            </div>
          </AnimatedSection>

          {/* Main headline */}
          <AnimatedSection delay={200}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-semibold text-foreground leading-[1.1] mb-6">
              Envíos que{' '}
              <span className="text-primary italic">nutren</span>
              <br />
              la tierra
            </h1>
          </AnimatedSection>

          {/* Subheadline */}
          <AnimatedSection delay={300}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Bolsas courier compostables diseñadas para el ecommerce chileno. 
              Se degradan en 180 días, dejando solo nutrientes para el suelo.
            </p>
          </AnimatedSection>

          {/* CTAs */}
          <AnimatedSection delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="rounded-full px-8 py-6 text-base btn-lift group"
              >
                Comprar bolsas
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full px-8 py-6 text-base btn-lift"
              >
                Hablar con nosotros
              </Button>
            </div>
          </AnimatedSection>

          {/* Stats row */}
          <AnimatedSection delay={500}>
            <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16">
              {[
                { value: '180', label: 'días para compostar' },
                { value: '500+', label: 'empresas confían' },
                { value: '0%', label: 'plástico convencional' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-display font-semibold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;