import { ReactNode } from 'react';
import './globals.css';
import { Exo_2 } from 'next/font/google';

const exo2Font = Exo_2({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-exo-2',
});

type Props = {
  children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
  return (
    <html>
      <body className={`${exo2Font.className}`}>{children}</body>
    </html>
  );
}
