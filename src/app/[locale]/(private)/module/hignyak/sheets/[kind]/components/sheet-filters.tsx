'use client';

import { useTranslations } from 'next-intl';
import { useQueryStates } from 'nuqs';
import { useId } from 'react';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { sheetFilters, sheetStatuses, sheetTypes } from './sheet-filter-options';

export function SheetFilters({ courses }: { courses: number[] }) {
  const t = useTranslations('private.dnvr-reporting');
  const id = useId();
  const [{ course, status, sheetType }, setFilters] = useQueryStates(sheetFilters, { shallow: false });
  const fields = [
    {
      key: 'course',
      value: course !== null && courses.includes(course) ? String(course) : 'all',
      options: courses.map((value) => ({ value: String(value), label: String(value) })),
      all: t('allCourses'),
      onChange: (value: string) => void setFilters({ course: value === 'all' ? null : Number(value) }),
    },
    {
      key: 'status',
      value: status ?? 'all',
      options: sheetStatuses.map((value) => ({ value, label: t(value) })),
      all: t('allSheetStatuses'),
      onChange: (value: string) => void setFilters({ status: sheetStatuses.find((item) => item === value) ?? null }),
    },
    {
      key: 'sheetType',
      value: sheetType ?? 'all',
      options: sheetTypes.map((value) => ({ value, label: t(value) })),
      all: t('allSheetTypes'),
      onChange: (value: string) => void setFilters({ sheetType: sheetTypes.find((item) => item === value) ?? null }),
    },
  ] as const;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {fields.map(({ key, value, options, all, onChange }) => (
        <div key={key} className="flex min-w-0 flex-col gap-2">
          <Label htmlFor={id + key}>{t(key)}</Label>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger id={id + key} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{all}</SelectItem>
              {options.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
