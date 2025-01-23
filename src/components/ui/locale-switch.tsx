'use client';

import { Link, LOCALE, usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { FlagGB, FlagUA } from '@/app/images';

export const LocaleSwitch = () => {
  const locale = useLocale();
  const pathname = usePathname();

  const getTitle = () => {
    switch (locale) {
      case LOCALE.UK:
        return (
          <>
            <span className="hidden text-neutral-600 md:block">Switch to English</span> <FlagGB />
          </>
        );
      default:
        return (
          <>
            <span className="hidden text-neutral-600 md:block">Перейти на українську</span> <FlagUA />
          </>
        );
    }
  };

  return (
    <Link
      href={pathname}
      locale={locale === LOCALE.EN ? LOCALE.UK : LOCALE.EN}
      className="flex items-center gap-[6px] text-end"
    >
      {getTitle()}
    </Link>
  );
};
