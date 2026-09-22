import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { format, type Locale } from "date-fns";
import { it, enUS, fr } from "date-fns/locale";

const dateLocales: Record<string, Locale> = { it, en: enUS, fr };

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [availableFiles, setAvailableFiles] = useState<PdfFileInfo[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  const hasAccess = user?.status === "approved";
  const dateLocale = dateLocales[i18n.language] ?? it;

  const statusLabel: Record<string, { label: string; variant: "default" | "outline" | "destructive" }> = {
    approved: { label: t('profile.statusApproved'), variant: "default" },
    pending: { label: t('profile.statusPending'), variant: "outline" },
    rejected: { label: t('profile.statusRejected'), variant: "destructive" },
  };

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
        title: t('common.error'),
        description: t('profile.downloadError'),
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
                <CardDescription>{t('profile.title')}</CardDescription>
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
                {t('profile.registeredOn', { date: format(new Date(user.registration_date), "d MMMM yyyy", { locale: dateLocale }) })}
              </div>
              {user.last_access && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {t('profile.lastAccess', { date: format(new Date(user.last_access), "d MMMM yyyy, HH:mm", { locale: dateLocale }) })}
                </div>
              )}
            </div>

            {user.status === "pending" && (
              <div className="bg-muted p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  {t('profile.pendingNotice')}
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
                {t('profile.downloadsTitle')}
              </CardTitle>
              <CardDescription>{t('profile.downloadsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingFiles ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('profile.loadingFiles')}
                </div>
              ) : availableFiles.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('profile.noFiles')}</p>
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
