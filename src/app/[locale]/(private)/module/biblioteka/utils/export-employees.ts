import qs from 'query-string';

import { parseContentDispositionFilename } from '@/lib/utils';

import { LibraryEmployeeFilters } from './filter-employees';

interface ExportEmployeesOptions extends LibraryEmployeeFilters {
  departmentId?: number;
  letter?: string;
  label: string;
  locale: string;
}

export const exportEmployees = async (options: ExportEmployeesOptions) => {
  const url = qs.stringifyUrl({ url: '/api/library/export', query: { ...options } });
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to export Library employees: ${response.status}`);
  }

  const blob = await response.blob();
  const link = document.createElement('a');
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = parseContentDispositionFilename(response.headers.get('Content-Disposition') ?? '') ?? 'library.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};
