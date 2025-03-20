import { LogoEN, LogoUK } from '@/app/images';
import { Link, LOCALE } from '@/i18n/routing';
import { getLocale } from 'next-intl/server';

export const Logo = async () => {
  const locale = await getLocale();

  const LogoComponent = locale === LOCALE.EN ? LogoEN : LogoUK;

  return (
    <Link href="/">
      <LogoComponent />
    </Link>
  );
};
