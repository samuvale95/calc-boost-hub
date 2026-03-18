import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Brain,
  Activity,
  BookOpen,
  Home,
  Smile,
  Moon,
  FileText,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    id: 1,
    icon: Brain,
    question: "Cos'è la Scala D-DAND?",
    images: ["/slides/slide-03.png"],
  },
  {
    id: 2,
    icon: Activity,
    question: "Perché serve una scala come la D-DAND?",
    images: ["/slides/slide-04.png"],
  },
  {
    id: 3,
    icon: BookOpen,
    question: "Come è strutturata la D-DAND?",
    images: ["/slides/slide-05.png", "/slides/slide-09.png"],
  },
  {
    id: 4,
    icon: Home,
    question: "Cosa valuta la D-DAND?",
    images: ["/slides/slide-07.png", "/slides/slide-08.png"],
  },
  {
    id: 5,
    icon: Smile,
    question: "Come si usa nella pratica?",
    images: ["/slides/slide-06.png"],
  },
  {
    id: 6,
    icon: Moon,
    question: "Quali sono i punti di forza della D-DAND?",
    images: ["/slides/slide-10.png"],
  },
  {
    id: 7,
    icon: FileText,
    question: "Chi ha sviluppato la D-DAND e dove è pubblicata?",
    images: ["/slides/slide-02.png", "/slides/slide-11.png"],
  },
];

// Accordion item con animazione grid fluida e scroll-into-view
const AccordionItem = ({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const Icon = faq.icon;

  // Scroll into view quando si apre, con un piccolo delay per aspettare l'animazione
  useEffect(() => {
    if (isOpen && itemRef.current) {
      setTimeout(() => {
        itemRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 50);
    }
  }, [isOpen]);

  return (
    <div
      ref={itemRef}
      className={`rounded-xl border-2 transition-all duration-200 bg-white ${
        isOpen
          ? "border-[hsl(95,87%,34%)] shadow-md"
          : "border-transparent shadow-sm hover:border-[hsl(95,87%,34%,0.3)] hover:shadow-md"
      }`}
    >
      {/* Trigger */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(95,87%,34%)] group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
              isOpen
                ? "bg-[hsl(95,87%,34%)] text-white scale-110"
                : "bg-[hsl(95,87%,34%,0.08)] text-[hsl(95,87%,34%)] group-hover:bg-[hsl(95,87%,34%,0.18)] group-hover:scale-105"
            }`}
          >
            <Icon className="w-4 h-4" />
          </span>
          <span
            className={`font-semibold text-sm md:text-[15px] leading-snug truncate ${
              isOpen ? "text-[hsl(95,87%,34%)]" : "text-foreground"
            }`}
          >
            {faq.question}
          </span>
        </div>
        <ChevronDown
          className={`flex-shrink-0 w-4 h-4 transition-all duration-300 ${
            isOpen
              ? "rotate-180 text-[hsl(95,87%,34%)]"
              : "text-muted-foreground group-hover:text-[hsl(95,87%,34%)]"
          }`}
        />
      </button>

      {/* Contenuto — animazione grid (smooth senza max-h hardcoded) */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5">
            <div className="h-px bg-gradient-to-r from-[hsl(95,87%,34%,0.25)] to-[hsl(316,91%,40%,0.25)] mb-4" />
            <div className="flex flex-col gap-3">
              {faq.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${faq.question} — slide ${i + 1}`}
                  loading="lazy"
                  className="w-full rounded-lg border border-border/50 shadow-sm object-contain"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Hero = () => {
  // Prima domanda aperta di default per mostrare l'interazione
  const [openId, setOpenId] = useState<number | null>(1);

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative bg-[#f3f7fa]">
      <div className="flex items-start">

        {/* ── SINISTRA (35%): Logo sticky ── */}
        <aside className="hidden md:flex flex-col items-center justify-center w-[35%] shrink-0 sticky top-16 self-start h-[calc(100vh-4rem)] px-8 py-12">
          {/* Cerchio decorativo */}
          <div className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-[hsl(95,87%,34%,0.07)] to-[hsl(316,91%,40%,0.07)] blur-3xl pointer-events-none" />

          <div className="relative flex flex-col items-center text-center gap-5 w-full">
            <img
              src="/logo.png"
              alt="Logo D-DAND"
              className="w-44 lg:w-60 xl:w-64 drop-shadow-xl select-none"
              draggable={false}
            />

            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[hsl(95,87%,34%)] to-[hsl(316,91%,40%)] bg-clip-text text-transparent">
              D-DAND
            </h1>

            <p className="text-sm text-muted-foreground max-w-[200px] leading-relaxed">
              <strong className="text-[hsl(95,87%,34%)]">D</strong>isease{" "}
              <strong className="text-[hsl(316,91%,40%)]">A</strong>ssociated{" "}
              <strong className="text-[hsl(95,87%,34%)]">N</strong>europsychiatric{" "}
              <strong className="text-[hsl(316,91%,40%)]">D</strong>isorders
            </p>

            <div className="w-12 h-px bg-gradient-to-r from-[hsl(95,87%,34%)] to-[hsl(316,91%,40%)]" />

            <p className="text-xs text-muted-foreground/60 italic">
              Fondazione Dravet ETS
            </p>

            {/* CTA verso la sezione piani */}
            <Button
              onClick={scrollToPricing}
              size="lg"
              className="mt-6 w-full max-w-[200px] bg-[hsl(316,91%,40%)] hover:bg-[hsl(316,91%,34%)] text-white rounded-xl gap-2 shadow-md font-semibold text-base"
            >
              Vedi i piani
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>
        </aside>

        {/* Divisore verticale */}
        <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-[hsl(95,87%,34%,0.2)] to-transparent self-stretch shrink-0" />

        {/* ── DESTRA (65%): FAQ Accordion ── */}
        <main className="flex flex-col w-full md:w-[65%] px-6 md:px-10 lg:px-12 py-12 gap-3">

          {/* Header mobile */}
          <div className="flex md:hidden items-center gap-3 mb-4">
            <img src="/logo.png" alt="D-DAND" className="w-11 h-11 object-contain" />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-[hsl(95,87%,34%)] to-[hsl(316,91%,40%)] bg-clip-text text-transparent">
              D-DAND
            </span>
          </div>

          {/* Intestazione sezione */}
          <div className="mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[hsl(316,91%,40%)] mb-1.5">
              Scopri lo strumento
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-snug whitespace-nowrap">
              Tutto quello che devi sapere sulla Scala D-DAND
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Clicca su una domanda per vedere la risposta.
            </p>
          </div>

          {/* Accordion */}
          <div className="flex flex-col gap-2.5">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => toggle(faq.id)}
              />
            ))}
          </div>

          {/* CTA mobile verso pricing */}
          <div className="md:hidden mt-6">
            <Button
              onClick={scrollToPricing}
              className="w-full bg-[hsl(95,87%,34%)] hover:bg-[hsl(95,87%,28%)] text-white rounded-xl gap-2"
            >
              Vedi i piani
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Spacer in fondo per non soffocarlo con il gradiente */}
          <div className="h-8" />
        </main>
      </div>

      {/* Gradiente transizione verso pricing */}
      <div className="h-16 bg-gradient-to-b from-[#f3f7fa] to-[#fff4fc]" />
    </section>
  );
};
