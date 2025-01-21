import Logo from '@/app/images/logo.svg';
import { LocaleSwitch } from '@/components/ui/locale-switch';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn('flex items-center justify-between', className)}>
      <Link href="/" className="flex max-w-[120px] md:max-w-[140px]">
        <Logo />
      </Link>
      <LocaleSwitch />
    </header>
  );
};
