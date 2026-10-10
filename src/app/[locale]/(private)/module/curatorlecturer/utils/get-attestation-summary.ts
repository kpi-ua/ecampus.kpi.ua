import { sum } from 'radash';
import { CuratorStudentAttestationTotals } from '@/app/[locale]/(private)/module/curatorlecturer/types';

export const getAttestationSummary = (students: CuratorStudentAttestationTotals[]) => {
  const statuses = [
    { key: 'attested', count: sum(students, (student) => student.attested), color: 'bg-green-500' },
    { key: 'missing', count: sum(students, (student) => student.missing), color: 'bg-yellow-400' },
    {
      key: 'not-attested',
      count: sum(students, (student) => student.notAttested),
      color: 'bg-red-500',
    },
    {
      key: 'not-studying',
      count: sum(students, (student) => student.notStudying),
      color: 'bg-neutral-400',
    },
  ] as const;
  const total = sum(statuses, (status) => status.count);

  return { statuses: statuses.map((status) => ({ ...status, percentage: getPercentage(status.count, total) })), total };
};

const getPercentage = (count: number, total: number) => (total ? (count / total) * 100 : 0);
