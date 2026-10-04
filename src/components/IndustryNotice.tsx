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
const ACK_KEY = "dand_industry_notice_ack";

// localStorage can throw (private mode, blocked site data): in that case the
// notice simply shows again next time instead of breaking the form.
export const hasAcknowledgedIndustryNotice = (): boolean => {
  try {
    return window.localStorage.getItem(ACK_KEY) === "1";
  } catch {
    return false;
  }
};

const saveAcknowledged = () => {
  try {
    window.localStorage.setItem(ACK_KEY, "1");
  } catch {
    // ignore
  }
};

interface IndustryNoticeModalProps {
  /** Whether the notice should be on screen right now. */
  open: boolean;
  /** Called once the user closes it with the button (already remembered). */
  onAcknowledge: () => void;
}

/**
 * Notice for pharmaceutical companies / CROs / sponsored clinical trials,
 * shown as a modal the first time someone opens the sign-in/registration
 * form, before the form itself appears. It can only be closed with the button (no click-outside / Esc) and
 * is not shown again once acknowledged. Text as agreed with Fondazione
 * Dravet ETS (email "Sito e preventivo", 17/09/2026) — the IT/EN/FR
 * translations under src/locales (each common.json's "industryNotice" key)
 * must stay a faithful rendering of the Italian original; do not paraphrase
 * without their sign-off.
 */
export const IndustryNoticeModal = ({ open, onAcknowledge }: IndustryNoticeModalProps) => {
  const { t } = useTranslation();

  const handleAcknowledge = () => {
    saveAcknowledged();
    onAcknowledge();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="sm:max-w-[520px]">
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
          <AlertDialogAction onClick={handleAcknowledge}>{t("industryNotice.acknowledge")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
