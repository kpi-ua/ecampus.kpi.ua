'use client';

import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { getCuratorStudentCredentials } from '@/actions/curator.actions';
import { Paragraph } from '@/components/typography';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { EmptyRow } from '../EmptyRow';
import { LoadingRow } from './loading-row';
import { CURATOR_GROUP_STALE_TIME, curatorGroupQueryKeys } from './query-keys';
import { StudentContacts } from './student-contacts';

interface Props {
  groupId: number;
}

export const OverviewTab = ({ groupId }: Props) => {
  const t = useTranslations('private.curator.lecturer.group-curator');
  const [search, setSearch] = useState('');
  const { data: students = [], isFetching } = useQuery({
    queryKey: curatorGroupQueryKeys.credentials(groupId),
    queryFn: () => getCuratorStudentCredentials(groupId),
    staleTime: CURATOR_GROUP_STALE_TIME,
  });
  const query = search.trim().toLocaleLowerCase();
  const filteredStudents = students.filter((student) => student.fullName.toLocaleLowerCase().includes(query));

  return (
    <div className="flex flex-col gap-6">
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
              <TableHead>{t('students.contacts')}</TableHead>
              <TableHead>{t('students.code-of-honor')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <LoadingRow colSpan={5} />
            ) : filteredStudents.length ? (
              filteredStudents.map((student) => (
                <TableRow key={student.studentId}>
                  <TableCell className="font-medium">{student.fullName}</TableCell>
                  <TableCell>{student.login ?? '—'}</TableCell>
                  <TableCell>
                    {student.passwordChanged ? (
                      <span>•••••••• ({t('students.password-changed')})</span>
                    ) : student.initialPassword ? (
                      <span>
                        {student.initialPassword} ({t('students.initial-password')})
                      </span>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>
                    <StudentContacts email={student.email} contacts={student.curatorContacts} />
                  </TableCell>
                  <TableCell>
                    {student.codeOfHonorSignDate ? (
                      <Badge variant="success">
                        {t('students.agreed', { date: dayjs(student.codeOfHonorSignDate).format('DD.MM.YYYY') })}
                      </Badge>
                    ) : (
                      <Badge variant="error">{t('students.not-agreed')}</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <EmptyRow colSpan={5} />
            )}
          </TableBody>
        </Table>
      </div>
      {!isFetching && (
        <Paragraph className="m-0 text-sm text-neutral-500">
          {t('students.count', { count: filteredStudents.length })}
        </Paragraph>
      )}
    </div>
  );
};
