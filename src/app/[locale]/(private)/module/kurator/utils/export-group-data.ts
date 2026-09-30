import qs from 'query-string';

import { parseContentDispositionFilename } from '@/lib/utils';

export type CuratorExportType = 'overview' | 'attestation' | 'survey';

interface ExportGroupDataOptions {
  groupId: number;
  type: CuratorExportType;
  search: string;
  locale: string;
  yearId?: number;
  semester?: number;
  attestationId?: number;
}

export const exportGroupData = async (options: ExportGroupDataOptions) => {
  const { groupId, ...query } = options;
  const url = qs.stringifyUrl({ url: `/api/kurator/groups/${groupId}/export`, query });
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to export curator data: ${response.status}`);
  }

  const blob = await response.blob();
  const link = document.createElement('a');
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = parseContentDispositionFilename(response.headers.get('Content-Disposition') ?? '') ?? 'curator.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
};
