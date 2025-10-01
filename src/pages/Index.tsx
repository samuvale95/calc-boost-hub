import { Hero } from "@/components/Hero";
import { PaperSection } from "@/components/PaperSection";
import { PricingSection } from "@/components/PricingSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Hero />
      <PaperSection />
      <PricingSection />
    </div>
  );
};

export default Index;