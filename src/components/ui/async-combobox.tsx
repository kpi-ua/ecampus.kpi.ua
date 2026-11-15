'use client';

import { Check, ChevronDown, Loader2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useDebounce } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants/common';
import { cn } from '@/lib/utils';

type OptionValue = string | number;

export interface ComboboxOption {
  label: string;
  value: OptionValue;
}

type AsyncFetcher<T extends ComboboxOption> = (query: string) => Promise<T[]>;

interface BaseComboboxProps<T extends ComboboxOption> extends Omit<
  React.ComponentProps<'button'>,
  'value' | 'onChange'
> {
  value: OptionValue | null;
  onChange: (value: OptionValue | null, option: T | null) => void;
  /** Text on the trigger while nothing is picked */
  placeholder?: string;
  /** Placeholder of the search input inside the popover */
  searchPlaceholder?: string;
  /** Debounce delay in milliseconds for async search */
  debounceMs?: number;
  /** Shortest query that triggers an async search; shorter ones show a hint instead */
  minQueryLength?: number;
  /** Text shown when no options match */
  emptyText?: string;
  /** Text shown while async options are loading */
  loadingText?: string;
  /** Hides the clear button next to the chevron */
  clearable?: boolean;
}

interface StaticComboboxProps<T extends ComboboxOption> extends BaseComboboxProps<T> {
  /** Static options; the list is filtered client-side */
  options: T[];
  fetchOptions?: never;
}

interface AsyncComboboxProps<T extends ComboboxOption> extends BaseComboboxProps<T> {
  /** Loads options for the current search query */
  fetchOptions: AsyncFetcher<T>;
  options?: never;
}

type ComboboxProps<T extends ComboboxOption> = StaticComboboxProps<T> | AsyncComboboxProps<T>;

/**
 * Single-pick combobox: a `<Select>`-like trigger that opens a searchable
 * list. Options come either from a static array (filtered by cmdk) or from
 * `fetchOptions`, which runs debounced on the typed query while the popover
 * is open. Labels of every option seen so far are cached so the trigger
 * keeps showing the picked label after the list changes. Remaining props
 * (id, aria-*, ref from `FormControl`) land on the trigger, so a field label
 * and its error message point at it.
 */
function AsyncCombobox<T extends ComboboxOption>({
  options: staticOptions,
  fetchOptions,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  debounceMs = SEARCH_DEBOUNCE_MS,
  minQueryLength = 0,
  emptyText,
  loadingText,
  clearable = true,
  className,
  disabled,
  ...triggerProps
}: ComboboxProps<T>) {
  const t = useTranslations('global.combobox');
  const listboxId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [fetched, setFetched] = React.useState<T[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const labelsRef = React.useRef(new Map<OptionValue, string>());
  // Only the latest request may apply its result; earlier ones are stale.
  const requestRef = React.useRef(0);

  const isAsync = fetchOptions != null;
  const debouncedQuery = useDebounce(query, debounceMs);
  const trimmedQuery = debouncedQuery.trim();
  const isQueryTooShort = isAsync && trimmedQuery.length < minQueryLength;
  const options = staticOptions ?? fetched;

  React.useEffect(() => {
    for (const option of options) {
      labelsRef.current.set(option.value, option.label);
    }
  }, [options]);

  React.useEffect(() => {
    if (!isAsync || !open || isQueryTooShort) {
      return;
    }
    const requestId = ++requestRef.current;
    setIsLoading(true);
    fetchOptions(trimmedQuery)
      .then((results) => {
        if (requestId === requestRef.current) {
          setFetched(results);
        }
      })
      .catch(() => {
        if (requestId === requestRef.current) {
          setFetched([]);
        }
      })
      .finally(() => {
        if (requestId === requestRef.current) {
          setIsLoading(false);
        }
      });
  }, [fetchOptions, isAsync, open, isQueryTooShort, trimmedQuery]);

  const selectedLabel =
    value == null || value === ''
      ? null
      : (options.find((option) => option.value === value)?.label ?? labelsRef.current.get(value) ?? String(value));

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  const handleSelect = (option: T) => {
    onChange(option.value, option);
    close();
  };

  const handleClear = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onChange(null, null);
    setQuery('');
  };

  const showClear = clearable && !disabled && selectedLabel != null;
  const showEmpty = !isLoading && !isQueryTooShort && options.length === 0;

  return (
    <Popover open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
      <div className="relative w-full">
        <PopoverTrigger asChild>
          <button
            {...triggerProps}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-haspopup="listbox"
            disabled={disabled}
            className={cn(
              'border-input bg-background ring-offset-background focus:ring-ring flex h-[44px] w-full cursor-pointer items-center justify-between rounded-[8px] border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
              showClear && 'pr-14',
              className,
            )}
          >
            <span className={cn('truncate', selectedLabel == null && 'text-muted-foreground')}>
              {selectedLabel ?? placeholder ?? t('placeholder')}
            </span>
            <ChevronDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        {showClear && (
          <button
            type="button"
            aria-label={t('clear')}
            onClick={handleClear}
            className="absolute top-1/2 right-9 -translate-y-1/2 cursor-pointer rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={!isAsync}>
          <CommandInput value={query} onValueChange={setQuery} placeholder={searchPlaceholder ?? t('search')} />
          <CommandList id={listboxId}>
            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {loadingText ?? t('loading')}
              </div>
            )}
            {isQueryTooShort && <CommandEmpty>{t('minChars', { count: minQueryLength })}</CommandEmpty>}
            {showEmpty && <CommandEmpty>{emptyText ?? t('noResults')}</CommandEmpty>}
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <CommandItem
                  key={option.value}
                  value={String(option.value)}
                  keywords={[option.label]}
                  onSelect={() => handleSelect(option)}
                >
                  <Check className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                  {option.label}
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { AsyncCombobox };
export type { ComboboxProps, StaticComboboxProps, AsyncComboboxProps };
