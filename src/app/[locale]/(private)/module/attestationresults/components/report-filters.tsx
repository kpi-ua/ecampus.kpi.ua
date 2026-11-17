'use client';

import { useTranslations } from 'next-intl';
import qs from 'query-string';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePathname, useRouter } from '@/i18n/routing';

import { AttestationReportOptions, AttestationReportQuery } from '../types';

interface Props {
  options: AttestationReportOptions;
  query: AttestationReportQuery;
}

export const ReportFilters = ({ options, query }: Props) => {
  const t = useTranslations('private.attestation-reports');
  const router = useRouter();
  const pathname = usePathname();
  const facultyId = options.departments.find((d) => d.id === query.departmentId)?.facultyId;
  const faculties = [
    ...new Map(options.departments.map((d) => [d.facultyId, { id: d.facultyId, name: d.facultyName }])).values(),
  ];
  const fields = [
    { key: 'facultyId', value: facultyId, items: faculties },
    {
      key: 'departmentId',
      value: query.departmentId,
      items: options.departments.filter((d) => d.facultyId === facultyId),
    },
    { key: 'yearId', value: query.yearId, items: options.years },
    {
      key: 'semester',
      value: query.semester,
      items: [
        { id: 1, name: t('first-semester') },
        { id: 2, name: t('second-semester') },
      ],
    },
    { key: 'attestationId', value: query.attestationId, items: options.attestations },
  ];
  const update = (key: string, value: string) => {
    const next = { ...query, groupId: undefined, course: undefined, studentId: undefined };
    const selected = Number(value);
    if (key === 'facultyId') {
      next.departmentId = options.departments.find((d) => d.facultyId === selected)?.id ?? query.departmentId;
    } else {
      Object.assign(next, { [key]: selected });
    }
    router.push(qs.stringifyUrl({ url: pathname, query: { ...next } }));
  };
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {fields.map((field) => (
        <div key={field.key} className="space-y-2">
          <Label htmlFor={field.key}>{t(field.key)}</Label>
          <Select value={String(field.value)} onValueChange={(value) => update(field.key, value)}>
            <SelectTrigger id={field.key}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.items.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};
