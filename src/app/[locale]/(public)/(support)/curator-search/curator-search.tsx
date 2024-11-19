'use client';

import { CuratorSearchItem } from './curator-search-item';
import { Input } from '@/components/ui/input';
import { EmptyPlaceholder } from './empty-placeholder';
import MagnifyingGlassRegular from '@/app/images/icons/MagnifyingGlassRegular.svg';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { searchByGroupName } from '@/actions/group.actions';
import { useEffect, useState } from 'react';
import { Group } from '@/types/group';
import { debounce } from 'radash';
import { Show } from '@/components/utils/show';

export const CuratorSearch = () => {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const { errorToast } = useServerErrorToast();

  const searchGroups = async (name: string) => {
    try {
      setIsLoading(true);

      const response = name ? await searchByGroupName(name) : [];

      setGroups(response);
    } catch (error) {
      errorToast();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    searchGroups(search);
  }, [search]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };

  return (
    <div className="flex flex-col gap-4 grow border-[1px] border-solid border-neutral-200 w-full rounded-lg p-4">
      <Input placeholder="Назва групи" icon={<MagnifyingGlassRegular />} onChange={debounce({ delay: 200 }, handleChange)} />
      <div className="relative grow">
        <Show when={!search && !groups.length}>
          <EmptyPlaceholder text="Введіть назву свої групи в поле вище для пошуку куратора" />
        </Show>
        <Show when={!!search && !groups.length}>
          <Show when={isLoading} fallback={<EmptyPlaceholder text="Нічого не знайдено" />}>
            <EmptyPlaceholder text="Пошук..." />
          </Show>
        </Show>
        <Show when={!!groups.length}>
          <div className="absolute inset-0 overflow-y-auto">
            {groups.map(group => (
              <CuratorSearchItem group={group.name} department={group.cathedra.name} curatorName={group.curator.fullName} link={group.curator.profile} />
            ))}
          </div>
        </Show>
      </div>
    </div>
  );
};
