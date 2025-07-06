import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/** Склейка классов с учётом Tailwind-приоритетов */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
