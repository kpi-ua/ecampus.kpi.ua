'use client';

import { useTranslations } from 'next-intl';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from '@/i18n/routing';

export function AttestationFilters({
  departments,
  departmentId,
  semester,
}: {
  departments: { id: number; name: string }[];
  departmentId?: number;
  semester: number;
}) {
  const t = useTranslations('private.lecturer-attestation');
  const router = useRouter();
  const department = departmentId?.toString() ?? 'all';

  function update(nextSemester: string, nextDepartment: string) {
    const query = new URLSearchParams({ semester: nextSemester });
    if (nextDepartment !== 'all') {
      query.set('department', nextDepartment);
    }
    router.replace(`/module/attestation?${query}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
      <div className="grid min-w-0 gap-1.5 text-sm">
        <label htmlFor="attestation-department">{t('department')}</label>
        <Select value={department} onValueChange={(value) => update(String(semester), value)}>
          <SelectTrigger id="attestation-department" className="w-full sm:min-w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all-departments')}</SelectItem>
            {departments.map(({ id, name }) => (
              <SelectItem key={id} value={String(id)}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5 text-sm">
        <label htmlFor="attestation-semester">{t('semester')}</label>
        <Select value={String(semester)} onValueChange={(value) => update(value, department)}>
          <SelectTrigger id="attestation-semester" className="min-w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
