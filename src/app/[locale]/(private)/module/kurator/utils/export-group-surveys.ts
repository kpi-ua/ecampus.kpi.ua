import saveAs from 'file-saver';

import { parseContentDispositionFilename } from '@/lib/utils';

export const exportGroupSurveys = async (groupId: number) => {
  const response = await fetch(`/api/kurator/groups/${groupId}/surveys/export`);

  if (!response.ok) {
    throw new Error(`Failed to export group surveys: ${response.status}`);
  }

  const blob = await response.blob();
  const filename =
    parseContentDispositionFilename(response.headers.get('Content-Disposition') ?? '') ?? 'group-surveys.csv';
  saveAs(blob, filename);
};
