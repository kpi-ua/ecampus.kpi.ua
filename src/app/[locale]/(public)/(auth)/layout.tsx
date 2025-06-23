import { setRequestLocale } from 'next-intl/server';
import { Footer } from '../footer';
import { Header } from '../header';
import { LoginCarousel } from './login-carousel';
import { LocaleProps } from '@/types/locale-props';

interface Props extends LocaleProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children, params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <div className="flex h-dvh min-h-fit min-w-[344px] gap-[20px] p-[20px]">
      <div className="flex min-h-fit grow basis-0 flex-col md:px-[28px] md:py-[16px]">
        <Header />
        <div className="relative flex grow flex-col py-8">
          <div className="relative mx-auto mt-2 max-w-[455px] [@media(min-height:933px)]:mt-[50px]">{children}</div>
        </div>
        <Footer />
      </div>
      <div className="relative hidden grow basis-0 xl:block">
        <LoginCarousel />
      </div>
    </div>
  );
}
