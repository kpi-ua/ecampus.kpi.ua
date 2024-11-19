import { cn } from '@/lib/utils';
import { AuthNavLayout, AuthNavLayoutProps } from '../auth-nav-layout';

interface SupportNavLayoutProps extends AuthNavLayoutProps {
  className?: string;
}

export const SupportNavLayout = ({ children, className, ...props }: SupportNavLayoutProps) => {
  return (
    <AuthNavLayout {...props}>
      <section className={cn("mt-8 text-lg leading-normal", className)}>
        {children}
      </section>
    </AuthNavLayout>
  );
}