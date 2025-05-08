// src/techniques/projects/components/KPICard.tsx
import { ArrowUp, ArrowDown, Equal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type KPICardProps = {
  title: string;
  value: string | number;
  change?: number;
  description?: string;
};

export const KPICard = ({ title, value, change, description }: KPICardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {change > 0 ? (
              <ArrowUp className="h-3 w-3 text-green-500" />
            ) : change < 0 ? (
              <ArrowDown className="h-3 w-3 text-red-500" />
            ) : (
              <Equal className="h-3 w-3 text-gray-500" />
            )}
            {Math.abs(change)}% par rapport à la période précédente
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};