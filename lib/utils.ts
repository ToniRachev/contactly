import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatFullName = (firstName: string, lastName: string): string =>
  `${firstName.charAt(0).toUpperCase() + firstName.slice(1)}
    ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`.trim();

export const formatRelativeTime = (date: string): string => {
  const past = dayjs(date);
  return past.fromNow();
}