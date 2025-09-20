import { setRequestLocale } from 'next-intl/server';
import { LocaleProps } from '@/types/locale-props';
import { Header } from '../header';
import { Footer } from '@/app/[locale]/(public)/footer';

interface Props extends LocaleProps {
  children: React.ReactNode;
}

export default async function PublicPagesLayout({ children, params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <div className="flex h-[100vh] min-h-fit min-w-[344px] gap-[20px] p-[20px]">
      <div className="flex min-h-fit grow basis-0 flex-col md:px-[28px] md:py-[16px]">
        <Header />
        <div className="tall:my-16 my-8 grid grow grid-cols-12 gap-4">
          <div className="col-span-12 col-start-1 flex flex-col items-start md:col-span-10 md:col-start-2 lg:col-span-10 lg:col-start-2 xl:col-span-10 xl:col-start-2 2xl:col-span-10 2xl:col-start-2">
            {children}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
