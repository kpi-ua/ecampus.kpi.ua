import { setRequestLocale } from 'next-intl/server';

import { LocaleProps } from '@/types/locale-props';

import { PublicLinks } from './public-links';

interface Props extends LocaleProps {
  children: React.ReactNode;
}

export default async function LoginLayout({ children, params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <>
      {children}
      <PublicLinks />
    </>
  );
}
