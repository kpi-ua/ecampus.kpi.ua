'use client';

import { useTranslations } from 'next-intl';
import { useQueryStates } from 'nuqs';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { surveySearchParams } from '../search-params';

interface Props {
  departments: { id: number; name: string }[];
}

export function DeanOfficeDepartmentFilter({ departments }: Props) {
  const t = useTranslations('private.dean-office');
  const [{ departmentId }, setFilters] = useQueryStates(surveySearchParams, { shallow: false, history: 'replace' });

  return (
    <div className="max-w-sm py-4">
      <Select
        value={departmentId?.toString() ?? 'all'}
        onValueChange={(value) => void setFilters({ departmentId: value === 'all' ? null : Number(value), page: null })}
      >
        <SelectTrigger aria-label={t('department')}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('allDepartments')}</SelectItem>
          {departments.map(({ id, name }) => (
            <SelectItem key={id} value={id.toString()}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
