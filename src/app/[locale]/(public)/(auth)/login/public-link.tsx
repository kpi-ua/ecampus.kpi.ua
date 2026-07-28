import { HTMLAttributeAnchorTarget } from 'react';
import { Link } from '@/i18n/routing';

interface PublicLinkProps {
  icon: React.ReactNode;
  href: string;
  target?: HTMLAttributeAnchorTarget;
  children: React.ReactNode;
}

export const PublicLink = ({ children, icon, href, target }: PublicLinkProps) => {
  return (
    <Link
      href={href}
      target={target}
      className="flex h-[80px] w-[136px] min-w-0 flex-1 flex-col items-center gap-[8px] text-sm sm:flex-none"
    >
      {icon}
      <span className="text-center">{children}</span>
    </Link>
  );
};
