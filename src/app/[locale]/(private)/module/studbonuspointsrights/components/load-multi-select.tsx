'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { SbpLoadCatalogItem } from '@/types/models/sbp-rights';

interface Props {
  loads: SbpLoadCatalogItem[];
  value: number[];
  onChange: (next: number[]) => void;
}

interface Group {
  workKindId: number;
  workKindName: string;
  treeId: number;
  treeName: string;
  loads: SbpLoadCatalogItem[];
}

/**
 * Multi-select for SBP loads, grouped by work-kind → tree. Selection is held
 * in the parent form (array of loadIds). Toggling a row updates the array;
 * the popover stays open so the SuperAdmin can pick several loads in a row.
 */
export function LoadMultiSelect({ loads, value, onChange }: Props) {
  const t = useTranslations('private.studbonuspointsrights.grant');
  const [open, setOpen] = useState(false);

  const groups = useMemo<Group[]>(() => {
    const map = new Map<string, Group>();
    for (const load of loads) {
      const key = `${load.workKindId}:${load.treeId}`;
      let group = map.get(key);
      if (!group) {
        group = {
          workKindId: load.workKindId,
          workKindName: load.workKindName,
          treeId: load.treeId,
          treeName: load.treeName,
          loads: [],
        };
        map.set(key, group);
      }
      group.loads.push(load);
    }
    return [...map.values()];
  }, [loads]);

  const selected = new Set(value);

  const toggle = (loadId: number) => {
    const next = selected.has(loadId)
      ? value.filter((id) => id !== loadId)
      : [...value, loadId];
    onChange(next);
  };

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
          <span className={cn(value.length === 0 && 'text-muted-foreground')}>
            {value.length === 0 ? t('loadsPlaceholder') : t('loadsSelected', { count: value.length })}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={t('loadsSearchPlaceholder')} />
          <CommandList className="max-h-72">
            <CommandEmpty>{t('loadsNotFound')}</CommandEmpty>
            {groups.map((group) => (
              <CommandGroup
                key={`${group.workKindId}:${group.treeId}`}
                heading={`${group.workKindName} · ${group.treeName}`}
              >
                {group.loads.map((load) => {
                  const isSelected = selected.has(load.loadId);
                  return (
                    <CommandItem
                      key={load.loadId}
                      value={`${load.subTreeNumber ?? ''} ${load.loadName}`}
                      onSelect={() => toggle(load.loadId)}
                    >
                      <Check className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                      <span className="flex-1">
                        {load.subTreeNumber != null ? `${load.subTreeNumber}. ` : ''}
                        {load.loadName}
                      </span>
                      <span className="text-muted-foreground ml-2 text-xs">{load.mark}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
