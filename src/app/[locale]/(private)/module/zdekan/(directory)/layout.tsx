import { type ReactNode } from 'react';

import { DeanOfficePageLayout } from '../components/dean-office-page-layout';

export default function Layout({ children }: { children: ReactNode }) {
  return <DeanOfficePageLayout>{children}</DeanOfficePageLayout>;
}
