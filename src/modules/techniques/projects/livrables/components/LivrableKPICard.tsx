// src/components/livrables/LivrableKPICard.tsx
import React from "react"; // Import React explicitly
import { Card, CardContent } from "@/components/ui/card";

type LivrableKPICardProps = {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode; // Add icon prop to accept any React node (e.g., Lucide icon)
};

export const LivrableKPICard: React.FC<LivrableKPICardProps> = ({ title, value, subtext, icon }) => (
  <Card>
    <CardContent className="pt-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-3xl font-bold">{value}</h2>
        {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
      </div>
      {icon && <div className="ml-4 text-gray-400">{icon}</div>} {/* Render the icon if provided */}
    </CardContent>
  </Card>
);
