import KPICard from "./KPICards";
import TaskDistributionChart from "./TaskDistributionChart";
import TaskProgressChart from "./TaskProgressChart";
import ProjectList from "./ProjectList";
import PriorityTaskList from "./PriorityTaskList";
import { mockKPIs, mockProjects, mockTaskDistribution, mockPriorityTasks, mockTaskProgress } from "../../data/mockData";

const Dashboard = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Cartes KPI */}
      <div className="flex flex-nowrap gap-6 overflow-x-auto">
        {mockKPIs.map((kpi, index) => (
          <KPICard key={index} title={kpi.title} value={kpi.value} percentage={kpi.percentage} trend={kpi.trend} />
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TaskDistributionChart data={mockTaskDistribution} />
        <TaskProgressChart data={mockTaskProgress} />
      </div>

      {/* Tableaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProjectList projects={mockProjects} />
        <PriorityTaskList tasks={mockPriorityTasks} />
      </div>
    </div>
  );
};

export default Dashboard;
