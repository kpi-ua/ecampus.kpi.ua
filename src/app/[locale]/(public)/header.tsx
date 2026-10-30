import { Suspense } from 'react';

import { Logo } from '@/components/logo';
import { LocaleSwitch } from '@/components/ui/locale-switch';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn('flex items-center justify-between', className)}>
      <Logo />
      <Suspense>
        <LocaleSwitch />
      </Suspense>
    </header>
  );
};
