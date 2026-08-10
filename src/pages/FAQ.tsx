import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SEOHead from "@/components/SEOHead";
import { FAQS } from "@/data/faqs";
import { Button } from "@/components/ui/button";

const FAQ = () => {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Preguntas Frecuentes | ORBITA BAGS - Bolsas courier compostables"
        description="Respuestas a las preguntas más comunes sobre bolsas courier compostables en casa: certificación OK Compost HOME, tiempos de compostaje, tamaños, doble adhesivo y envíos en Chile."
        path="/faq"
        jsonLd={faqJsonLd}
      />
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                Resolvemos tus dudas
              </span>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2 mb-4">
                Preguntas Frecuentes
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Todo lo que necesitas saber sobre nuestras bolsas courier
                compostables en casa: certificaciones, tamaños, compostaje y envíos.
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <AnimatedSection key={faq.question} delay={100 + index * 50}>
                <details className="group bg-card rounded-2xl border border-border hover:border-primary/30 transition-colors">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-6 [&::-webkit-details-marker]:hidden">
                    <h2 className="text-base sm:text-lg font-display font-bold text-foreground">
                      {faq.question}
                    </h2>
                    <span
                      className="shrink-0 w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-primary transition-transform group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={600}>
            <div className="mt-16 text-center bg-primary/10 rounded-3xl p-12 border border-primary/20">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                ¿Te quedó alguna duda?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Escríbenos por WhatsApp o revisa nuestra tienda para conocer los
                tamaños y precios de las bolsas.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://wa.me/56931726288"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-secondary/50 text-foreground px-8 py-3 rounded-full font-medium hover:bg-secondary transition-colors"
                >
                  Hablar por WhatsApp
                </a>
                <Link to="/tienda">
                  <Button className="rounded-full px-8 py-6 btn-lift group w-full sm:w-auto">
                    Ir a la tienda
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
