// src/techniques/projects/components/TaskItem.tsx
import { Task } from "../../types/types";
import { StatusBadge } from "./StatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Calendar, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type TaskItemProps = {
  task: Task;
  onStatusChange?: (id: string, newStatus: Task['statut']) => void;
  className?: string;
};

export const TaskItem = ({ task, onStatusChange, className }: TaskItemProps) => {
  const isOverdue = new Date(task.date_fin) < new Date() && task.statut !== 'terminé';

  return (
    <div className={cn(
      "flex items-center gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow",
      isOverdue && "border-red-200 bg-red-50",
      className
    )}>
      <Checkbox 
        checked={task.statut === 'terminé'}
        onCheckedChange={(checked) => {
          if (onStatusChange) {
            onStatusChange(task.id_tache, checked ? 'terminé' : 'à faire');
          }
        }}
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{task.nom_tache}</h3>
        {task.desc_tache && (
          <p className="text-sm text-muted-foreground truncate">{task.desc_tache}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <StatusBadge status={task.statut} />
          <div className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            task.priorite === 'faible' && "bg-green-100 text-green-800",
            task.priorite === 'moyenne' && "bg-yellow-100 text-yellow-800",
            task.priorite === 'haute' && "bg-orange-100 text-orange-800",
            task.priorite === 'critique' && "bg-red-100 text-red-800",
          )}>
            {task.priorite}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {task.assigne_a && (
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{task.assigne_a}</span>
          </div>
        )}
        <div className={cn(
          "flex items-center gap-1",
          isOverdue && "text-red-600"
        )}>
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(task.date_fin), 'dd MMM yyyy', { locale: fr })}
          </span>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Éditer</DropdownMenuItem>
          <DropdownMenuItem>Changer de statut</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};