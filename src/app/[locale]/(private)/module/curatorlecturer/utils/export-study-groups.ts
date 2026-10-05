import saveAs from 'file-saver';

import { parseContentDispositionFilename } from '@/lib/utils';

export const exportStudyGroups = async () => {
  const response = await fetch('/api/curatorlecturer/teaching-groups/export');

  if (!response.ok) {
    throw new Error(`Failed to export study groups: ${response.status}`);
  }

  const blob = await response.blob();
  const filename =
    parseContentDispositionFilename(response.headers.get('Content-Disposition') ?? '') ?? 'study-groups.csv';
  saveAs(blob, filename);
};
