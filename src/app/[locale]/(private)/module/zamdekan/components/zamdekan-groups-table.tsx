'use client';

import { useMutation } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useMemo, useState } from 'react';

import { getZamdekanAgreements } from '@/actions/zamdekan.actions';
import { Paragraph } from '@/components/typography';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableExpandButton } from '@/components/ui/table-expand-button';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useTableSort } from '@/hooks/use-table-sort';
import { Link } from '@/i18n/routing';
import { formatDate } from '@/lib/utils';

import { ZamdekanAgreement, ZamdekanGroup } from '../types';
import { getZamdekanReportPath } from '../utils/report-path';
import { ZamdekanTableCard } from './zamdekan-table-card';

interface Props {
  groups: ZamdekanGroup[];
}

export const ZamdekanGroupsTable = ({ groups }: Props) => {
  const t = useTranslations('private.zamdekan');
  const [search, setSearch] = useState('');
  const [expandedGroupId, setExpandedGroupId] = useState<number | null>(null);
  const [studentsByGroup, setStudentsByGroup] = useState<Record<number, ZamdekanAgreement[]>>({});
  const studentsMutation = useMutation({ mutationFn: getZamdekanAgreements });
  const router = useRouter();
  const searchParams = useSearchParams();
  const { errorToast } = useServerErrorToast();
  const filteredGroups = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) {
      return groups;
    }
    return groups.filter(
      (group) => group.group.toLocaleLowerCase().includes(query) || group.curator.toLocaleLowerCase().includes(query),
    );
  }, [groups, search]);
  const { sortedRows, sortHandlers } = useTableSort(filteredGroups, undefined, [
    'course',
    'group',
    'curator',
    'department',
  ]);

  const toggleGroup = async (groupId: number) => {
    if (expandedGroupId === groupId) {
      setExpandedGroupId(null);
      return;
    }

    setExpandedGroupId(groupId);
    if (studentsByGroup[groupId]) {
      return;
    }

    try {
      const students = await studentsMutation.mutateAsync(groupId);
      setStudentsByGroup((current) => ({ ...current, [groupId]: students }));
    } catch {
      errorToast();
      setExpandedGroupId(null);
    }
  };

  if (groups.length === 0) {
    return <Paragraph className="py-12 text-center text-sm text-muted-foreground">{t('empty')}</Paragraph>;
  }

  return (
    <div className="space-y-4">
      <Input
        icon={<Search />}
        size="small"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          const params = new URLSearchParams(searchParams.toString());
          params.set('page', '1');
          router.replace(`?${params.toString()}`, { scroll: false });
        }}
        placeholder={t('group-search-placeholder')}
      />
      <ZamdekanTableCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead sortHandlers={sortHandlers} sortHeader="course">
                {t('columns.course')}
              </TableHead>
              <TableHead sortHandlers={sortHandlers} sortHeader="group">
                {t('columns.group')}
              </TableHead>
              <TableHead sortHandlers={sortHandlers} sortHeader="department">
                {t('columns.department')}
              </TableHead>
              <TableHead sortHandlers={sortHandlers} sortHeader="curator">
                {t('columns.curator')}
              </TableHead>
              <TableHead className="w-12">
                <span className="sr-only">{t('actions')}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRows.map((row) => (
              <Fragment key={row.groupId}>
                <TableRow key={row.groupId}>
                  <TableCell className="whitespace-pre-wrap">{row.course}</TableCell>
                  <TableCell className="whitespace-pre-wrap">{row.group}</TableCell>
                  <TableCell className="whitespace-pre-wrap">{row.department}</TableCell>
                  <TableCell className="whitespace-pre-wrap">{row.curator}</TableCell>
                  <TableCell>
                    <TableExpandButton
                      expanded={expandedGroupId === row.groupId}
                      onToggle={() => void toggleGroup(row.groupId)}
                    />
                  </TableCell>
                </TableRow>
                {expandedGroupId === row.groupId && (
                  <TableRow key={`${row.groupId}-agreements`}>
                    <TableCell colSpan={5} className="bg-neutral-50 p-4">
                      {studentsMutation.isPending && studentsMutation.variables === row.groupId ? (
                        <Paragraph>{t('loading')}</Paragraph>
                      ) : (
                        <div className="overflow-x-auto rounded-md border bg-white">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>{t('columns.fullName')}</TableHead>
                                <TableHead>{t('columns.status')}</TableHead>
                                <TableHead>{t('columns.agreementStatus')}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(studentsByGroup[row.groupId] ?? []).map((student) => (
                                <TableRow key={student.studentId}>
                                  <TableCell className="whitespace-pre-wrap">
                                    <Link
                                      href={getZamdekanReportPath({
                                        view: 'results',
                                        groupId: student.groupId,
                                        studentId: student.studentId,
                                      })}
                                      className="underline"
                                    >
                                      {student.fullName}
                                    </Link>
                                  </TableCell>
                                  <TableCell className="whitespace-pre-wrap">{student.status}</TableCell>
                                  <TableCell className="whitespace-pre-wrap">
                                    <Badge variant={student.hasAgreement ? 'success' : 'error'}>
                                      {student.hasAgreement
                                        ? student.acceptedAt
                                          ? t('values.agreed', { date: formatDate(student.acceptedAt) })
                                          : t('values.agreed-without-date')
                                        : t('values.not-agreed')}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          {(studentsByGroup[row.groupId] ?? []).length === 0 && (
                            <Paragraph className="py-6 text-center text-sm text-muted-foreground">
                              {t('empty')}
                            </Paragraph>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </ZamdekanTableCard>
      {filteredGroups.length === 0 && (
        <Paragraph className="py-12 text-center text-sm text-muted-foreground">{t('no-groups-found')}</Paragraph>
      )}
    </div>
  );
};
