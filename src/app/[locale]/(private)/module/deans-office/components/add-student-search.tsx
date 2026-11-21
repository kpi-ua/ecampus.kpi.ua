'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { type FocusEvent, type KeyboardEvent, type MouseEvent, useEffect, useEffectEvent, useState } from 'react';

import { searchDeansOfficeStudents, setDeansOfficeStudentGroup } from '@/actions/deans-office.actions';
import { Button } from '@/components/ui/button';
import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useDebounce } from '@/components/ui/multi-select';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants/common';
import { type DeansOfficeStudentSearchResult } from '@/types/models/deans-office';

export function AddStudentSearch({ groupId }: { groupId: number }) {
  const t = useTranslations('private.deans-office');
  const queryClient = useQueryClient();
  const combobox = useTranslations('global.combobox');
  const { errorToast } = useServerErrorToast();
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState<DeansOfficeStudentSearchResult | null>(null);
  const term = input.trim();
  const debouncedTerm = useDebounce(term, SEARCH_DEBOUNCE_MS);
  const showResults = focused && !selected && term.length >= 2;
  const search = useQuery({
    queryKey: ['deans-office', 'student-search', groupId, debouncedTerm],
    queryFn: () => searchDeansOfficeStudents(groupId, debouncedTerm),
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
      void queryClient.invalidateQueries({ queryKey: ['deans-office', 'student-search'] });
      setInput('');
      setSelected(null);
    },
    onError: () => errorToast(),
  });

  const loading = term !== debouncedTerm || search.isFetching;

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setFocused(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setFocused(false);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    setSelected(null);
    setFocused(true);
  };

  const handleOptionMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleStudentSelect = (value: string) => {
    const student = search.data?.find((option) => String(option.id) === value);
    if (!student) {
      return;
    }

    setSelected(student);
    setInput(student.name);
    setFocused(false);
  };

  const handleAddStudent = () => {
    if (selected) {
      assignment.mutate(selected);
    }
  };

  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
      <Command
        className="relative h-auto w-full overflow-visible border sm:max-w-sm"
        shouldFilter={false}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        <CommandInput
          aria-label={t('searchStudent')}
          placeholder={t('searchStudent')}
          value={input}
          maxLength={100}
          disabled={assignment.isPending}
          onValueChange={handleInputChange}
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
                  onMouseDown={handleOptionMouseDown}
                  onSelect={handleStudentSelect}
                >
                  {student.name}
                </CommandItem>
              ))
            ))}
        </CommandList>
      </Command>
      <Button type="button" loading={assignment.isPending} disabled={!selected} onClick={handleAddStudent}>
        {t('addStudent')}
      </Button>
    </div>
  );
}
