'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { getCuratorStudentAttestations } from '@/actions/curatorlecturer.actions';
import { Heading4 } from '@/components/typography/index';
import { Input } from '@/components/ui/input';
import { Show } from '@/components/utils/show';
import { CuratorFilters } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { AttestationSummary } from './attestation-summary';
import { AttestationStudentTable } from './attestation-student-table';
import { useAttestationFilters } from '@/app/[locale]/(private)/module/curatorlecturer/components/group-curator-view/attestation/hooks/use-attestation-filters';
import {
  CURATOR_GROUP_STALE_TIME,
  curatorGroupQueryKeys,
} from '@/app/[locale]/(private)/module/curatorlecturer/components/group-curator-view/shared/query-keys';

interface Props {
  groupId: number;
  filters: CuratorFilters;
}

export const AttestationStudents = ({ groupId, filters }: Props) => {
  const state = useAttestationFilters();
  const t = useTranslations('private.curatorlecturer.group-curator');
  const [search, setSearch] = useState('');
  const { params, onlyNotAttested, onlyRepeated, showRepeated, enabled } = state;
  const attestationName = showRepeated
    ? t('attestation.both-attestations')
    : (filters.attestations.find((item) => item.id === params.attestationId)?.name ?? '');
  const { data, isFetching } = useQuery({
    queryKey: [
      ...curatorGroupQueryKeys.attestations(groupId, params.yearId, params.semester, params.attestationId),
      'students',
    ],
    queryFn: () => getCuratorStudentAttestations(groupId, params),
    enabled,
    staleTime: CURATOR_GROUP_STALE_TIME,
  });

  return (
    <div className="flex flex-col gap-6">
      <Show when={!isFetching}>
        <AttestationSummary students={data?.summaryStudents ?? []} attestationName={attestationName} />
      </Show>
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={t('filters.student-search')}
      />
      <Show
        when={!!data}
        fallback={
          <AttestationStudentTable
            students={[]}
            search={search}
            onlyNotAttested={onlyNotAttested}
            onlyRepeated={onlyRepeated}
            showRepeated={showRepeated}
            isFetching={isFetching}
          />
        }
      >
        {data?.semesters.map((term) => (
          <section key={term.semester} className="flex flex-col gap-4">
            <Heading4 className="m-0">
              {t('attestation.semester-title', {
                semester: t(term.semester === 1 ? 'attestation.first-semester' : 'attestation.second-semester'),
                attestation: attestationName,
              })}
            </Heading4>
            <AttestationStudentTable
              students={term.students}
              search={search}
              onlyNotAttested={onlyNotAttested}
              onlyRepeated={onlyRepeated}
              showRepeated={showRepeated}
              isFetching={isFetching}
            />
          </section>
        ))}
      </Show>
    </div>
  );
};
