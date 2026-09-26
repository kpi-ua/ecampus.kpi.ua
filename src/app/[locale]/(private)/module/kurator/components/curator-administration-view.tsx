'use client';

import { Fragment, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { getCuratorAdminGroups, getCuratorLecturers } from '@/actions/curator.actions';
import { Heading2, Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

import { CuratorDepartment, CuratorGroup, CuratorLecturer } from '../types';
import { CuratorAssignmentPanel } from './curator-assignment-panel';

interface Props {
  initialGroups: CuratorGroup[];
  initialLecturers: CuratorLecturer[];
  departments: CuratorDepartment[];
}

export const CuratorAdministrationView = ({ initialGroups, initialLecturers, departments }: Props) => {
  const t = useTranslations('private.curator.lecturer.administration');
  const { errorToast } = useServerErrorToast();
  const [groups, setGroups] = useState(initialGroups);
  const [lecturers, setLecturers] = useState(initialLecturers);
  const [departmentId, setDepartmentId] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedGroupId, setExpandedGroupId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredGroups = groups.filter(
    (group) => !normalizedSearch || group.curatorName?.toLocaleLowerCase().includes(normalizedSearch),
  );

  const reload = (nextDepartmentId: string) => {
    const parsedDepartmentId = nextDepartmentId === 'all' ? undefined : Number(nextDepartmentId);

    startTransition(async () => {
      try {
        const [nextGroups, nextLecturers] = await Promise.all([
          getCuratorAdminGroups(parsedDepartmentId),
          getCuratorLecturers(parsedDepartmentId),
        ]);
        setGroups(nextGroups);
        setLecturers(nextLecturers);
        setExpandedGroupId(null);
      } catch {
        errorToast();
      }
    });
  };

  const changeDepartment = (value: string) => {
    setDepartmentId(value);
    reload(value);
  };

  if (departments.length === 0) {
    return (
      <>
        <Heading2>{t('title')}</Heading2>
        <Card className="mt-7 bg-white p-10 text-center text-sm text-neutral-500">{t('unavailable')}</Card>
      </>
    );
  }

  return (
    <>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Heading2>{t('title')}</Heading2>
          <Paragraph className="leading-sm mt-3 mb-0 max-w-2xl text-sm font-normal text-neutral-700">
            {t('subtitle')}
          </Paragraph>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={departmentId} onValueChange={changeDepartment} disabled={isPending}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all-departments')}</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department.id} value={department.id.toString()}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card className="bg-white p-4 sm:p-6">
        <Input
          className="mb-6"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('search')}
        />
        {filteredGroups.length === 0 ? (
          <Paragraph className="m-0 py-12 text-center text-sm text-neutral-500">{t('empty')}</Paragraph>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('table.group')}</TableHead>
                <TableHead>{t('table.course')}</TableHead>
                <TableHead>{t('table.curator')}</TableHead>
                <TableHead>{t('table.description')}</TableHead>
                <TableHead>{t('table.department')}</TableHead>
                <TableHead className="w-16">{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={isPending ? 'opacity-60' : undefined}>
              {filteredGroups.map((group) => {
                const isExpanded = expandedGroupId === group.groupId;
                return (
                  <Fragment key={group.groupId}>
                    <TableRow>
                      <TableCell className="font-semibold">{group.name}</TableCell>
                      <TableCell>{group.course}</TableCell>
                      <TableCell>{group.curatorName ?? t('not-assigned')}</TableCell>
                      <TableCell>{group.description || '—'}</TableCell>
                      <TableCell>{group.departmentAbbreviation || group.departmentName}</TableCell>
                      <TableCell>
                        <Button
                          variant="tertiary"
                          size="small"
                          aria-label={isExpanded ? t('collapse') : t('expand')}
                          onClick={() => setExpandedGroupId(isExpanded ? null : group.groupId)}
                        >
                          {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={5} className="bg-neutral-50 p-5">
                          <CuratorAssignmentPanel
                            group={group}
                            lecturers={lecturers}
                            onAssigned={(employeeId, curatorName) =>
                              setGroups((current) =>
                                current.map((item) =>
                                  item.groupId === group.groupId
                                    ? { ...item, curatorEmployeeId: employeeId, curatorName }
                                    : item,
                                ),
                              )
                            }
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </>
  );
};
