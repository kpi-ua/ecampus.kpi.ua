import saveAs from 'file-saver';
import qs from 'query-string';

import { parseContentDispositionFilename } from '@/lib/utils';

import { LibraryEmployeeFilters } from './filter-employees';

interface ExportEmployeesOptions extends LibraryEmployeeFilters {
  departmentId?: number;
  letter?: string;
  locale: string;
}

export const exportEmployees = async (options: ExportEmployeesOptions) => {
  const url = qs.stringifyUrl({ url: '/api/library/export', query: { ...options } });
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to export Library employees: ${response.status}`);
  }

  const blob = await response.blob();
  const filename = parseContentDispositionFilename(response.headers.get('Content-Disposition') ?? '') ?? 'library.csv';
  saveAs(blob, filename);
};
