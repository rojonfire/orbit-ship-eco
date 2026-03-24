import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductOverview from "@/components/ProductOverview";
import WhyOrbita from "@/components/WhyOrbita";
import DecompositionSection from "@/components/DecompositionSection";
import ContactSection from "@/components/ContactSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ORBITA BAGS",
    "url": "https://orbitabags.cl",
    "logo": "https://storage.googleapis.com/gpt-engineer-file-uploads/MNCWozbhLMOHqFITdYsJnmpqal62/uploads/1768306704331-Logo-orbita-bags-Negro.svg",
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
    <main className="min-h-screen bg-background">
      <SEOHead
        title="ORBITA BAGS | Bolsas courier compostables en casa para ecommerce en Chile"
        description="Bolsas courier 100% compostables en casa para ecommerce en Chile. Packaging sustentable con doble adhesivo, ideales para tiendas online que quieren reducir su huella ambiental."
        path="/"
        jsonLd={jsonLd}
      />
      <Header />
      <HeroSection />
      <ProductOverview />
      <WhyOrbita />
      <DecompositionSection />
      <ContactSection />
      <FinalCTA />
      <Footer />
    </main>
  );
};

export default Index;
