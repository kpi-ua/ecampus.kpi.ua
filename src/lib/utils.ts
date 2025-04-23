import { clsx, type ClassValue } from 'clsx';
import { uid } from 'radash';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUniqueUserPhotoUrl = (profileUrl: string) => `${profileUrl}?v=${uid(8)}`;

export const toBetterFixed = (number: number, decimalPlaces: number) => Math.round(number * 10 ** decimalPlaces) / 10 ** decimalPlaces