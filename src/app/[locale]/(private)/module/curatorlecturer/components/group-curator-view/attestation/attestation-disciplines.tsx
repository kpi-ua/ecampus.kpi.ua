'use client';

import { useQuery } from '@tanstack/react-query';
import { useDeferredValue, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { getCuratorDisciplineAttestations } from '@/actions/curatorlecturer.actions';
import { Heading4 } from '@/components/typography/index';
import { Input } from '@/components/ui/input';
import { Show } from '@/components/utils/show';
import { CuratorFilters } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { AttestationSummary } from './attestation-summary';
import { AttestationDisciplineTable } from './attestation-discipline-table';
import { useAttestationFilters } from '@/app/[locale]/(private)/module/curatorlecturer/components/group-curator-view/attestation/hooks/use-attestation-filters';
import {
  CURATOR_GROUP_STALE_TIME,
  curatorGroupQueryKeys,
} from '@/app/[locale]/(private)/module/curatorlecturer/components/group-curator-view/shared/query-keys';

import { filterAttestationResults } from '@/app/[locale]/(private)/module/curatorlecturer/utils/filter-attestation-results';
interface Props {
  groupId: number;
  filters: CuratorFilters;
}

export const AttestationDisciplines = ({ groupId, filters }: Props) => {
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
      'disciplines',
    ],
    queryFn: () => getCuratorDisciplineAttestations(groupId, params),
    enabled,
    staleTime: CURATOR_GROUP_STALE_TIME,
  });

  const deferredSearch = useDeferredValue(search);
  const filteredData = useMemo(
    () =>
      data?.semesters.map((term) => ({
        ...term,
        disciplines: filterAttestationResults(
          term.disciplines,
          (discipline) => `${discipline.name} ${discipline.lecturerName}`,
          { search: deferredSearch, onlyNotAttested, onlyRepeated, showRepeated },
        ),
      })),
    [data, deferredSearch, onlyNotAttested, onlyRepeated, showRepeated],
  );

  return (
    <div className="flex flex-col gap-6">
      <Show when={!isFetching}>
        <AttestationSummary students={data?.summaryStudents ?? []} attestationName={attestationName} />
      </Show>
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={t('results.discipline-search')}
      />
      <Show
        when={!!data}
        fallback={<AttestationDisciplineTable disciplines={[]} showRepeated={showRepeated} isFetching={isFetching} />}
      >
        {filteredData?.map((term) => (
          <section key={term.semester} className="flex flex-col gap-4">
            <Heading4 className="m-0">
              {t('attestation.semester-title', {
                semester: t(term.semester === 1 ? 'attestation.first-semester' : 'attestation.second-semester'),
                attestation: attestationName,
              })}
            </Heading4>
            <AttestationDisciplineTable
              disciplines={term.disciplines}
              showRepeated={showRepeated}
              isFetching={isFetching}
            />
          </section>
        ))}
      </Show>
    </div>
  );
};
