import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-dashboard.jpg";

export const Hero = () => {
  return (
    <section className="relative bg-gradient-hero min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <img src="/logo.jpg" alt="logo D-DAND"/>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
            D-DAND
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Per una valutazioen completa della sindrome di Dravet
          </p>
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8"
              onClick={() => {
                const pricingSection = document.getElementById('pricing');
                if (pricingSection) {
                  pricingSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Scegli il Tuo Piano
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};