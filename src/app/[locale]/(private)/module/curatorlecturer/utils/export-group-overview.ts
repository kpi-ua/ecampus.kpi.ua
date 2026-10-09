import { saveAsBlob } from '@/lib/save-as-blob';

export const exportGroupOverview = async (groupId: number) => {
  const response = await fetch(`/api/curatorlecturer/groups/${groupId}/export`);

  if (!response.ok) {
    throw new Error(`Failed to export group overview: ${response.status}`);
  }

  await saveAsBlob(response, 'group-overview.csv');
};
