// src/components/taches/TacheKPICard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

type TacheKPICardProps = {
  title: string;
  value: string | number;
  icon: ReactNode; // Un élément React (ex: une icône Lucide React)
  subtext?: string; // Texte additionnel facultatif
};

export const TacheKPICard = ({ title, value, icon, subtext }: TacheKPICardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
    </CardContent>
  </Card>
);