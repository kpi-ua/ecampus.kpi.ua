import queryString from 'query-string';

import { saveAsBlob } from '@/lib/save-as-blob';

import { CuratorSurveyParams } from '../types';

export const exportGroupSurveys = async (groupId: number, params: CuratorSurveyParams = {}) => {
  const query = queryString.stringify({ ...params }, { skipEmptyString: true, skipNull: true });
  const response = await fetch(`/api/curatorlecturer/groups/${groupId}/surveys/export?${query}`);

  if (!response.ok) {
    throw new Error(`Failed to export group surveys: ${response.status}`);
  }

  await saveAsBlob(response, 'group-surveys.csv');
};
