import { setRequestLocale } from 'next-intl/server';

import { LocaleProps } from '@/types/locale-props';

import { Footer } from '../footer';
import { Header } from '../header';

interface Props extends LocaleProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children, params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <div className="relative flex min-h-dvh min-w-[344px] flex-col px-5 py-5 3xl:!px-[167px] 3xl:!py-[48px] md:px-14 md:py-8">
      <Header />
      <main className="flex justify-center pt-8 pb-0 md:grow md:py-8 3xl:tall:absolute 3xl:tall:inset-0 3xl:tall:items-center 3xl:tall:py-0">
        <div className="flex w-full max-w-[516px] flex-col justify-center">{children}</div>
      </main>
      <Footer className="mt-[36px] text-center 3xl:tall:absolute 3xl:tall:right-[167px] 3xl:tall:bottom-[48px] 3xl:tall:left-[167px] 3xl:tall:mt-0" />
    </div>
  );
}
