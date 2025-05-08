// src/techniques/projects/components/ProjectCard.tsx
import { Project } from "../../types/types";
import { StatusBadge } from "./StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type ProjectCardProps = {
  project: Project;
  progress?: number;
  tasksCount?: number;
  className?: string;
};

export const ProjectCard = ({ 
  project, 
  progress = 0, 
  tasksCount = 0, 
  className 
}: ProjectCardProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{project.nom_projet}</CardTitle>
        <div className="flex items-center gap-2">
          <StatusBadge status={project.etat} />
          <span className="text-sm text-muted-foreground">
            {project.type_projet}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm">
            <span>Tâches</span>
            <span>{tasksCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Dates</span>
            <span>
              {new Date(project.date_debut).toLocaleDateString()} -{" "}
              {new Date(project.date_fin).toLocaleDateString()}
            </span>
          </div>
          <div className="text-sm">
            <span>Responsable: </span>
            <span className="font-medium">{project.responsable}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};