import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export type OperationKPICardProps = {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
};

export const OperationKPICard: React.FC<OperationKPICardProps> = ({ title, value, subtext, icon }) => (
  <Card>
    <CardContent className="pt-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-3xl font-bold">{value}</h2>
        {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
      </div>
      {icon && <div className="ml-4 text-gray-400">{icon}</div>}
    </CardContent>
  </Card>
); 