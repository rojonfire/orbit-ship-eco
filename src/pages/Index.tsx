import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SEOHead from "@/components/SEOHead";

// Lazy-load below-the-fold sections to reduce initial JS
const ProductOverview = lazy(() => import("@/components/ProductOverview"));
const WhyOrbita = lazy(() => import("@/components/WhyOrbita"));
const DecompositionSection = lazy(() => import("@/components/DecompositionSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const FinalCTA = lazy(() => import("@/components/FinalCTA"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  // El schema de Organización ya está en index.html (lo ven todos los crawlers sin JS);
  // repetirlo aquí lo duplicaba en el inicio.
  return (
    <main className="min-h-screen">
      <SEOHead
        title="ORBITA BAGS | Bolsas courier compostables Chile"
        description="Bolsas courier 100% compostables en casa para ecommerce en Chile. Doble adhesivo para envío y devolución."
        path="/"
      />
      <Header />
      <HeroSection />
      <Suspense fallback={null}>
        <ProductOverview />
        <WhyOrbita />
        <DecompositionSection />
        <ContactSection />
        <FinalCTA />
        <Footer />
      </Suspense>
    </main>
  );
};

export default Index;
