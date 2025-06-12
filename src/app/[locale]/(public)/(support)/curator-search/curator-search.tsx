'use client';

import { CuratorSearchItem } from './curator-search-item';
import { Input } from '@/components/ui/input';
import { EmptyPlaceholder } from './empty-placeholder';
import MagnifyingGlassRegular from '@/app/images/icons/MagnifyingGlassRegular.svg';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { searchByGroupName } from '@/actions/group.actions';
import { useCallback, useEffect, useState } from 'react';
import { Group } from '@/types/models/group';
import { debounce } from 'radash';
import { Show } from '@/components/utils/show';
import { useTranslations } from 'next-intl';

export const CuratorSearch = () => {
  const t = useTranslations('public.curator-search');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const { errorToast } = useServerErrorToast();

  const searchGroups = useCallback(async (name: string) => {
    try {
      setIsLoading(true);

      const response = name ? await searchByGroupName(name) : [];

      setGroups(response);
    } catch (error) {
      errorToast();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    searchGroups(search);
  }, [search, searchGroups]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };

  return (
    <div className="flex w-full grow flex-col gap-4 rounded-lg border-[1px] border-solid border-neutral-200 p-4">
      <Input
        placeholder={t('search-placeholder')}
        icon={<MagnifyingGlassRegular />}
        onChange={debounce({ delay: 200 }, handleChange)}
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
                department={group.cathedra.name}
                curatorName={group.curator.fullName}
                link={group.curator.profile}
              />
            ))}
          </div>
        </Show>
      </div>
    </div>
  );
};
