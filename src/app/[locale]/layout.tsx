import '../globals.css';

import { NextIntlClientProvider } from 'next-intl';
import { exo2Font } from './font';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Toaster } from '@/components/ui/toaster';
import { Viewport } from 'next';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

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