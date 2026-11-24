import { type ReactNode } from 'react';

import { DeanPageLayout } from '../components/dean-page-layout';

export default function Layout({ children }: { children: ReactNode }) {
  return <DeanPageLayout>{children}</DeanPageLayout>;
}
