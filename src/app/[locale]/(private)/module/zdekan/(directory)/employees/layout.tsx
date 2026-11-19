import { type ReactNode } from 'react';

import { EmployeeTabs } from '../../components/employee-tabs';

export default function Layout({ children }: { children: ReactNode }) {
  return <EmployeeTabs>{children}</EmployeeTabs>;
}
