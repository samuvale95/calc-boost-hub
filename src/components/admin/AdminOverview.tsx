import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, LineChart, Line } from "recharts";
import { Loader2, Users, Calculator, Download, FileSpreadsheet, FileText, Clock, AlertCircle } from "lucide-react";
import { adminStatsService, AdminStats } from "@/services/adminStatsService";
import { useToast } from "@/hooks/use-toast";

const GREEN = "hsl(95,87%,34%)";
const MAGENTA = "hsl(316,91%,40%)";
const BLUE = "hsl(217,91%,55%)";
const AMBER = "hsl(38,92%,50%)";

const eventChartConfig: ChartConfig = {
  calculator_completed: { label: "Calcolatore completato", color: MAGENTA },
  scale_download: { label: "Download scala", color: GREEN },
  manual_download: { label: "Download manuale", color: BLUE },
};

const KpiCard = ({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  hint?: string;
}) => (
  <Card>
    <CardContent className="p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
        {hint && <p className="text-[11px] text-muted-foreground/70">{hint}</p>}
      </div>
    </CardContent>
  </Card>
);

/**
 * Admin dashboard overview (DAND Scale plan, point 6): registered users
 * by status, usage counters, breakdowns by professional role/country, a
 * monthly trend, and a CSV export — everything the Fondazione needs to
 * "dimostrare la diffusione e l'impatto della DAND Scale".
 */
export const AdminOverview = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const { toast } = useToast();

  const loadStats = async (range?: { fromDate?: string; toDate?: string }) => {
    try {
      setLoading(true);
      setLoadError(false);
      const data = await adminStatsService.getStats(range ?? { fromDate: fromDate || undefined, toDate: toDate || undefined });
      setStats(data);
    } catch (error) {
      console.error("Errore nel caricamento delle statistiche:", error);
      setLoadError(true);
      toast({
        title: "Errore",
        description: "Impossibile caricare le statistiche.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExport = async () => {
    try {
      setExporting(true);
      await adminStatsService.exportUsersCsv();
    } catch (error) {
      console.error("Errore nell'esportazione CSV:", error);
      toast({
        title: "Errore",
        description: "Impossibile esportare il CSV.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  // Pivot the flat {period, event_type, count}[] into one row per month
  // with one column per event type, for a multi-series chart.
  const timeseriesRows = useMemo(() => {
    if (!stats) return [];
    const byPeriod = new Map<string, Record<string, number | string>>();
    for (const point of stats.timeseries) {
      const row = byPeriod.get(point.period) ?? { period: point.period };
      row[point.event_type] = point.count;
      byPeriod.set(point.period, row);
    }
    return Array.from(byPeriod.values()).sort((a, b) =>
      String(a.period).localeCompare(String(b.period))
    );
  }, [stats]);

  const countryRows = useMemo(
    () => (stats?.by_country ?? []).slice(0, 8).map((r) => ({ name: r.label, count: r.count })),
    [stats]
  );
  const roleRows = useMemo(
    () => (stats?.by_professional_role ?? []).slice(0, 8).map((r) => ({ name: r.label, count: r.count })),
    [stats]
  );

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <AlertCircle className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {loadError ? "Impossibile caricare le statistiche." : "Nessun dato disponibile."}
        </p>
        {loadError && (
          <Button variant="outline" size="sm" onClick={() => loadStats()}>
            Riprova
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date range filter + export */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <Label htmlFor="from-date" className="text-xs">Da</Label>
          <Input id="from-date" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-40" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="to-date" className="text-xs">A</Label>
          <Input id="to-date" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-40" />
        </div>
        <Button variant="outline" onClick={() => loadStats()} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Applica filtro"}
        </Button>
        {(fromDate || toDate) && (
          <Button
            variant="ghost"
            onClick={() => {
              setFromDate("");
              setToDate("");
              loadStats({});
            }}
            disabled={loading}
          >
            Azzera
          </Button>
        )}
        <div className="flex-1" />
        <Button onClick={handleExport} disabled={exporting} className="flex items-center gap-2">
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
          Esporta utenti (CSV)
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard icon={Users} label="Utenti registrati" value={stats.users_total} hint={`${stats.users_approved} approvati · ${stats.users_pending} in attesa`} />
        <KpiCard icon={Calculator} label="Utilizzi calcolatore" value={stats.calculator_completions} hint={`${stats.calculator_starts} avviati`} />
        <KpiCard icon={Download} label="Download scala" value={stats.scale_downloads} />
        <KpiCard icon={Download} label="Download manuale" value={stats.manual_downloads} />
        <KpiCard icon={FileText} label="Download PDF risultati" value={stats.result_pdf_downloads} />
        <KpiCard icon={FileSpreadsheet} label="Download Excel risultati" value={stats.result_excel_downloads} />
        <KpiCard icon={Clock} label="In attesa di approvazione" value={stats.users_pending} />
        <KpiCard icon={Users} label="Registrazioni rifiutate" value={stats.users_rejected} />
      </div>

      {/* Monthly trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Andamento mensile</CardTitle>
          <CardDescription>Utilizzi del calcolatore e download nel periodo selezionato</CardDescription>
        </CardHeader>
        <CardContent>
          {timeseriesRows.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Nessun dato nel periodo selezionato.</p>
          ) : (
            <ChartContainer config={eventChartConfig} className="aspect-auto h-64 w-full">
              <LineChart data={timeseriesRows}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="period" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="calculator_completed" stroke={MAGENTA} strokeWidth={2} dot={false} name="Calcolatore" />
                <Line type="monotone" dataKey="scale_download" stroke={GREEN} strokeWidth={2} dot={false} name="Scala" />
                <Line type="monotone" dataKey="manual_download" stroke={BLUE} strokeWidth={2} dot={false} name="Manuale" />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Iscritti per Paese</CardTitle>
          </CardHeader>
          <CardContent>
            {countryRows.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Nessun dato disponibile.</p>
            ) : (
              <ChartContainer config={{ count: { label: "Utenti", color: GREEN } }} className="aspect-auto h-64 w-full">
                <BarChart data={countryRows} layout="vertical" margin={{ left: 16 }}>
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill={GREEN} radius={4} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Iscritti per ruolo professionale</CardTitle>
          </CardHeader>
          <CardContent>
            {roleRows.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Nessun dato disponibile.</p>
            ) : (
              <ChartContainer config={{ count: { label: "Utenti", color: MAGENTA } }} className="aspect-auto h-64 w-full">
                <BarChart data={roleRows} layout="vertical" margin={{ left: 16 }}>
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={140} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill={MAGENTA} radius={4} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
