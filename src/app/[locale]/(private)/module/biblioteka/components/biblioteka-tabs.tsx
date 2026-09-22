'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

interface Props {
  active: 'departments' | 'alphabet';
}

export const BibliotekaTabs = ({ active }: Props) => {
  const t = useTranslations('private.biblioteka.tabs');
  const itemClass = (selected: boolean) =>
    cn(
      'inline-flex h-12 shrink-0 items-center border-b-2 border-transparent px-5 text-sm font-semibold whitespace-nowrap transition-colors',
      'focus-visible:outline-basic-blue focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
      selected ? 'border-basic-blue text-basic-blue' : 'text-neutral-400',
    );

  return (
    <nav
      className="border-neutral-divider flex h-12 w-full justify-start overflow-x-auto rounded-lg border bg-white"
    >
      <Link href="/module/biblioteka" className={itemClass(active === 'departments')}>
        {t('departments')}
      </Link>
      <Link href="/module/biblioteka/alphabet" className={itemClass(active === 'alphabet')}>
        {t('alphabet')}
      </Link>
    </nav>
  );
};
