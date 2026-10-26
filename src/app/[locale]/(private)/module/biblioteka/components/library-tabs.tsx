'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

import { LIBRARY_TAB, type LibraryTab } from '../constants';

interface Props {
  active?: LibraryTab;
}

export const LibraryTabs = ({ active }: Props) => {
  const t = useTranslations('private.library.tabs');
  const itemClass = (selected: boolean) =>
    cn(
      'inline-flex h-12 shrink-0 items-center border-b-2 border-transparent px-5 text-sm font-semibold whitespace-nowrap transition-colors',
      'focus-visible:outline-basic-blue focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
      selected ? 'border-basic-blue text-basic-blue' : 'text-neutral-400',
    );

  return (
    <nav className="border-neutral-divider flex h-13 w-full justify-start overflow-x-auto rounded-lg border bg-white">
      <Link href="/module/biblioteka" className={itemClass(active === LIBRARY_TAB.DEPARTMENTS)}>
        {t('departments')}
      </Link>
      <Link href="/module/biblioteka/alphabet" className={itemClass(active === LIBRARY_TAB.ALPHABET)}>
        {t('alphabet')}
      </Link>
    </nav>
  );
};
