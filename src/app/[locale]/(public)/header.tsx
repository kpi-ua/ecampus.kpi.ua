import Logo from '@/app/images/logo.svg';
import { Link, LOCALE } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  const locale = useLocale();

  const renderLocaleSwitch = () => {
    switch (locale) {
      case LOCALE.UK:
        return (<Link href="/" locale={LOCALE.EN}>Switch to english 🇬🇧</Link>);
      default:
        return (<Link href="/" locale={LOCALE.UK}>Перейти на українську 🇺🇦</Link>);
    }
  };

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex max-w-[120px] md:max-w-[140px]">
        <Logo />
      </div>
      {renderLocaleSwitch()}
    </div>
  );
};
