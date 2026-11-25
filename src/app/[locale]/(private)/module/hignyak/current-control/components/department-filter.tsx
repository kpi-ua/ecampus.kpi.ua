'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from '@/i18n/routing';

import { getCurrentControlPath } from '../../routes';

export function DepartmentFilter({
  departments,
  departmentId,
  path,
}: {
  departments: { id: number; name: string; faculty: string }[];
  departmentId: number | null;
  path: ReturnType<typeof getCurrentControlPath>;
}) {
  const t = useTranslations('private.dnvr-reporting');
  const router = useRouter();
  const id = useId();

  return (
    <div className="flex w-full flex-col gap-2 sm:w-fit">
      <Label htmlFor={id}>{t('department')}</Label>
      <Select
        value={departmentId?.toString() ?? ''}
        onValueChange={(value) => router.push({ pathname: path, query: { departmentId: value } })}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={t('selectDepartment')} />
        </SelectTrigger>
        <SelectContent>
          {departments.map((department) => (
            <SelectItem key={department.id} value={String(department.id)}>
              {[department.name, department.faculty].filter(Boolean).join(' — ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
