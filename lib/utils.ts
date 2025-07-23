import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { ZodTypeAny } from "zod";

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);

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

export const formatHour = (date: Date) => {
  return dayjs.utc(date).local().format('HH:mm');
}


export function parseAndValidateFormData(
  formData: FormData,
  schema: ZodTypeAny,
  fields: string[]
): {
  data: Record<string, FormDataEntryValue | null>,
  result: ReturnType<typeof schema.safeParse>
} {
  const data: Record<string, FormDataEntryValue | null> = {};

  for (const field of fields) {
    data[field] = formData.get(field);
  }

  const result = schema.safeParse(data);

  return { data, result };
}