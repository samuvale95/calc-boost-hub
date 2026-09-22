import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import publications from "@/data/publications.json";
import { eventService } from "@/services/eventService";

interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string | null;
  year: number | null;
  doi: string | null;
  abstract: string;
  coverImage: string;
  pdfFilename: string | null;
}

/**
 * Publications page (DAND Scale plan, point 12: site structure includes
 * "Publications"). Open access — no registration needed, unlike the
 * scale/manual (see ProtectedRoute) — publications are meant to spread
 * freely. Data-driven: add a publication by adding an entry to
 * src/data/publications.json and its cover image / PDF under
 * public/publications/, no code change needed.
 */
const Publications = () => {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState<string | null>(null);
  const items = publications as Publication[];

  const handleDownload = (pub: Publication) => {
    if (!pub.pdfFilename) return;
    setDownloading(pub.id);
    // Best-effort: publications are open access, so an anonymous visitor
    // can download without being signed in — trackEvent silently no-ops
    // for them (POST /events/ requires auth), which is an accepted gap
    // for now rather than opening up anonymous event posting.
    eventService.trackEvent('publication_download', { publication_id: pub.id });
    const link = document.createElement('a');
    link.href = `/publications/${pub.pdfFilename}`;
    link.download = pub.pdfFilename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setDownloading(null);
  };

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(316,91%,40%)] mb-3">
            {t('hero.eyebrow')}
          </p>
          <h1 className="text-4xl font-extrabold text-foreground">Publications</h1>
        </div>

        <div className="space-y-8">
          {items.map((pub) => (
            <Card key={pub.id} className="border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8 items-start">
                  <div className="md:col-span-1 flex justify-center">
                    <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden max-w-xs w-full">
                      <img src={pub.coverImage} alt={pub.title} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-1">{pub.title}</h2>
                      {(pub.journal || pub.year) && (
                        <p className="text-sm text-muted-foreground">
                          {[pub.journal, pub.year].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>

                    <p className="text-muted-foreground leading-relaxed text-sm">{pub.abstract}</p>

                    <p className="text-sm text-muted-foreground">
                      <strong>Autori:</strong> {pub.authors}
                    </p>

                    <div className="flex flex-wrap gap-3 pt-2">
                      {pub.doi && (
                        <Button variant="outline" asChild>
                          <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer">
                            <FileText className="h-4 w-4 mr-2" />
                            DOI
                          </a>
                        </Button>
                      )}
                      {pub.pdfFilename && (
                        <Button onClick={() => handleDownload(pub)} disabled={downloading === pub.id}>
                          {downloading === pub.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          Scarica PDF
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Publications;
