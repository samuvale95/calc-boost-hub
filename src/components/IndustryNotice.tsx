import { useTranslation } from "react-i18next";
import { Building2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CONTACT_EMAIL = import.meta.env.VITE_DAND_CONTACT_EMAIL || "fondazionedravet@gmail.com";
interface IndustryNoticeModalProps {
  /** Whether the notice should be on screen right now. */
  open: boolean;
  /** Called when the user closes it with the button. */
  onClose: () => void;
}

/**
 * Notice for pharmaceutical companies / CROs / sponsored clinical trials.
 * Shown on top of the sign-in/registration form every time it opens, before
 * anyone can sign in or register. It can only be closed with the button (no
 * click-outside / Esc). Text as agreed with Fondazione Dravet ETS (email
 * "Sito e preventivo", 17/09/2026) — the IT/EN/FR translations under
 * src/locales (each common.json's "industryNotice" key) must stay a
 * faithful rendering of the Italian original; do not paraphrase without
 * their sign-off.
 */
export const IndustryNoticeModal = ({ open, onClose }: IndustryNoticeModalProps) => {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="sm:max-w-[520px]" onEscapeKeyDown={(e) => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 flex-shrink-0" />
            {t("industryNotice.title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left space-y-3 pt-2">
            <span className="block">
              {t("industryNotice.body")}{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
                {CONTACT_EMAIL}
              </a>
              .
            </span>
            <span className="block">{t("industryNotice.afterContact")}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>{t("industryNotice.acknowledge")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
