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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ORBITA BAGS",
    "url": "https://orbitabags.cl",
    "logo": "https://orbitabags.cl/logo-orbita-bags.svg",
    "description": "Bolsas courier compostables en casa para ecommerce en Chile. Con doble sello adhesivo para envío y devolución.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Santiago",
      "addressCountry": "CL"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+56-9-5424-4951",
      "contactType": "sales",
      "availableLanguage": "Spanish"
    },
    "sameAs": [
      "https://instagram.com/orbitabags.cl",
      "https://linkedin.com/company/orbitabags"
    ]
  };

  return (
    <main className="min-h-screen">
      <SEOHead
        title="ORBITA BAGS | Bolsas courier compostables Chile"
        description="Bolsas courier 100% compostables en casa para ecommerce en Chile. Doble adhesivo para envío y devolución."
        path="/"
        jsonLd={jsonLd}
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
