/** @format */

import { format, parseISO } from "date-fns";

/**
 * A highly flexible, generic function to group any data array by a date property.
 */
export const groupDataByDate = <T extends Record<string, unknown>>(
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
