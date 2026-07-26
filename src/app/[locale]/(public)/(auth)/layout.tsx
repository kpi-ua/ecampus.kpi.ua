import { setRequestLocale } from 'next-intl/server';
import { Footer } from '../footer';
import { Header } from '../header';
import { LocaleProps } from '@/types/locale-props';

interface Props extends LocaleProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children, params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <div className="flex min-h-dvh min-w-[344px] flex-col px-5 py-5 md:px-14 md:py-8">
      <Header />
      <main className="flex grow justify-center">
        <div className="w-full max-w-[455px] py-8">{children}</div>
      </main>
      <div className="mx-auto w-full max-w-[455px] text-center">
        <Footer />
      </div>
    </div>
  );
}
