import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import paperImage from "@/assets/paper.jpeg";

export const PaperSection = () => {
  return (
    <section className="py-16 bg-[hsl(210, 40%, 96%) 100%]">
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
                      VALIDAZIONE
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      The D-DAND (Dravet Disease–Associated Neurodevelopmental and Neuropsychiatric Disorders) Scale is a new caregiver-administered interview designed to assess the wide range of developmental and behavioral comorbidities in Dravet Syndrome (DS) beyond seizures, and examines its preliminary psychometric properties in a large patient sample.
                      Caregivers of 123 individuals with Dravet syndrome (age 3–41 years) were interviewed using the D-DAND in a two-phase study. In Phase 1 (N=80), D-DAND domain scores were compared with standard assessments (Vineland Adaptive Behavior Scales, Child Behavior Checklist, Childhood Autism Rating Scale, Behavior Rating Inventory of Executive Function, Sleep Disturbance Scale for Children). In Phase 2 (N=43), D-DAND was re-administered after ~2 weeks to evaluate test–retest reliability.
                      The D-DAND captured a broad spectrum of abilities and problems across multiple functional domains. Test–retest reliability was excellent (overall score r≈0.98; median domain r≈0.89). D-DAND scores showed expected correlations with corresponding standardized measures (e.g., higher D-DAND adaptive scores with higher Vineland scores). Notably, minimal correlations in certain domains indicate that D-DAND measures unique Dravet-specific features not detected by generic scales.
                      D-DAND is a novel, reliable tool for comprehensive evaluation of Dravet syndrome beyond seizures. It enables systematic tracking of developmental and behavioral issues in DS, facilitating early identification of needs and more personalized, whole-person care.
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Autori:</strong> D. A. Cambiare, S. Valente, A. Peluzzi
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
