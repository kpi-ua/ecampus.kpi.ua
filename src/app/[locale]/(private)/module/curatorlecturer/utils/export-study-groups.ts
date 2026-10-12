import { saveAsBlob } from '@/lib/save-as-blob';

export const exportStudyGroups = async () => {
  const response = await fetch('/api/curatorlecturer/teaching-groups/export');

  if (!response.ok) {
    throw new Error(`Failed to export study groups: ${response.status}`);
  }

  await saveAsBlob(response, 'study-groups.csv');
};
