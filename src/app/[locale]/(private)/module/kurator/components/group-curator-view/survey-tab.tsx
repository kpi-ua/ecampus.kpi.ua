'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { getCuratorSurveys } from '@/actions/curator.actions';
import { EmptyRow } from '@/app/[locale]/(private)/module/kurator/components/EmptyRow';
import { LoadingRow } from '@/app/[locale]/(private)/module/kurator/components/group-curator-view/loading-row';
import { Heading4 } from '@/components/typography';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';

import { CURATOR_GROUP_STALE_TIME, curatorGroupQueryKeys } from './query-keys';
import { SurveyStudentRow } from './survey-student-row';
import { CuratorSurveyRow } from '@/app/[locale]/(private)/module/kurator/types';

interface Props {
  groupId: number;
  groupName: string;
}

export const SurveyTab = ({ groupId, groupName }: Props) => {
  const t = useTranslations('private.curator.lecturer.group-curator');
  const [search, setSearch] = useState('');
  const { data: rows = [], isFetching } = useQuery({
    queryKey: curatorGroupQueryKeys.surveys(groupId),
    queryFn: () => getCuratorSurveys(groupId),
    staleTime: CURATOR_GROUP_STALE_TIME,
  });
  const query = search.trim().toLocaleLowerCase();
  const students = rows.reduce<CuratorSurveyRow[][]>((groups, row) => {
    const group = groups.find((items) => items[0].studentId === row.studentId);
    if (group) {
      group.push(row);
    } else {
      groups.push([row]);
    }
    return groups;
  }, []);
  const filteredStudents = students.filter((studentRows) =>
    studentRows[0].fullName.toLocaleLowerCase().includes(query),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading4 className="m-0">{t('survey.title', { group: groupName })}</Heading4>
      </div>
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={t('filters.student-search')}
      />
      <div className="border-neutral-divider overflow-hidden rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('results.student')}</TableHead>
              <TableHead>{t('results.survey-count')}</TableHead>
              <TableHead>
                <span className="sr-only">{t('results.status')}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <Show when={!isFetching} fallback={<LoadingRow colSpan={3} />}>
              <Show when={filteredStudents.length > 0} fallback={<EmptyRow colSpan={3} />}>
                {filteredStudents.map((studentRows) => (
                  <SurveyStudentRow key={studentRows[0].studentId} rows={studentRows} />
                ))}
              </Show>
            </Show>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
