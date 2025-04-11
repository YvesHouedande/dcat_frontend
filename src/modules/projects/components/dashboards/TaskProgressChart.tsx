// src/projects/components/dashboard/TaskProgressChart.tsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Définir un type pour les props
interface TaskProgressChartProps {
  data: { date: string; created: number; completed: number }[]; // Définir la structure des données
}

const TaskProgressChart: React.FC<TaskProgressChartProps> = ({ data }) => {
  return (
    <div className="border rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Progrès des Tâches</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="completed" stroke="#34d399" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskProgressChart;
