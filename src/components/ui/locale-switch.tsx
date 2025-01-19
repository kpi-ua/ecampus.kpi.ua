'use client';

import { Link, LOCALE, usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { FlagGB, FlagUA } from '@/app/images';

interface Props {
  className?: string;
}

export const LocaleSwitch = ({ className }: Props) => {
  const locale = useLocale();
  const pathname = usePathname();

  const getTitle = () => {
    switch (locale) {
      case LOCALE.UK:
        return (
          <>
            Switch to English <FlagGB />
          </>
        );
      default:
        return (
          <>
            Перейти на українську <FlagUA />
          </>
        );
    }
  };

  return (
    <Link href={pathname} locale={locale === LOCALE.EN ? LOCALE.UK : LOCALE.EN} className={className}>
      {getTitle()}
    </Link>
  );
};
