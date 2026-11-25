import { parseAsInteger, parseAsStringLiteral } from 'nuqs/server';

import { type DnvrSheetSummary } from '@/types/models/dnvr-sheets';

export const sheetStatuses = [
  'unfilledSheet',
  'filledSheet',
  'blockedSheet',
  'deletedSheet',
  'expiredSheet',
  'upcomingSheet',
] as const;
export const sheetTypes = ['mainSheet', 'additionalSheet', 'firstAdditionalSheet', 'secondAdditionalSheet'] as const;

export const sheetFilters = {
  course: parseAsInteger,
  status: parseAsStringLiteral(sheetStatuses),
  sheetType: parseAsStringLiteral(sheetTypes),
};

export function getSheetStatus(sheet: DnvrSheetSummary): (typeof sheetStatuses)[number] {
  if (sheet.isDeleted) {
    return 'deletedSheet';
  }
  if (sheet.isBlocked) {
    return 'blockedSheet';
  }
  if (sheet.isExpired) {
    return 'expiredSheet';
  }
  if (sheet.isUpcoming) {
    return 'upcomingSheet';
  }

  return sheet.markCount > 0 ? 'filledSheet' : 'unfilledSheet';
}

export function matchesSheetType(sheet: DnvrSheetSummary, type: (typeof sheetTypes)[number]) {
  switch (type) {
    case 'mainSheet':
      return !sheet.parentId;
    case 'additionalSheet':
      return !!sheet.parentId;
    case 'firstAdditionalSheet':
      return !!sheet.parentId && sheet.part === '1';
    case 'secondAdditionalSheet':
      return !!sheet.parentId && sheet.part === '2';
  }
}
