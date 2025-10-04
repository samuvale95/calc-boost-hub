// Hero.tsx
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative bg-gradient-hero min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <img src="/logo.png" alt="logo D-DAND" className="mx-auto" />
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
            D-DAND
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Scala <strong>D</strong>esease <strong>A</strong>ssociated <strong>N</strong>eurodevelopmental and <strong>N</strong>europsychiatric <strong>D</strong>isorders per la sindrome di <strong>D</strong>ravet
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

      {/* gradiente di transizione verso l’azzurro */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#e6f4ff] pointer-events-none" />
    </section>
  );
};
