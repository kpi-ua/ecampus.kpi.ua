import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-[8px] py-[5px] text-[13px] leading-base font-semibold',
  {
    variants: {
      variant: {
        red: 'bg-other-red/10 text-other-red',
        purple: 'bg-other-purple/10 text-other-purple',
        orange: 'bg-other-orange/10 text-other-orange',
        blue: 'bg-other-blue/10 text-other-blue',
        neutral: 'bg-neutral-50 text-neutral-700',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
