import dayjs from 'dayjs';

import { ReportCell } from '../types';

export const formatReportCell = (
  row: Record<string, ReportCell>,
  column: string,
  translate: (key: string) => string,
): string | number => {
  const value = row[column];
  if (column === 'Part' && (value === null || value === undefined || value === '')) return translate('values.part-0');
  if (value === null || value === undefined || value === '') return '';
  if (column === 'Mark' && Number(value) === 101) return translate('values.not-admitted');
  if (column === 'Mark' && Number(value) === 102) return translate('values.not-graded');
  if (column === 'IsShedule') return translate(Number(value) === 1 ? 'values.yes' : 'values.no');
  if (column === 'Part' && [0, 1, 2].includes(Number(value))) return translate(`values.part-${value}`);
  if (column === 'vcStatus') {
    if (Number(value) === 1) return translate('values.submitted');
    const current = dayjs(String(row.DateCurrent));
    if (current.isAfter(dayjs(String(row.DateEnd)))) return translate('values.closed');
    if (current.isBefore(dayjs(String(row.DateStart)))) return translate('values.pending');
    return translate('values.editing');
  }
  if (
    ['DateEvent', 'DateStart', 'DateEnd', 'SheduleDate', 'activeDate'].includes(column) &&
    typeof value === 'string'
  ) {
    const date = dayjs(value);
    if (date.isValid()) return date.format('DD.MM.YYYY');
  }
  return typeof value === 'boolean' ? translate(value ? 'values.yes' : 'values.no') : value;
};
