'use client';

import { Tabs } from '@/components/ui/tabs';
import { useRouter, useSearchParams } from 'next/navigation';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  defaultTab?: string;
}

export function TableTabs({ children, defaultTab }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSheet = searchParams.get('tab') || defaultTab;

  const handleSheetChange = (value: string) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set('tab', value);
    router.push(`?${currentParams.toString()}`);
  };

  return (
    <Tabs value={selectedSheet} onValueChange={handleSheetChange}>
      {children}
    </Tabs>
  );
}
