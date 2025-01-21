import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { exo2Font } from '@/components/utils/font';

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
