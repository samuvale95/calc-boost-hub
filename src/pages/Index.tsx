import { Hero } from "@/components/Hero";
import { AccessSection } from "@/components/AccessSection";
import { UsageCounter } from "@/components/UsageCounter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <UsageCounter />
      <AccessSection />
    </div>
  );
};

export default Index;
