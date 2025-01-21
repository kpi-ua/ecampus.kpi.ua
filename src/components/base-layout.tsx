import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Exo_2 } from 'next/font/google';

const exo2Font = Exo_2({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-exo-2',
});

type Props = {
  children: ReactNode;
  locale: string;
};

export default async function BaseLayout({ children, locale }: Props) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${exo2Font.className}`}>
        <NextIntlClientProvider messages={messages}>
          {children} <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
