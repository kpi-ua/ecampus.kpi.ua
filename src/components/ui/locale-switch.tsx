'use client';

import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';

import { FlagGB, FlagUA } from '@/app/images';
import { Link, LOCALE, usePathname } from '@/i18n/routing';

const LocaleOption = ({ text, icon }: { text: string; icon: ReactNode }) => (
  <>
    <span className="hidden text-neutral-600 md:block">{text}</span>
    {icon}
  </>
);

export const LocaleSwitch = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const searchparams = useSearchParams();

  const getTitle = () => {
    switch (locale) {
      case LOCALE.UK:
        return <LocaleOption text="Switch to English" icon={<FlagGB />} />;
      default:
        return <LocaleOption text="Перейти на українську" icon={<FlagUA />} />;
    }
  };

  return (
    <Link
      href={{ pathname, search: searchparams.toString() }}
      locale={locale === LOCALE.EN ? LOCALE.UK : LOCALE.EN}
      className="flex items-center gap-[6px] text-end"
    >
      {getTitle()}
    </Link>
  );
};
