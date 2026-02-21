import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { IEvent, ILocation } from "./types";

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

export const getGoogleMapsLink = (loc: Partial<ILocation> | string | null | undefined) => {
  const queryParts =
    typeof loc === "string"
      ? [loc]
      : [
          loc?.street,
          loc?.city,
          [loc?.state, loc?.zip].filter(Boolean).join(" "),
          loc?.country,
        ];

  const query = queryParts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(", ");

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

export function parseEvents(events: IEvent[]): IEvent[] {
  return events.map((event) => ({
    ...event,
    dateStart: new Date(event.dateStart),
    dateEnd: event.dateEnd ? new Date(event.dateEnd) : undefined,
  }));
}

// remove once we're using an ORM
export function sortEvents(events: IEvent[]): IEvent[] {
  return [...events].sort((a, b) => {
    // if (a.isFeatured && !b.isFeatured) return -1;
    // if (!a.isFeatured && b.isFeatured) return 1;
    return new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime();
  });
}
