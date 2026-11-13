import { Hero } from "@/components/Hero";
import { AdministrationSection } from "@/components/AdministrationSection";
import { AccessSection } from "@/components/AccessSection";
import { SupportedBySection } from "@/components/SupportedBySection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <AdministrationSection />
      <AccessSection />
      <SupportedBySection />
    </div>
  );
};

export default Index;
