import "./globals.css";

import { Exo_2 } from "next/font/google";
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const exo2Font = Exo_2({ subsets: ['cyrillic', 'latin'], weight: ['400', '500', '600'] });

export const metadata: Metadata = {
  title: "Кампус КПІ",
  description: "Кампус КПІ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body className={`${exo2Font.className}`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
