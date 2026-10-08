'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { getCuratorStudents } from '@/actions/curatorlecturer.actions';
import { getContactTypes } from '@/actions/profile.actions';
import { EmptyRow } from '@/app/[locale]/(private)/module/curatorlecturer/components/EmptyRow';
import { LoadingRow } from '@/app/[locale]/(private)/module/curatorlecturer/components/group-curator-view/shared/loading-row';
import {
  CURATOR_GROUP_STALE_TIME,
  curatorGroupQueryKeys,
} from '@/app/[locale]/(private)/module/curatorlecturer/components/group-curator-view/shared/query-keys';
import { CuratorGroup } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { exportGroupOverview } from '@/app/[locale]/(private)/module/curatorlecturer/utils/export-group-overview';
import { Heading4, Paragraph } from '@/components/typography/index';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { EMPTY_VALUE } from '@/lib/constants/empty-value';
import { PASSWORD_MASK } from '@/lib/constants/password';

import { GroupLeaderSelect } from './group-leader-select';
import { StudentContacts } from './student-contacts';

interface Props {
  group: CuratorGroup;
}

export const OverviewTab = ({ group }: Props) => {
  const { groupId, name: groupName } = group;
  const t = useTranslations('private.curatorlecturer.group-curator');
  const { errorToast } = useServerErrorToast();
  const exportMutation = useMutation({
    mutationFn: () => exportGroupOverview(groupId),
    onError: () => errorToast(),
  });
  const [search, setSearch] = useState('');
  const { data: students = [], isFetching } = useQuery({
    queryKey: curatorGroupQueryKeys.students(groupId),
    queryFn: () => getCuratorStudents(groupId),
    staleTime: CURATOR_GROUP_STALE_TIME,
  });
  const { data: contactTypes = [] } = useQuery({
    queryKey: ['contact-types'],
    queryFn: getContactTypes,
    staleTime: CURATOR_GROUP_STALE_TIME,
  });
  const query = search.trim().toLocaleLowerCase();
  const filteredStudents = students.filter((student) => student.fullName.toLocaleLowerCase().includes(query));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading4 className="m-0">{t('overview.title', { group: groupName })}</Heading4>
        <Button
          variant="secondary"
          size="small"
          loading={exportMutation.isPending}
          onClick={() => exportMutation.mutate()}
        >
          <Download />
          {t('export')}
        </Button>
      </div>
      <GroupLeaderSelect group={group} />
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={t('filters.student-search')}
      />
      <div className="border-neutral-divider overflow-hidden rounded-lg border bg-white">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow className="hover:bg-white [&>th]:bg-neutral-100 [&>th]:text-xs [&>th]:uppercase">
              <TableHead>{t('students.name')}</TableHead>
              <TableHead>{t('students.login')}</TableHead>
              <TableHead>{t('students.password')}</TableHead>
              <TableHead>{t('students.status')}</TableHead>
              <TableHead>{t('students.contacts')}</TableHead>
              <TableHead>{t('students.code-of-honor')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <Show when={!isFetching} fallback={<LoadingRow colSpan={6} />}>
              <Show when={filteredStudents.length > 0} fallback={<EmptyRow colSpan={6} />}>
                {filteredStudents.map((student) => (
                  <TableRow key={student.studentId}>
                    <TableCell className="font-medium">{student.fullName}</TableCell>
                    <TableCell>{student.login ?? EMPTY_VALUE}</TableCell>
                    <TableCell>
                      {student.passwordChanged
                        ? PASSWORD_MASK
                        : student.initialPassword
                          ? student.initialPassword
                          : EMPTY_VALUE}
                    </TableCell>
                    <TableCell>
                      {student.passwordChanged ? t('students.password-changed') : t('students.initial-password')}
                    </TableCell>
                    <TableCell>
                      <StudentContacts contacts={student.curatorContacts} contactTypes={contactTypes} />
                    </TableCell>
                    <TableCell>
                      <Show
                        when={!!student.codeOfHonorSignDate}
                        fallback={<Badge variant="error">{t('students.not-agreed')}</Badge>}
                      >
                        <Badge variant="success">
                          {t('students.agreed', { date: dayjs(student.codeOfHonorSignDate).format('DD.MM.YYYY') })}
                        </Badge>
                      </Show>
                    </TableCell>
                  </TableRow>
                ))}
              </Show>
            </Show>
          </TableBody>
        </Table>
      </div>
      <Show when={!isFetching}>
        <Paragraph className="m-0 text-sm text-neutral-500">
          {t('students.count', { count: filteredStudents.length })}
        </Paragraph>
      </Show>
    </div>
  );
};
