import '../globals.css';

import { NextIntlClientProvider } from 'next-intl';
import { exo2Font } from './font';
import { getMessages, getTranslations } from 'next-intl/server';
import { Toaster } from '@/components/ui/toaster';
import { Viewport } from 'next';

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
};

export async function generateMetadata({ params: { locale } }: any) {
  const t = await getTranslations({ locale, namespace: 'global.metadata' });

  return {
    title: {
      default: t('title'),
      template: `%s | ${t('title')}`,
    },
    description: t('description'),
    icons: [
      { type: 'image/png', sizes: '48x48', url: '/favicon-48x48.png' },
      { type: 'image/svg+xml', url: '/favicon.svg' },
      { rel: 'shortcut icon', url: '/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '180x180', url: '/apple-touch-icon.png' },
    ],
    manifest: '/site.webmanifest',
    appleWebApp: {
      title: t('title'),
    },
  };
}

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
