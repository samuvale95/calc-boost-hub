import { Hero } from "@/components/Hero";
import { AccessSection } from "@/components/AccessSection";
import { IndustryNotice } from "@/components/IndustryNotice";
import { UsageCounter } from "@/components/UsageCounter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <AccessSection />
      <UsageCounter />
      <IndustryNotice />
    </div>
  );
};

export default Index;
