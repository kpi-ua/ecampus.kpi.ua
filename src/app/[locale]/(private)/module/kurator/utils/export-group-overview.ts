import saveAs from 'file-saver';

import { parseContentDispositionFilename } from '@/lib/utils';

export const exportGroupOverview = async (groupId: number) => {
  const response = await fetch(`/api/kurator/groups/${groupId}/export`);

  if (!response.ok) {
    throw new Error(`Failed to export group overview: ${response.status}`);
  }

  const blob = await response.blob();
  const filename =
    parseContentDispositionFilename(response.headers.get('Content-Disposition') ?? '') ?? 'group-overview.csv';
  saveAs(blob, filename);
};
