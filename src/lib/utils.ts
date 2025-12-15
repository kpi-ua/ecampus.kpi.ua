import { clsx, type ClassValue } from 'clsx';
import { uid } from 'radash';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUniqueUserPhotoUrl = (profileUrl: string) => `${profileUrl}?v=${uid(8)}`;

export const round = (number: number, decimalPlaces: number = 2) =>
  Math.round(number * 10 ** decimalPlaces) / 10 ** decimalPlaces;

export const formatNumber = (num: number, decimals: number = 2, locale: string = 'uk-UA') =>
  num.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

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

export function linkifyText(text: string): React.ReactNode[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      urlRegex.lastIndex = 0;
      return React.createElement(
        'a',
        {
          key: index,
          href: part,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'text-basic-blue hover:underline',
        },
        part
      );
    }
    return part;
  });
}
