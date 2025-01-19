import Logo from '@/app/images/logo.svg';
import { LocaleSwitch } from '@/components/ui/locale-switch';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn('flex items-center justify-between', className)}>
      <div className="flex max-w-[120px] md:max-w-[140px]">
        <Logo />
      </div>
      <LocaleSwitch className="flex items-center gap-[6px]" />
    </header>
  );
};
