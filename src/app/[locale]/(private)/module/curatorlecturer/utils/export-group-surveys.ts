import { saveAsBlob } from '@/lib/save-as-blob';

export const exportGroupSurveys = async (groupId: number) => {
  const response = await fetch(`/api/curatorlecturer/groups/${groupId}/surveys/export`);

  if (!response.ok) {
    throw new Error(`Failed to export group surveys: ${response.status}`);
  }

  await saveAsBlob(response, 'group-surveys.csv');
};
