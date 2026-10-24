'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { getCuratorSurveys } from '@/actions/curatorlecturer.actions';
import { EmptyRow } from '@/app/[locale]/(private)/module/curatorlecturer/components/EmptyRow';
import { LoadingRow } from '@/app/[locale]/(private)/module/curatorlecturer/components/group-curator-view/shared/loading-row';
import {
  CURATOR_GROUP_STALE_TIME,
  curatorGroupQueryKeys,
} from '@/app/[locale]/(private)/module/curatorlecturer/components/group-curator-view/shared/query-keys';
import { CuratorFilters, CuratorSurveyParams } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { exportGroupSurveys } from '@/app/[locale]/(private)/module/curatorlecturer/utils/export-group-surveys';
import { groupSurveysByStudent } from '@/app/[locale]/(private)/module/curatorlecturer/utils/group-surveys-by-student';
import { Heading4 } from '@/components/typography/index';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

import { SurveyStudentRow } from './survey-student-row';

interface Props {
  groupId: number;
  groupName: string;
  filters: CuratorFilters;
  defaultYearId: number;
}

export const SurveyTab = ({ groupId, groupName, filters, defaultYearId }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator');
  const tFilters = useTranslations('private.curatorlecturer.filters');
  const { errorToast } = useServerErrorToast();
  const [search, setSearch] = useState('');
  const [onlyIncomplete, setOnlyIncomplete] = useState(false);
  const [yearId, setYearId] = useState(String(defaultYearId));
  const [semester, setSemester] = useState('all');
  const params: CuratorSurveyParams = {
    yearId: Number(yearId),
    semester: semester === 'all' ? undefined : Number(semester),
  };
  const exportMutation = useMutation({
    mutationFn: () => exportGroupSurveys(groupId, params),
    onError: () => errorToast(),
  });
  const { data: students = [], isFetching } = useQuery({
    queryKey: curatorGroupQueryKeys.surveys(groupId, params.yearId, params.semester),
    queryFn: () => getCuratorSurveys(groupId, params),
    enabled: !!params.yearId,
    staleTime: CURATOR_GROUP_STALE_TIME,
    select: groupSurveysByStudent,
  });
  const query = search.trim().toLocaleLowerCase();
  const incompleteCount = students.filter((rows) => rows.some((row) => !row.hasVoted)).length;
  const filteredStudents = students.filter(
    (rows) =>
      rows[0].fullName.toLocaleLowerCase().includes(query) && (!onlyIncomplete || rows.some((row) => !row.hasVoted)),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-6">
        <Heading4 className="m-0 shrink-0">{t('survey.title', { group: groupName })}</Heading4>
        <div className="ml-auto flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500">{tFilters('year')}</span>
            <Select value={yearId} onValueChange={setYearId}>
              <SelectTrigger
                className="w-auto shrink-0 gap-2 whitespace-nowrap [&>span]:line-clamp-none"
                variant="small"
              >
                <SelectValue placeholder={tFilters('year')} />
              </SelectTrigger>
              <SelectContent>
                {filters.years.map((year) => (
                  <SelectItem key={year.id} value={year.id.toString()}>
                    {year.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500">{tFilters('half-year')}</span>
            <Tabs value={semester} onValueChange={setSemester}>
              <TabsList size="small" className="inline-grid w-max grid-cols-3 bg-white">
                <TabsTrigger value="all">{tFilters('all')}</TabsTrigger>
                <TabsTrigger value="1">{tFilters('first-semester')}</TabsTrigger>
                <TabsTrigger value="2">{tFilters('second-semester')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Button
            variant="secondary"
            size="small"
            loading={exportMutation.isPending}
            disabled={!params.yearId || isFetching}
            onClick={() => exportMutation.mutate()}
          >
            <Download className="size-4" />
            {t('export')}
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <div className="min-w-64 flex-1">
          <Input
            value={search}
            size="small"
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('filters.student-search')}
          />
        </div>
        <Show when={!isFetching}>
          <Badge variant="neutral" className="border-neutral-divider border bg-white font-normal" role="status">
            {t('survey.incomplete-count', { count: incompleteCount, total: students.length })}
          </Badge>
        </Show>
        <Label className="flex items-center gap-3 text-sm font-normal text-neutral-600">
          {t('survey.only-incomplete')}
          <Switch checked={onlyIncomplete} onCheckedChange={setOnlyIncomplete} />
        </Label>
      </div>
      <div className="overflow-hidden rounded-lg bg-white">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow>
              <TableHead>{t('results.student')}</TableHead>
              <TableHead className="w-80 whitespace-nowrap [&>span]:justify-center">
                {t('results.survey-count')}
              </TableHead>
              <TableHead className="w-12">
                <span className="sr-only">{t('results.status')}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <Show when={!isFetching} fallback={<LoadingRow colSpan={3} />}>
              <Show when={filteredStudents.length > 0} fallback={<EmptyRow colSpan={3} />}>
                {filteredStudents.map((studentRows) => (
                  <SurveyStudentRow key={`${studentRows[0].studentId}-${yearId}-${semester}`} rows={studentRows} />
                ))}
              </Show>
            </Show>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
