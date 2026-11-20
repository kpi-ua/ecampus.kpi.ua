'use client';

import { useQueryStates } from 'nuqs';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type DekanatOption } from '@/types/models/dekanat';

import { dekanatSearchParams } from '../search-params';

type Filter = keyof typeof dekanatSearchParams;

const resets: Partial<Record<Filter, Filter[]>> = {
  facultyId: ['departmentId', 'groupId', 'programId'],
  departmentId: ['groupId', 'programId'],
  course: ['groupId'],
};

export function DekanatSelect({
  name,
  value,
  label,
  options,
}: {
  name: Filter;
  value?: number | null;
  label: string;
  options: DekanatOption[];
}) {
  const [query, setQuery] = useQueryStates(dekanatSearchParams, { shallow: false, history: 'push' });
  const selected = options.find((option) => option.id === query[name]);

  return (
    <label className="grid min-w-0 gap-1 text-sm">
      {label}
      <Select
        value={String(selected?.id ?? value ?? '')}
        disabled={options.length === 0}
        onValueChange={(next) =>
          void setQuery({
            ...Object.fromEntries((resets[name] ?? []).map((filter) => [filter, null])),
            [name]: Number(next),
          })
        }
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
    </label>
  );
}
