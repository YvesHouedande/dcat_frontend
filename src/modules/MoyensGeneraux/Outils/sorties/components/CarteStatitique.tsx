import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartColumn } from "lucide-react";

interface StatItem {
  label: string;
  value: number;
  percent?: number;
  color?: string;
}

interface CarteStatitiqueProps {
  nombreexemplaireSorties: number; // Remplacez par le type approprié
  stats: StatItem[];
  totalSorties: number;
}

function CarteStatitique({
  nombreexemplaireSorties,
  stats,
  totalSorties,
}: CarteStatitiqueProps) {
  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            <ChartColumn className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color || ""}`}>
              {stat.value}
            </div>
            {typeof stat.percent === "number" && (
              <p className="text-xs text-muted-foreground">
                {nombreexemplaireSorties > 0
                  ? `${stat.percent.toFixed(1)}% du total (${totalSorties})`
                  : "Aucune sortie"}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export default CarteStatitique;
