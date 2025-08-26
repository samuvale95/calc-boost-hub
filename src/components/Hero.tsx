import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-dashboard.jpg";

export const Hero = () => {
  return (
    <section className="relative bg-gradient-hero min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
            Tool di Calcolo
            <span className="block text-4xl md:text-5xl mt-2">Professionale</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Accedi ai nostri strumenti avanzati di calcolo e ottieni risultati precisi 
            per le tue analisi professionali
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};