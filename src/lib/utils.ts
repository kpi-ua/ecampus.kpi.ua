import { clsx, type ClassValue } from 'clsx';
import { uid } from 'radash';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUniqueUserPhotoUrl = (profileUrl: string) => `${profileUrl}?v=${uid(8)}`;

export const round = (number: number, decimalPlaces: number = 2) =>
  Math.round(number * 10 ** decimalPlaces) / 10 ** decimalPlaces;

export const downloadFile = (url: string, name: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  link.remove();
};

export const parseContentDispositionFilename = (header: string): string | null => {
  const starMatch = header.match(/filename\*\s*=\s*([^']*)''([^;]+)/i);
  if (starMatch) {
    try {
      return decodeURIComponent(starMatch[2]);
    } catch {
      return starMatch[2];
    }
  }
  const match = header.match(/filename\s*=\s*("?)([^";]+)\1/i);
  return match ? match[2] : null;
};
