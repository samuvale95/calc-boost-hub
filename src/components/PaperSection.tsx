import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import paperImage from "@/assets/paper.jpeg";

export const PaperSection = () => {
  return (
    <section className="py-16 bg-[#fff4fc]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* Image Column */}
                <div className="md:col-span-1 flex justify-center">
                  <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden max-w-xs w-full">
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
                      Standardizzazione
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong>Objective</strong>: The D-DAND (Dravet Disease–Associated Neuropsychiatric Disorders) Scale is a new caregiver-administered interview designed to assess the wide range of developmental and behavioral comorbidities in Dravet Syndrome (DS) beyond seizures, and examines its preliminary psychometric properties in a large patient sample. <strong>Methods</strong>: D-DAND was standardized on caregivers of 123 individuals with Dravet syndrome (age 3–41 years); a subsample of 43 caregivers were interviewed twice (~2 weeks apart) to evaluate test-retest reliability; another subsample of 80 were also administered with other, widely use standardized scales (Vineland Adaptive Behavior Scales, Child Behavior Checklist, Childhood Autism Rating Scale, Behavior Rating Inventory of Executive Function, Sleep Disturbance Scale for Children). <strong>Results</strong>: The D-DAND captured a broad spectrum of abilities and problems across multiple functional domains. Test–retest reliability was excellent (overall score r≈0.98; median across domains r≈0.89) thus qualifying D-DAND as a sensitive detector of profile changes with time. D-DAND scores showed expected correlations with corresponding standardized measures (especially the Vineland scales). Notably, minimal correlations with other standardized scales indicate that D-DAND measures unique, Dravet-specific features that other widely used tools fail to detect. <strong>Significance</strong>: D-DAND is a novel, reliable tool for comprehensive evaluation of Dravet syndrome beyond seizures. It enables systematic tracking of developmental and behavioral issues in DS, facilitating early identification of needs and more personalized, whole-person care.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Autori:</strong> Dalla Bernardina B, Offredi F, Toraldo A, Ouss-Ryngaert E, Breuillard D, Cozzo M, Lo Barco T, Brambilla I, Darra F, Nabbout R
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
