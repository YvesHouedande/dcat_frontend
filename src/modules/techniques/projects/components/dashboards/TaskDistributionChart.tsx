// src/projects/components/dashboard/TaskDistributionChart.tsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Définir un type pour les props
interface TaskDistributionChartProps {
  data: { name: string; value: number; color: string }[]; // Définir la structure des données
}

const TaskDistributionChart: React.FC<TaskDistributionChartProps> = ({ data }) => {
  const COLORS = data.map((item) => item.color);

  return (
    <div className="border rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Répartition des Tâches</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskDistributionChart;
