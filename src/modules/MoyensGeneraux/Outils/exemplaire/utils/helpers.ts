// src/utils/helpers.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Fonction utilitaire pour combiner les classes Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fonction pour formatter la date
export function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    console.error("Invalid date format:", dateString, error);
    return dateString;
  }
}

// Fonction pour générer un ID unique
export function generateUniqueId(): string {
  return `EX-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
}