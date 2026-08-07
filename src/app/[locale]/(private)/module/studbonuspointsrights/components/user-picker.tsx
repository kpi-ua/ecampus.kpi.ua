'use client';

import { useEffect, useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
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

const MIN_CHARS = 2;

export interface PickedUser {
  id: number;
  name: string;
}

interface Props {
  value: PickedUser | null;
  onChange: (user: PickedUser | null) => void;
}

/**
 * Single-pick user picker with async search. Trigger looks like a `<Select>`;
 * after selection, the chosen user's name renders as plain text. Reopening
 * the popover starts a fresh search — no removable badges, no multi-select
 * affordances.
 */
export function UserPicker({ value, onChange }: Props) {
  const t = useTranslations('private.studbonuspointsrights.grant');
  const listboxId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<EntityIdName[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    let cancelled = false;
    if (debouncedQuery.trim().length < MIN_CHARS) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    void searchSbpUsers(debouncedQuery).then((rows) => {
      if (!cancelled) {
        setResults(rows);
        setIsSearching(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const showMinCharsHint = !isSearching && debouncedQuery.trim().length < MIN_CHARS;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          className="border-input bg-background ring-offset-background focus:ring-ring flex h-[44px] w-full cursor-pointer items-center justify-between rounded-[8px] border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
        >
          <span className={cn('truncate', !value && 'text-muted-foreground')}>
            {value ? value.name : t('userPickerPlaceholder')}
          </span>
          <ChevronDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder={t('userSearchPlaceholder')}
          />
          <CommandList id={listboxId}>
            {isSearching && (
              <div className="text-muted-foreground flex items-center justify-center gap-2 py-4 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('userSearching')}
              </div>
            )}
            {showMinCharsHint && <CommandEmpty>{t('userMinChars')}</CommandEmpty>}
            {!isSearching && !showMinCharsHint && results.length === 0 && (
              <CommandEmpty>{t('userNotFound')}</CommandEmpty>
            )}
            {results.map((user) => {
              const isSelected = value?.id === user.id;
              return (
                <CommandItem
                  key={user.id}
                  value={String(user.id)}
                  onSelect={() => {
                    onChange({ id: user.id, name: user.name });
                    setQuery('');
                    setOpen(false);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                  {user.name}
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
