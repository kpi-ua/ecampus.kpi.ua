import { Footer } from '../footer';
import { Header } from '../header';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign-In",
};

export default function PublicPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex p-[20px] gap-[20px] h-[100vh] min-w-[344px] min-h-fit">
      <div className="flex flex-col md:px-[28px] md:py-[16px] grow basis-0 min-h-fit">
        <Header />
        <div className="grid grid-cols-12 gap-4 my-16 grow">
          <div className="flex flex-col items-start col-span-12 col-start-1 md:col-span-8 md:col-start-2 lg:col-span-6 lg:col-start-2 xl:col-span-5 xl:col-start-2 2xl:col-start-2 2xl:col-span-4">
            {children}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
