import { Hero } from "@/components/Hero";
import { PricingSection } from "@/components/PricingSection";
import { LoginSection } from "@/components/LoginSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <PricingSection />
      <LoginSection />
    </div>
  );
};

export default Index;