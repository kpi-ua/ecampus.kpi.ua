'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useDebounce } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { searchSbpUsers } from '@/actions/sbp-rights.actions';
import { cn } from '@/lib/utils';
import { EntityIdName } from '@/types/models/entity-id-name';

interface Props {
  value: number | undefined;
  onChange: (userAccountId: number, fullName: string) => void;
}

/**
 * Combobox + Command that searches users by full name (≥ 2 chars, debounced).
 * Selecting a user calls `onChange(userAccountId, fullName)` so the parent
 * form can both store the id and display the chosen name.
 */
export function UserAutocomplete({ value, onChange }: Props) {
  const t = useTranslations('private.studbonuspointsrights.grant');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<string>('');
  const [results, setResults] = useState<EntityIdName[]>([]);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    let cancelled = false;
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      return;
    }
    void searchSbpUsers(debouncedQuery).then((rows) => {
      if (!cancelled) setResults(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className={cn(!selectedLabel && 'text-muted-foreground')}>
            {selectedLabel || t('userPlaceholder')}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder={t('userSearchPlaceholder')} value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>{t(query.trim().length < 2 ? 'userMinChars' : 'userNotFound')}</CommandEmpty>
            {results.map((user) => (
              <CommandItem
                key={user.id}
                value={String(user.id)}
                onSelect={() => {
                  onChange(user.id, user.name);
                  setSelectedLabel(user.name);
                  setOpen(false);
                }}
              >
                <Check className={cn('mr-2 h-4 w-4', value === user.id ? 'opacity-100' : 'opacity-0')} />
                {user.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
