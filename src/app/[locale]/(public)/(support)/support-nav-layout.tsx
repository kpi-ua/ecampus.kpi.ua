import { cn } from '@/lib/utils';
import { AuthNavLayout, AuthNavLayoutProps } from '../auth-nav-layout';

interface SupportNavLayoutProps extends AuthNavLayoutProps {
  className?: string;
}

export const SupportNavLayout = ({ children, className, ...props }: SupportNavLayoutProps) => {
  return (
    <AuthNavLayout {...props} className="flex w-full grow flex-col items-start">
      <section className={cn('leading-lg my-8 text-lg', className)}>{children}</section>
    </AuthNavLayout>
  );
};
