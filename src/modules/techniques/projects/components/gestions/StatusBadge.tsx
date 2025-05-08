// src/techniques/projects/components/StatusBadge.tsx
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
  className?: string;
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusColors = {
    'planifié': 'bg-blue-100 text-blue-800',
    'en cours': 'bg-yellow-100 text-yellow-800',
    'terminé': 'bg-green-100 text-green-800',
    'annulé': 'bg-red-100 text-red-800',
    'à faire': 'bg-gray-100 text-gray-800',
    'en revue': 'bg-purple-100 text-purple-800',
    'bloqué': 'bg-red-100 text-red-800',
    'en attente': 'bg-yellow-100 text-yellow-800',
    'approuvé': 'bg-green-100 text-green-800',
    'rejeté': 'bg-red-100 text-red-800',
    'révisions requises': 'bg-orange-100 text-orange-800',
    'brouillon': 'bg-gray-100 text-gray-800',
    'validé': 'bg-green-100 text-green-800',
    'archivé': 'bg-blue-100 text-blue-800',
    'obsolète': 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800',
        className
      )}
    >
      {status}
    </span>
  );
};