'use client';

import { useTranslations } from 'next-intl';
import { useQueryStates } from 'nuqs';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { attestationReportSearchParams } from '../search-params';
import { AttestationReportOptions, AttestationReportQuery } from '../types';

interface Props {
  options: AttestationReportOptions;
  query: AttestationReportQuery;
}

export const ReportFilters = ({ options, query }: Props) => {
  const t = useTranslations('private.attestation-reports');
  const [filters, setFilters] = useQueryStates(attestationReportSearchParams, { shallow: false, history: 'push' });
  const selectedQuery = {
    departmentId: filters.departmentId ?? query.departmentId,
    yearId: filters.yearId ?? query.yearId,
    semester: filters.semester,
    attestationId: filters.attestationId ?? query.attestationId,
  };
  const facultyId = options.departments.find((d) => d.id === selectedQuery.departmentId)?.facultyId;
  const faculties = [
    ...new Map(options.departments.map((d) => [d.facultyId, { id: d.facultyId, name: d.facultyName }])).values(),
  ];
  const fields = [
    { key: 'facultyId', value: facultyId, items: faculties },
    {
      key: 'departmentId',
      value: selectedQuery.departmentId,
      items: options.departments.filter((d) => d.facultyId === facultyId),
    },
    { key: 'yearId', value: selectedQuery.yearId, items: options.years },
    {
      key: 'semester',
      value: selectedQuery.semester,
      items: [
        { id: 1, name: t('first-semester') },
        { id: 2, name: t('second-semester') },
      ],
    },
    { key: 'attestationId', value: selectedQuery.attestationId, items: options.attestations },
  ] as const;
  const update = (key: (typeof fields)[number]['key'], value: string) => {
    const selected = Number(value);
    const next =
      key === 'facultyId'
        ? { departmentId: options.departments.find((d) => d.facultyId === selected)?.id ?? selectedQuery.departmentId }
        : { [key]: selected };
    void setFilters({ ...next, groupId: null, course: null, studentId: null });
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
