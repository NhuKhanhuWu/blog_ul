/** @format */

import { format, parseISO } from "date-fns";

export const groupDataByDate = <T>(
  items: T[],
  dateKeySelector: (item: T) => string | Date,
): Record<string, T[]> => {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const rawDate = dateKeySelector(item);

    // Safely handle both Date objects and ISO string timestamps
    const dateObject =
      typeof rawDate === "string" ? parseISO(rawDate) : rawDate;
    const dateKey = format(dateObject, "yyyy-MM-dd");

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }

    acc[dateKey].push(item);
    return acc;
  }, {});
};
