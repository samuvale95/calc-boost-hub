import { Hero } from "@/components/Hero";
import { PaperSection } from "@/components/PaperSection";
import { PricingSection } from "@/components/PricingSection";
import { DDandSection } from "@/components/DDandSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <PaperSection />
      <DDandSection />
      <PricingSection />
    </div>
  );
};

export default Index;