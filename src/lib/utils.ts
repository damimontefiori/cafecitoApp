import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
}

export function isWithinBusinessHours(): boolean {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 9 && hour < 17;
}

export function getBusinessHoursMessage(): string {
  if (isWithinBusinessHours()) {
    return "¡Estamos abiertos! Haz tu pedido.";
  }
  return "Lo sentimos, solo aceptamos pedidos de 9:00 a 17:00 horas.";
}
