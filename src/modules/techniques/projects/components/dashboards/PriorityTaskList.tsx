// src/components/PriorityTaskList.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type PriorityTask = {
  name: string;
  status: string;
  dueDate: string;
};

interface PriorityTaskListProps {
  tasks: PriorityTask[];
}

const PriorityTaskList = ({ tasks }: PriorityTaskListProps) => {
  return (
    <div className="border rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Tâches Prioritaires</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Échéance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRow key={index}>
              <TableCell>{task.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {task.status}
                </Badge>
              </TableCell>
              <TableCell>{task.dueDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PriorityTaskList;
