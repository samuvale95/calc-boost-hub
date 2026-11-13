import { Hero } from "@/components/Hero";
import { AccessSection } from "@/components/AccessSection";
import { SupportedBySection } from "@/components/SupportedBySection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <AccessSection />
      <SupportedBySection />
    </div>
  );
};

export default Index;
