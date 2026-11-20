'use client';

import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { employeeSearchParams } from '../../../search-params';

export function EmployeeSourceFilter({ hasSelectedDepartment }: { hasSelectedDepartment: boolean }) {
  const t = useTranslations('private.dean');
  const [view, setView] = useQueryState(
    'view',
    employeeSearchParams.view.withOptions({ shallow: false, history: 'replace' }),
  );
  return (
    <div className="max-w-sm py-4">
      <Select
        value={hasSelectedDepartment ? view : 'campus'}
        onValueChange={(value) => void setView(value === 'personnel' ? 'personnel' : null)}
      >
        <SelectTrigger aria-label={t('employeeSource')}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="campus">{t('campusDirectory')}</SelectItem>
          <SelectItem value="personnel" disabled={!hasSelectedDepartment}>
            {t('personnel')}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
