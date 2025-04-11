import { LogoEN, LogoUK, LogoBetaEN, LogoBetaUK } from '@/app/images';
import { Link, LOCALE } from '@/i18n/routing';
import { getLocale } from 'next-intl/server';

export const Logo = async () => {
  const locale = await getLocale();
  const isBeta = process.env.NEXT_PUBLIC_BETA_LOGO === 'true';

  const renderLogo = () => {
    if (isBeta) {
      return locale === LOCALE.EN ? <LogoBetaEN /> : <LogoBetaUK />;
    }

    return locale === LOCALE.EN ? <LogoEN /> : <LogoUK />;
  };

  return <Link href="/">{renderLogo()}</Link>;
};
