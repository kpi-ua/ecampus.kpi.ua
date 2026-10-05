import { CuratorAttestationStudent } from '@/app/[locale]/(private)/module/curatorlecturer/types';

export const getAttestationSummary = (students: CuratorAttestationStudent[]) => {
  const statuses = [
    { key: 'attested', count: students.reduce((sum, student) => sum + student.attested, 0), color: 'bg-green-500' },
    { key: 'missing', count: students.reduce((sum, student) => sum + student.missing, 0), color: 'bg-yellow-400' },
    {
      key: 'not-attested',
      count: students.reduce((sum, student) => sum + student.notAttested, 0),
      color: 'bg-red-500',
    },
    {
      key: 'not-studying',
      count: students.reduce((sum, student) => sum + student.notStudying, 0),
      color: 'bg-neutral-400',
    },
  ] as const;
  const total = statuses.reduce((sum, status) => sum + status.count, 0);

  return { statuses, total };
};
