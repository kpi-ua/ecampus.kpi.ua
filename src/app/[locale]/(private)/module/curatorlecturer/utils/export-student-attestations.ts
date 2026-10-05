import saveAs from 'file-saver';
import queryString from 'query-string';

import { parseContentDispositionFilename } from '@/lib/utils';

import { CuratorAttestationParams } from '../types';

export const exportStudentAttestations = async (groupId: number, params: CuratorAttestationParams) => {
  const query = queryString.stringify({ ...params }, { skipEmptyString: true, skipNull: true });
  const response = await fetch(`/api/curatorlecturer/groups/${groupId}/attestations/students/export?${query}`);

  if (!response.ok) {
    throw new Error(`Failed to export attestations: ${response.status}`);
  }

  const filename =
    parseContentDispositionFilename(response.headers.get('Content-Disposition') ?? '') ?? 'attestations.csv';
  saveAs(await response.blob(), filename);
};
