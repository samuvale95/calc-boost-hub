import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { publicationService, ExtraPublication } from "@/services/publicationService";

interface AddPublicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (publication: ExtraPublication) => void;
}

const isHttpUrl = (value: string) => {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

/** Admin-only form to add a publication (title + link + citation). */
export const AddPublicationDialog = ({ open, onOpenChange, onCreated }: AddPublicationDialogProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [citation, setCitation] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const reset = () => {
    setTitle("");
    setUrl("");
    setCitation("");
  };

  const handleOpenChange = (next: boolean) => {
    if (isSaving) return;
    if (!next) reset();
    onOpenChange(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !citation.trim()) {
      toast({ title: t("login.errorTitle"), description: t("publicationsPage.errorRequired"), variant: "destructive" });
      return;
    }
    if (!isHttpUrl(url.trim())) {
      toast({ title: t("login.errorTitle"), description: t("publicationsPage.errorInvalidUrl"), variant: "destructive" });
      return;
    }

    try {
      setIsSaving(true);
      const created = await publicationService.create({
        title: title.trim(),
        url: url.trim(),
        citation: citation.trim(),
      });
      onCreated(created);
      reset();
      onOpenChange(false);
      toast({ title: t("publicationsPage.addedTitle"), description: t("publicationsPage.addedDescription") });
    } catch (error) {
      console.error("Errore nell'aggiunta della pubblicazione:", error);
      toast({
        title: t("login.errorTitle"),
        description: t("publicationsPage.errorSave"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {t("publicationsPage.addTitle")}
          </DialogTitle>
          <DialogDescription>{t("publicationsPage.addDescription")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pub-title">
              {t("publicationsPage.titleLabel")}
              <span className="text-red-600 ml-0.5" aria-hidden="true">*</span>
            </Label>
            <Input
              id="pub-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={500}
              disabled={isSaving}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pub-url">
              {t("publicationsPage.urlLabel")}
              <span className="text-red-600 ml-0.5" aria-hidden="true">*</span>
            </Label>
            <Input
              id="pub-url"
              type="url"
              placeholder="https://"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isSaving}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pub-citation">
              {t("publicationsPage.citationLabel")}
              <span className="text-red-600 ml-0.5" aria-hidden="true">*</span>
            </Label>
            <Textarea
              id="pub-citation"
              rows={5}
              value={citation}
              onChange={(e) => setCitation(e.target.value)}
              maxLength={5000}
              disabled={isSaving}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSaving}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("login.sending")}
                </>
              ) : (
                t("common.save")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
