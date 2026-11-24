import { SpinnerGap } from '@/app/images';
import { cn } from '@/lib/utils';

export const LoadingScreen = ({ className }: { className?: string } = {}) => {
  return (
    <div className={cn('flex h-full items-center justify-center', className)}>
      <SpinnerGap />
    </div>
  );
};
