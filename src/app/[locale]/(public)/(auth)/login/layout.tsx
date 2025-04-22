import { setRequestLocale } from 'next-intl/server';
import { PublicLinks } from './public-links';

interface Props
  extends Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }> {}

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
