import { Suspense } from 'react';
import { LocaleSwitch } from '@/components/ui/locale-switch';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';

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
