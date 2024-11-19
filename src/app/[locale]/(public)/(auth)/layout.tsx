import { Footer } from '../footer';
import { Header } from '../header';
import { LoginCarousel } from './login-carousel';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign-In",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex p-[20px] gap-[20px] h-[100vh] min-w-[344px] min-h-fit">
      <div className="flex flex-col md:px-[28px] md:py-[16px] grow basis-0 min-h-fit">
        <Header />
        <div className="relative flex flex-col py-8 grow">
          <div className="mx-auto max-w-[455px] top-[50%] -translate-y-[50%] relative">
            {children}
          </div>
        </div>
        <Footer />
      </div>
      <div className="relative hidden grow basis-0 lg:block">
        <LoginCarousel />
      </div>
    </div>
  );
}
