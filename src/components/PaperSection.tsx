import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import paperImage from "@/assets/paper.jpeg";

export const PaperSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8 items-start">
                {/* Image Column */}
                <div className="md:col-span-1">
                  <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={paperImage} 
                      alt="Research Paper" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Content Column */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                      NOME TEST
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Descrizione del paper di ricerca che presenta un'analisi approfondita 
                      dei metodi di calcolo sanitario e delle loro applicazioni cliniche. 
                      Questo studio fornisce una revisione sistematica delle tecniche 
                      più avanzate utilizzate nel campo della medicina computazionale, 
                      offrendo nuove prospettive per il miglioramento della precisione 
                      diagnostica e terapeutica.
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Autori:</strong> Dr. Marco Rossi, Prof. Anna Bianchi, 
                      Dr. Giuseppe Verdi, Prof.ssa Maria Neri, Dr. Luca Blu
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
