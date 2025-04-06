import { ReactNode } from 'react';
import './globals.css';
import { exo2Font } from '@/app/font';

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
