import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Viewport } from 'next';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import BaseLayout from '@/components/base-layout';

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

export default function RootLayout({
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

  return <BaseLayout locale={locale}>{children}</BaseLayout>;
}
