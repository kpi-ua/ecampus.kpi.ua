import { notFound } from 'next/navigation';
import React from 'react';

import { getUserDetails } from '@/actions/auth.actions';

export default async function K7Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserDetails();

  if (!user?.employeeProfile) {
    notFound();
  }

  return children;
}
