/** @format */

import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

export function formatDate(date: Date | string) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return formattedDate;
}

export function getDateDistance(time: Date) {
  const result = formatDistanceToNow(new Date(time), {
    locale: enUS,
  });

  return result;
}
