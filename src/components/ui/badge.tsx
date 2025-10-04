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
        success: 'bg-green-100 text-status-success-300',
        error: 'bg-red-100 text-red-600',
        warning: 'bg-status-warning-100 text-status-warning-300',
        default: 'bg-gray-100 text-gray-600',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);

const borderColorByVariant = {
  success: 'border border-status-success-300',
  warning: 'border border-status-warning-300',
  error: 'border border-red-600',
  red: 'border border-red-600',
  default: 'border border-gray-600',
  purple: 'border border-other-purple',
  orange: 'border border-other-orange',
} as const;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  withBorder: boolean;
}

function Badge({ className, variant, withBorder, ...props }: BadgeProps) {
  console.log(withBorder);
  const borderColor = withBorder ? borderColorByVariant[variant as keyof typeof borderColorByVariant] : undefined;

  console.log(borderColor);
  return <span className={cn(badgeVariants({ variant }), borderColor, className)} {...props} />;
}

export { Badge, badgeVariants };
