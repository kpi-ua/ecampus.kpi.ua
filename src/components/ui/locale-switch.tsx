'use client';

import { Link, LOCALE, usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';

interface Props {
  className?: string;
}

export const LocaleSwitch = ({ className }: Props) => {
  const locale = useLocale();
  const pathname = usePathname();

  const getTitle = () => {
    switch (locale) {
      case LOCALE.UK:
        return 'Switch to english 🇬🇧';
      default:
        return 'Перейти на українську 🇺🇦';
    }
  }

  return (
    <Link href={pathname} locale={locale === LOCALE.EN ? LOCALE.UK : LOCALE.EN} className={className}>{getTitle()}</Link>
  );
};
