import queryString from 'query-string';

import { saveAsBlob } from '@/lib/save-as-blob';

import { CuratorAttestationParams } from '../types';

export const exportDisciplineAttestations = async (groupId: number, params: CuratorAttestationParams) => {
  const query = queryString.stringify({ ...params }, { skipEmptyString: true, skipNull: true });
  const response = await fetch(`/api/curatorlecturer/groups/${groupId}/attestations/disciplines/export?${query}`);

  if (!response.ok) {
    throw new Error(`Failed to export attestations: ${response.status}`);
  }

  await saveAsBlob(response, 'attestations.csv');
};
