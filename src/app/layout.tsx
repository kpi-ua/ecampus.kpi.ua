import { ReactNode } from 'react';
import './globals.css';
import { exo2Font } from '@/app/font';
import { NextIntlClientProvider } from 'next-intl';
import { GoogleAnalytics } from '@next/third-parties/google';
import { QueryProvider } from '@/components/query-provider';

type Props = {
  children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
  return (
    <html>
      <body className={`${exo2Font.className}`}>
        <QueryProvider>
          <NextIntlClientProvider messages={null}>{children}</NextIntlClientProvider>
        </QueryProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
    </html>
  );
}
