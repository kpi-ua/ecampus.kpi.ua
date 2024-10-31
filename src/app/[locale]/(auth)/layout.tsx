import { Footer } from './footer';
import { Header } from './header';
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
    <div className="flex p-[20px] h-[100vh]">
      <div className="flex flex-col px-[28px] py-[16px] grow basis-0">
        <Header />
        <div className="relative flex flex-col grow">
          <div className="mx-auto w-[455px] mt-[15%]">
            {children}
          </div>
        </div>
        <Footer />
      </div>
      <div className="relative grow basis-0">
        <LoginCarousel />
      </div>
    </div>
  );
}
