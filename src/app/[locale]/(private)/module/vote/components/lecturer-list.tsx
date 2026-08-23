'use client';

import { Check, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { ProfilePicture } from '@/components/ui/profile-picture';
import { Show } from '@/components/utils/show';
import { usePagination } from '@/hooks/use-pagination';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/page-size';
import { cn } from '@/lib/utils';
import { VoteLecturer } from '@/types/models/vote';

interface Props {
  lecturers: VoteLecturer[];
  selectedEmployeeId: number | null;
  onSelect: (lecturer: VoteLecturer) => void;
}

export const LecturerList = ({ lecturers, selectedEmployeeId, onSelect }: Props) => {
  const t = useTranslations('private.vote');
  const [search, setSearch] = useState('');

  const filteredLecturers = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();

    if (!normalizedSearch) {
      return lecturers;
    }

    return lecturers.filter((lecturer) => lecturer.fullName.toLocaleLowerCase().includes(normalizedSearch));
  }, [lecturers, search]);

  const { paginatedItems, page } = usePagination(PAGE_SIZE_DEFAULT, filteredLecturers);

  return (
    <section className="flex w-full flex-col gap-5 space-y-5 rounded-3xl bg-white p-6 shadow-lg lg:w-[516px] lg:shrink-0">
      <div>
        <Input
          aria-label={t('search')}
          icon={<Search />}
          placeholder={t('search')}
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <div>
        <div className="bg-neutral-100 px-4 py-2 text-xs font-semibold tracking-wide text-neutral-600 uppercase">
          {t('lecturers')}
        </div>
        <div className="divide-y divide-neutral-100">
          {paginatedItems.map((lecturer) => {
            const isSelected = lecturer.employeeId === selectedEmployeeId;

            return (
              <button
                key={lecturer.employeeId}
                type="button"
                disabled={lecturer.hasVoted}
                onClick={() => onSelect(lecturer)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md border border-transparent px-4 py-3 text-left transition-colors',
                  'hover:bg-brand-00 disabled:cursor-default disabled:opacity-60',
                  isSelected && 'border-basic-blue bg-brand-00',
                )}
              >
                <ProfilePicture size="xs" src={lecturer.photo} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-900">
                  {lecturer.fullName}
                </span>
                <Show when={lecturer.hasVoted}>
                  <Check className="size-4 text-green-600" aria-label={t('completed')} />
                </Show>
              </button>
            );
          })}
          <Show when={filteredLecturers.length === 0}>
            <p className="px-4 py-10 text-center text-sm text-neutral-500">{t('noSearchResults')}</p>
          </Show>
        </div>
      </div>
      <Show when={filteredLecturers.length > PAGE_SIZE_DEFAULT}>
        <div>
          <PaginationWithLinks page={page} pageSize={PAGE_SIZE_DEFAULT} totalCount={filteredLecturers.length} />
        </div>
      </Show>
    </section>
  );
};
