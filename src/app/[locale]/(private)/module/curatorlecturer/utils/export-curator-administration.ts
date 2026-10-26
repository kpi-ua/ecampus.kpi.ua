import saveAs from 'file-saver';
import queryString from 'query-string';

import { parseContentDispositionFilename } from '@/lib/utils';

interface Params {
  yearId: number;
  departmentId?: number;
  search: string;
}

export const exportCuratorAdministration = async (params: Params) => {
  const response = await fetch(
    `/api/curatorlecturer/admin/groups/export?${queryString.stringify(params, { skipEmptyString: true, skipNull: true })}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to export curator administration: ${response.status}`);
  }

  const blob = await response.blob();
  const filename =
    parseContentDispositionFilename(response.headers.get('Content-Disposition') ?? '') ?? 'curator-administration.csv';
  saveAs(blob, filename);
};
