import { setRequestLocale } from 'next-intl/server';
import { PublicLinks } from './public-links';

export default function LoginLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  setRequestLocale(locale);

  return (
    <>
      {children}
      <PublicLinks />
    </>
  );
}
