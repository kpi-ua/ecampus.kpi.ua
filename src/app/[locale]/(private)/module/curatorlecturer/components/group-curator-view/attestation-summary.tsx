'use client';

import { useTranslations } from 'next-intl';

import { CuratorAttestationStudent } from '../../types';

interface Props {
  students: CuratorAttestationStudent[];
  attestationName: string;
}

export const AttestationSummary = ({ students, attestationName }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator.results');
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

  return (
    <div className="border-neutral-divider flex flex-col gap-4 rounded-lg border p-5">
      <div className="flex flex-wrap justify-between gap-2 text-sm text-neutral-500">
        <span>{t('group-summary')}</span>
        <span>
          {attestationName} · {t('result-count', { count: total })}
        </span>
      </div>
      <div className="flex h-6 overflow-hidden rounded-lg bg-neutral-100" aria-hidden="true">
        {statuses.map((status) => (
          <div
            key={status.key}
            className={status.color}
            style={{ width: `${total ? (status.count / total) * 100 : 0}%` }}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
        {statuses.map((status) => (
          <div key={status.key}>
            <div className="flex items-center gap-2">
              <span className={`size-2 rounded-full ${status.color}`} />
              {t(status.key)}
            </div>
            <p className="mt-1 pl-4 text-neutral-500">
              {status.count} ({total ? Math.round((status.count / total) * 100) : 0}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
