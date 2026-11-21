'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useEffectEvent, useState } from 'react';

import { searchDeansOfficeStudents, setDeansOfficeStudentGroup } from '@/actions/deans-office.actions';
import { Button } from '@/components/ui/button';
import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useDebounce } from '@/components/ui/multi-select';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants/common';
import { type DeansOfficeStudentSearchResult } from '@/types/models/deans-office';

export function AddStudentSearch({ groupId }: { groupId: number }) {
  const t = useTranslations('private.deans-office');
  const combobox = useTranslations('global.combobox');
  const { errorToast } = useServerErrorToast();
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState<DeansOfficeStudentSearchResult | null>(null);
  const term = input.trim();
  const debouncedTerm = useDebounce(term, SEARCH_DEBOUNCE_MS);
  const showResults = focused && !selected && term.length >= 2;
  const search = useQuery({
    queryKey: ['deans-office', 'student-search', debouncedTerm],
    queryFn: () => searchDeansOfficeStudents(null, debouncedTerm),
    enabled: showResults && term === debouncedTerm,
    retry: false,
  });

  const showSearchError = useEffectEvent(() => errorToast());

  useEffect(() => {
    if (showResults && term === debouncedTerm && search.isError) {
      showSearchError();
    }
  }, [showResults, term, debouncedTerm, search.isError, search.errorUpdatedAt]);

  const assignment = useMutation({
    mutationFn: async (student: DeansOfficeStudentSearchResult) => {
      if (!(await setDeansOfficeStudentGroup(student.id, groupId, student.groupId))) {
        throw new Error('Student assignment failed');
      }
    },
    onSuccess: () => {
      setInput('');
      setSelected(null);
    },
    onError: () => errorToast(),
  });

  const loading = term !== debouncedTerm || search.isFetching;

  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
      <Command
        className="relative h-auto w-full overflow-visible border sm:max-w-sm"
        shouldFilter={false}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setFocused(false);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setFocused(false);
          }
        }}
      >
        <CommandInput
          aria-label={t('searchStudent')}
          placeholder={t('searchStudent')}
          value={input}
          maxLength={100}
          disabled={assignment.isPending}
          onValueChange={(value) => {
            setInput(value);
            setSelected(null);
            setFocused(true);
          }}
        />
        <CommandList
          hidden={!showResults}
          className="absolute inset-x-0 top-full z-10 mt-1 rounded-md border bg-popover shadow-md"
        >
          {showResults && loading && <div className="p-3 text-sm">{combobox('loading')}</div>}
          {showResults &&
            !loading &&
            search.isSuccess &&
            (search.data.length === 0 ? (
              <div className="p-3 text-sm">{combobox('noResults')}</div>
            ) : (
              search.data.map((student) => (
                <CommandItem
                  key={student.id}
                  value={String(student.id)}
                  onMouseDown={(event) => event.preventDefault()}
                  onSelect={() => {
                    setSelected(student);
                    setInput(student.name);
                    setFocused(false);
                  }}
                >
                  {student.name}
                </CommandItem>
              ))
            ))}
        </CommandList>
      </Command>
      <Button
        type="button"
        loading={assignment.isPending}
        disabled={!selected}
        onClick={() => {
          if (selected) {
            assignment.mutate(selected);
          }
        }}
      >
        {t('addStudent')}
      </Button>
    </div>
  );
}
