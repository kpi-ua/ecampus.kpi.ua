'use client';

import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDeferredValue, useMemo, useState } from 'react';

import { useCuratorAdministrationData } from '@/app/[locale]/(private)/module/curatorlecturer/components/administration/hooks/use-curator-administration-data';
import {
  CuratorAcademicYear,
  CuratorGroup,
  CuratorLecturer,
  CuratorOption,
} from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { exportCuratorAdministration } from '@/app/[locale]/(private)/module/curatorlecturer/utils/export-curator-administration';

import { Heading2 } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

import { GROUP_FILTERS } from '../../constants';
import { filterAdministrationGroups } from '../../utils/filter-administration-groups';
import { CuratorAdministrationTable } from './curator-administration-table';

interface Props {
  currentYear: CuratorAcademicYear | null;
  initialGroups: CuratorGroup[];
  initialLecturers: CuratorLecturer[];
  departments: CuratorOption[];
}

export const CuratorAdministrationView = ({ initialGroups, initialLecturers, departments, currentYear }: Props) => {
  const yearId = currentYear?.id;
  const t = useTranslations('private.curatorlecturer.group-curator.administration');
  const { errorToast } = useServerErrorToast();
  const exportMutation = useMutation({
    mutationFn: exportCuratorAdministration,
    onError: () => errorToast(),
  });
  const [departmentId, setDepartmentId] = useState('all');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ course: '', speciality: '', groupId: '' });
  const [onlyUnassigned, setOnlyUnassigned] = useState(false);
  const deferredSearch = useDeferredValue(search);
  const parsedDepartmentId = departmentId === 'all' ? undefined : Number(departmentId);
  const { data, isFetching } = useCuratorAdministrationData(
    {
      groups: initialGroups,
      lecturers: initialLecturers,
    },
    yearId,
    parsedDepartmentId,
  );
  const filteredGroups = useMemo(
    () => filterAdministrationGroups(data?.groups ?? [], { search: deferredSearch, ...filters, onlyUnassigned }),
    [data?.groups, deferredSearch, filters, onlyUnassigned],
  );

  const handleExport = () => {
    if (yearId) {
      exportMutation.mutate({ yearId, departmentId: parsedDepartmentId, search, ...filters, onlyUnassigned });
    }
  };

  if (departments.length === 0 || !currentYear) {
    return (
      <>
        <Heading2>{t('title')}</Heading2>
        <Card className="mt-7 bg-white p-10 text-center text-sm text-neutral-500">{t('unavailable')}</Card>
      </>
    );
  }

  return (
    <Card className="w-full rounded-[24px] bg-white p-5 shadow-lg sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <Heading2 className="m-0 text-2xl leading-8 font-semibold text-neutral-700 lg:text-2xl lg:leading-8">
          {t('title')}
        </Heading2>
        <div className="flex w-full flex-wrap items-center gap-4 lg:w-auto">
          <div className="flex items-center gap-3">
            <label htmlFor="curator-year" className="text-sm text-neutral-600">
              {t('filters.year')}
            </label>
            <Select value={currentYear.id.toString()}>
              <SelectTrigger id="curator-year" variant="small" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={currentYear.id.toString()}>
                  {dayjs(currentYear.startDate).format('YYYY')}–{dayjs(currentYear.endDate).format('YYYY')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <label htmlFor="curator-department" className="text-sm text-neutral-600">
            {t('table.department')}
          </label>
          <Select
            value={departmentId}
            onValueChange={(value) => {
              setDepartmentId(value);
              setFilters({ course: '', speciality: '', groupId: '' });
            }}
            disabled={isFetching}
          >
            <SelectTrigger id="curator-department" variant="small" className="w-full text-left sm:w-80">
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
          <Button
            variant="secondary"
            size="small"
            loading={exportMutation.isPending}
            disabled={isFetching || !yearId || filteredGroups.length === 0}
            onClick={handleExport}
          >
            <Download />
            {t('export')}
          </Button>
        </div>
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="w-full sm:min-w-52 sm:flex-1 sm:basis-64">
          <Input
            size="small"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('search')}
          />
        </div>
        {GROUP_FILTERS.map((key) => {
          const options = Array.from(
            new Set(
              (data?.groups ?? []).map((group) => group[key]?.toString()).filter((value): value is string => !!value),
            ),
          ).sort((first, second) => first.localeCompare(second, 'uk', { numeric: true }));
          return (
            <div key={key} className="flex items-center gap-3">
              <label htmlFor={`curator-${key}`} className="text-sm text-neutral-600">
                {t(`filters.${key}`)}
              </label>
              <Select
                value={filters[key] || 'all'}
                disabled={isFetching}
                onValueChange={(value) =>
                  setFilters((current) => ({ ...current, [key]: value === 'all' ? '' : value }))
                }
              >
                <SelectTrigger id={`curator-${key}`} variant="small" className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.all')}</SelectItem>
                  {options.map((value) => (
                    <SelectItem key={value} value={value}>
                      {key === 'groupId'
                        ? data?.groups.find((group) => group.groupId.toString() === value)?.name
                        : value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })}
        <div className="flex items-center gap-3">
          <label htmlFor="curator-only-unassigned" className="text-sm whitespace-nowrap text-neutral-600">
            {t('filters.onlyUnassigned')}
          </label>
          <Switch
            id="curator-only-unassigned"
            checked={onlyUnassigned}
            onCheckedChange={setOnlyUnassigned}
            disabled={isFetching}
          />
        </div>
      </div>
      <CuratorAdministrationTable
        key={departmentId}
        groups={filteredGroups}
        lecturers={data?.lecturers ?? []}
        academicYearStart={currentYear.startDate}
        academicYearEnd={currentYear.endDate}
        isFetching={isFetching}
      />
    </Card>
  );
};
