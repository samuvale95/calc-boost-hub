import { Button } from "@/components/ui/button";

const DDandSection = () => {
  return (
    <section className="py-16 bg-[#F5F8FB] text-center">
      <div className="container mx-auto px-6 lg:px-8">
        <h3 className="text-4xl md:text-5xl font-bold mb-6">
          D-DAND
        </h3>
        <h2 className="text-3xl font-semibold tracking-tight">Scala DAND per la sindrome di Dravet</h2>
        <ul className="mt-8 space-y-4 text-base text-muted-foreground max-w-2xl mx-auto list-disc list-inside">
          <li>Misurazione strutturata delle competenze numeriche fondata su letteratura clinica.</li>
          <li>Identificazione rapida di profili di apprendimento e di potenziali fragilità.</li>
          <li>Indicazioni operative per personalizzare gli interventi educativi mirati.</li>
        </ul>
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
    </section>
  );
};

export { DDandSection };

