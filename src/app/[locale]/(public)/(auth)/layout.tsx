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
    <div className="3xl:!px-[167px] 3xl:!py-[48px] relative flex min-h-dvh min-w-[344px] flex-col px-5 py-5 md:px-14 md:py-8">
      <Header />
      <main className="3xl:tall:absolute 3xl:tall:inset-0 3xl:tall:items-center 3xl:tall:py-0 flex justify-center pt-8 pb-0 md:grow md:py-8">
        <div className="w-full max-w-[516px]">{children}</div>
      </main>
      <Footer className="3xl:tall:absolute 3xl:tall:right-[167px] 3xl:tall:bottom-[48px] 3xl:tall:left-[167px] 3xl:tall:mt-0 mt-[36px] text-center" />
    </div>
  );
}
