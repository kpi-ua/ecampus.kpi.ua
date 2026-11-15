'use client';

import { useTranslations } from 'next-intl';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from '@/i18n/routing';

import { ZamdekanDepartmentIndicators } from '../types';
import { getZamdekanReportPath } from '../utils/report-path';

interface Props {
  departments: ZamdekanDepartmentIndicators[];
  departmentId?: number;
  view?: 'statistics' | 'summary' | 'summary-other';
}

export const ZamdekanDepartmentSelect = ({ departments, departmentId, view = 'statistics' }: Props) => {
  const t = useTranslations('private.zamdekan');
  const router = useRouter();

  return (
    <div className="w-full space-y-2 sm:max-w-lg">
      <Label htmlFor="statistics-department">{t('columns.department')}</Label>
      <Select
        value={departmentId === undefined ? '' : String(departmentId)}
        disabled={departments.length === 0}
        onValueChange={(value) => router.push(getZamdekanReportPath({ view, departmentId: Number(value) }))}
      >
        <SelectTrigger id="statistics-department">
          <SelectValue placeholder={t('select-department')} />
        </SelectTrigger>
        <SelectContent>
          {departments.map((department) => (
            <SelectItem key={department.departmentId} value={String(department.departmentId)}>
              {department.department}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
