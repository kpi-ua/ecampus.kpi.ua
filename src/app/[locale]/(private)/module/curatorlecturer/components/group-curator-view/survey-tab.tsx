'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { getCuratorSurveys } from '@/actions/curatorlecturer.actions';
import { EmptyRow } from '@/app/[locale]/(private)/module/curatorlecturer/components/EmptyRow';
import { LoadingRow } from '@/app/[locale]/(private)/module/curatorlecturer/components/group-curator-view/loading-row';
import { Heading4 } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { exportGroupSurveys } from '../../utils/export-group-surveys';

import { CURATOR_GROUP_STALE_TIME, curatorGroupQueryKeys } from './query-keys';
import { SurveyStudentRow } from './survey-student-row';
import { groupSurveysByStudent } from '@/app/[locale]/(private)/module/curatorlecturer/utils/group-surveys-by-student';

interface Props {
  groupId: number;
  groupName: string;
}

export const SurveyTab = ({ groupId, groupName }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator');
  const { errorToast } = useServerErrorToast();
  const exportMutation = useMutation({
    mutationFn: () => exportGroupSurveys(groupId),
    onError: () => errorToast(),
  });
  const [search, setSearch] = useState('');
  const { data: students = [], isFetching } = useQuery({
    queryKey: curatorGroupQueryKeys.surveys(groupId),
    queryFn: () => getCuratorSurveys(groupId),
    staleTime: CURATOR_GROUP_STALE_TIME,
    select: groupSurveysByStudent,
  });
  const query = search.trim().toLocaleLowerCase();
  const filteredStudents = students.filter((studentRows) =>
    studentRows[0].fullName.toLocaleLowerCase().includes(query),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading4 className="m-0">{t('survey.title', { group: groupName })}</Heading4>
        <Button variant="secondary" loading={exportMutation.isPending} onClick={() => exportMutation.mutate()}>
          <Download className="size-4" />
          {t('export')}
        </Button>
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
