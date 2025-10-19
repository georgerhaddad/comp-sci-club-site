import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Location } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDay = (date: Date): string => {
  return date.toLocaleDateString("en-US", { day: "numeric" });
};

export const getMonthShort = (date: Date): string => {
  return date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
};

// TODO: Use in Event page
export const getFormattedDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const getTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

export const getGoogleMapsLink = (loc: Location | string) => {
  const query =
    typeof loc === "string"
      ? loc
      : `${loc.street}, ${loc.city}, ${loc.state} ${loc.zip}, ${loc.country}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};
