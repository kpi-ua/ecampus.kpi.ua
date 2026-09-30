import { ReactNode } from 'react';
import './globals.css';
import { exo2Font } from '@/app/font';
import { NextIntlClientProvider } from 'next-intl';
import { GoogleAnalytics } from '@next/third-parties/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { QueryProvider } from '@/components/query-provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

type Props = {
  children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
  return (
    <html>
      <body className={`${exo2Font.className}`}>
        <NuqsAdapter>
          <QueryProvider>
            <NextIntlClientProvider messages={null}>{children}</NextIntlClientProvider>
          </QueryProvider>
        </NuqsAdapter>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
    </html>
  );
}
