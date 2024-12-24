import { Footer } from '../footer';
import { Header } from '../header';

export default function PublicPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-[100vh] min-h-fit min-w-[344px] gap-[20px] p-[20px]">
      <div className="flex min-h-fit grow basis-0 flex-col md:px-[28px] md:py-[16px]">
        <Header />
        <div className="my-8 grid grow grid-cols-12 gap-4 tall:my-16">
          <div className="col-span-12 col-start-1 flex flex-col items-start md:col-span-8 md:col-start-2 lg:col-span-6 lg:col-start-2 xl:col-span-5 xl:col-start-2 2xl:col-span-4 2xl:col-start-2">
            {children}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
