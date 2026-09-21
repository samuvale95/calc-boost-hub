import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User as UserIcon,
  Mail,
  Building2,
  Briefcase,
  Phone,
  Globe,
  Calendar,
  Clock,
  Download,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { pdfService, PdfFileInfo } from "@/services/pdfService";
import { format } from "date-fns";
import { it } from "date-fns/locale";

const statusLabel: Record<string, { label: string; variant: "default" | "outline" | "destructive" }> = {
  approved: { label: "Accesso attivo", variant: "default" },
  pending: { label: "In attesa di approvazione", variant: "outline" },
  rejected: { label: "Richiesta non approvata", variant: "destructive" },
};

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [availableFiles, setAvailableFiles] = useState<PdfFileInfo[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  const hasAccess = user?.status === "approved";

  useEffect(() => {
    if (!hasAccess) return;

    setLoadingFiles(true);
    pdfService
      .getInfo()
      .then((info) => setAvailableFiles(info.available_pdfs))
      .catch((error) => console.error("Errore nel recupero dei file disponibili:", error))
      .finally(() => setLoadingFiles(false));
  }, [hasAccess]);

  const handleDownload = async (filename: string) => {
    try {
      setDownloadingFile(filename);
      await pdfService.downloadFile(filename);
    } catch (error) {
      console.error("Errore nel download:", error);
      toast({
        title: "Errore",
        description: "Impossibile scaricare il file. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setDownloadingFile(null);
    }
  };

  if (!user) {
    return null; // ProtectedRoute handles the redirect
  }

  const status = statusLabel[user.status] ?? statusLabel.pending;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <UserIcon className="h-6 w-6" />
                  {user.name}
                </CardTitle>
                <CardDescription>Il tuo profilo DAND Scale</CardDescription>
              </div>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {user.email}
              </div>
              {user.center && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  {user.center}
                </div>
              )}
              {user.professional_role && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  {user.professional_role}
                </div>
              )}
              {user.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </div>
              )}
              {user.country && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  {user.country}
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Registrato il {format(new Date(user.registration_date), "d MMMM yyyy", { locale: it })}
              </div>
              {user.last_access && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Ultimo accesso: {format(new Date(user.last_access), "d MMMM yyyy, HH:mm", { locale: it })}
                </div>
              )}
            </div>

            {user.status === "pending" && (
              <div className="bg-muted p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  La tua registrazione è in fase di verifica da parte di Fondazione Dravet ETS.
                  Ti invieremo un'email non appena l'accesso sarà attivato.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {hasAccess && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Scala e manuale
              </CardTitle>
              <CardDescription>Scarica la DAND Scale e il manuale d'uso</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingFiles ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Caricamento file disponibili...
                </div>
              ) : availableFiles.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nessun file disponibile al momento.</p>
              ) : (
                <div className="space-y-2">
                  {availableFiles.map((file) => (
                    <div
                      key={file.filename}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{file.filename}</span>
                        <span className="text-xs text-muted-foreground">({file.size_mb} MB)</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(file.filename)}
                        disabled={downloadingFile === file.filename}
                      >
                        {downloadingFile === file.filename ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
