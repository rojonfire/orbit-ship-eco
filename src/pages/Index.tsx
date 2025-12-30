import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ProductOverview } from "@/components/ProductOverview";
import { WhyOrbita } from "@/components/WhyOrbita";
import { DecompositionSection } from "@/components/DecompositionSection";
import { ContactSection } from "@/components/ContactSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
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