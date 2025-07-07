// src/components/projets/ProjetKPICard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

type ProjetKPICardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtext?: string;
};

export const ProjetKPICard = ({ title, value, icon, subtext }: ProjetKPICardProps) => (
  <Card>
    <CardContent className="pt-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-3xl font-bold">{value}</h2>
        {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
      </div>
      {icon}
    </CardContent>
  </Card>
);