'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Heading2, Paragraph } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { CuratorOption, CuratorGroup, CuratorLecturer } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { useCuratorAdministrationData } from '@/app/[locale]/(private)/module/curatorlecturer/components/administration/hooks/use-curator-administration-data';
import { CuratorAdministrationTable } from './curator-administration-table';

interface Props {
  initialGroups: CuratorGroup[];
  initialLecturers: CuratorLecturer[];
  departments: CuratorOption[];
  yearId?: number;
}

export const CuratorAdministrationView = ({ initialGroups, initialLecturers, departments, yearId }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator.administration');
  const [departmentId, setDepartmentId] = useState('all');
  const [search, setSearch] = useState('');
  const parsedDepartmentId = departmentId === 'all' ? undefined : Number(departmentId);
  const { data, isFetching } = useCuratorAdministrationData(
    {
      groups: initialGroups,
      lecturers: initialLecturers,
    },
    yearId,
    parsedDepartmentId,
  );
  const query = search.trim().toLocaleLowerCase();
  const filteredGroups =
    data?.groups.filter((group) => !query || group.curatorName?.toLocaleLowerCase().includes(query)) ?? [];

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
          <Select value={departmentId} onValueChange={setDepartmentId} disabled={isFetching}>
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
        <CuratorAdministrationTable
          key={departmentId}
          groups={filteredGroups}
          lecturers={data?.lecturers ?? []}
          isFetching={isFetching}
        />
      </Card>
    </>
  );
};
