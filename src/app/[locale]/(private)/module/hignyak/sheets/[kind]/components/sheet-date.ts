import { EMPTY_VALUE } from '@/lib/constants/common';
import { formatDate, formatTime } from '@/lib/utils';

export function formatSheetDate(value: string | null) {
  const date = formatDate(value);
  return value && date ? `${date} ${formatTime(value)}` : EMPTY_VALUE;
}
