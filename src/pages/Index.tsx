import { Hero } from "@/components/Hero";
import { AccessSection } from "@/components/AccessSection";
import { IndustryNotice } from "@/components/IndustryNotice";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <AccessSection />
      <IndustryNotice />
    </div>
  );
};

export default Index;
