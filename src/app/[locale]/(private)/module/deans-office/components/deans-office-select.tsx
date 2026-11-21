'use client';

import { useQueryStates } from 'nuqs';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type DeansOfficeOption } from '@/types/models/deans-office';

import { deansOfficeSearchParams } from '../search-params';

type Filter = keyof typeof deansOfficeSearchParams;

const resets: Partial<Record<Filter, Filter[]>> = {
  facultyId: ['departmentId', 'groupId', 'programId'],
  departmentId: ['groupId', 'programId'],
  course: ['groupId'],
};

export function DeansOfficeSelect({
  name,
  value,
  label,
  options,
}: {
  name: Filter;
  value?: number | null;
  label: string;
  options: DeansOfficeOption[];
}) {
  const [query, setQuery] = useQueryStates(deansOfficeSearchParams, { shallow: false, history: 'push' });
  const selected = options.find((option) => option.id === query[name]);

  const handleValueChange = (next: string) => {
    void setQuery({
      ...Object.fromEntries((resets[name] ?? []).map((filter) => [filter, null])),
      [name]: Number(next),
    });
  };

  return (
    <Select
      value={String(selected?.id ?? value ?? '')}
      disabled={options.length === 0}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-full" aria-label={label}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.id} value={String(option.id)}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
