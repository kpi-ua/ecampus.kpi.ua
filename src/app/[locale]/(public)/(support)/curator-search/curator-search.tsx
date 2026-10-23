'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { debounce } from 'radash';
import { type ChangeEvent, useMemo, useState } from 'react';

import { searchByGroupName } from '@/actions/group.actions';
import MagnifyingGlassRegular from '@/app/images/icons/MagnifyingGlassRegular.svg';
import { Input } from '@/components/ui/input';
import { Show } from '@/components/utils/show';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

import { CuratorSearchItem } from './curator-search-item';
import { EmptyPlaceholder } from './empty-placeholder';

export const CuratorSearch = () => {
  const t = useTranslations('public.curator-search');
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useMemo(() => debounce({ delay: 200 }, setSearch), []);
  const { errorToast } = useServerErrorToast();

  const unknownValue = t('unknown-value');

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['groups', 'search', search],
    queryFn: async () => {
      try {
        return await searchByGroupName(search);
      } catch (error) {
        errorToast();
        throw error;
      }
    },
    enabled: !!search,
  });

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  return (
    <div className="flex w-full grow flex-col gap-4 rounded-lg border border-solid border-neutral-200 p-4">
      <Input
        placeholder={t('search-placeholder')}
        icon={<MagnifyingGlassRegular />}
        value={inputValue}
        onChange={handleInput}
      />
      <div className="relative grow">
        <Show when={!search && !groups.length}>
          <EmptyPlaceholder text={t('search-default')} />
        </Show>
        <Show when={!!search && !groups.length}>
          <Show when={isLoading} fallback={<EmptyPlaceholder text={t('not-found')} />}>
            <EmptyPlaceholder text={t('searching')} />
          </Show>
        </Show>
        <Show when={!!groups.length}>
          <div className="absolute inset-0 overflow-y-auto">
            {groups.map((group) => (
              <CuratorSearchItem
                key={group.id}
                group={group.name}
                department={group.cathedra?.name || unknownValue}
                curatorName={group.curator?.fullName || unknownValue}
                link={group.curator?.profile}
              />
            ))}
          </div>
        </Show>
      </div>
    </div>
  );
};
