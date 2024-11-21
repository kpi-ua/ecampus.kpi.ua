import "./globals.css";

import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { exo2Font } from './font';
import { getMessages } from 'next-intl/server';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: "Кампус КПІ",
  description: "Кампус КПІ",
  icons: [
    { type: 'image/png', sizes: '48x48', url: '/favicon-48x48.png' },
    { type: 'image/svg+xml', url: '/favicon.svg' },
    { rel: 'shortcut icon', url: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/apple-touch-icon.png' },
  ],
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'Е-Кампус',
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html>
      <body className={`${exo2Font.className}`}>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
