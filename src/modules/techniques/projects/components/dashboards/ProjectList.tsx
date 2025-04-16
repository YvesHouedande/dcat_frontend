// src/components/ProjectList.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type Project = {
  name: string;
  owner: string;
  progress: number;
};

interface ProjectListProps {
  projects: Project[];
}

const ProjectList = ({ projects }: ProjectListProps) => {
  return (
    <div className="border rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Projets Récents</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Projet</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Propriétaire</TableHead>
            <TableHead>Progression</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project, index) => (
            <TableRow key={index}>
              <TableCell>{`PRJ-2023-${(index + 1).toString().padStart(3, "0")}`}</TableCell>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.owner}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={project.progress} className="h-2" />
                  <span>{project.progress}%</span>
                </div>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  Voir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectList;
