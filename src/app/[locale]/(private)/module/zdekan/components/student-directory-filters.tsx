'use client';

import { useTranslations } from 'next-intl';
import { useQueryStates } from 'nuqs';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { studentSearchParams } from '../search-params';

interface Props {
  departments: { id: number; name: string }[];
  groups: { name: string; course: number; departmentId: number }[];
}

export function StudentDirectoryFilters({ departments, groups }: Props) {
  const t = useTranslations('private.dean-office');
  const [{ course, departmentId, group }, setFilters] = useQueryStates(studentSearchParams, {
    shallow: false,
    history: 'replace',
  });
  const courses = [...new Set(groups.map((item) => item.course))].sort((a, b) => a - b);
  const groupNames = [
    ...new Set(
      groups
        .filter(
          (item) =>
            (course === null || item.course === course) &&
            (departmentId === null || item.departmentId === departmentId),
        )
        .map((item) => item.name),
    ),
  ];
  const fields = [
    {
      key: 'course',
      value: course?.toString(),
      options: courses.map((item) => ({ value: item.toString(), label: item.toString() })),
      onChange: (value: string | null) =>
        setFilters({ course: value === null ? null : Number(value), group: null, page: null }),
    },
    {
      key: 'department',
      value: departmentId?.toString(),
      options: departments.map((item) => ({ value: item.id.toString(), label: item.name })),
      onChange: (value: string | null) =>
        setFilters({ departmentId: value === null ? null : Number(value), group: null, page: null }),
    },
    {
      key: 'group',
      value: group,
      options: groupNames.map((name) => ({ value: name, label: name })),
      onChange: (value: string | null) => setFilters({ group: value, page: null }),
    },
  ] as const;

  return (
    <div className="grid gap-4 py-4 sm:grid-cols-3">
      {fields.map(({ key, value, options, onChange }) => (
        <label key={key} className="flex min-w-0 flex-col gap-1">
          {t(key)}
          <Select value={value ?? '__all'} onValueChange={(next) => void onChange(next === '__all' ? null : next)}>
            <SelectTrigger className="w-full" aria-label={t(key)}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('allFilterValues')}</SelectItem>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      ))}
    </div>
  );
}
