import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Show } from '../utils/show';

type HTMLInputProps = Omit<React.ComponentProps<'input'>, 'size'>;

export interface InputProps extends HTMLInputProps, VariantProps<typeof inputVariants> {
  icon?: React.ReactNode;
}

const inputVariants = cva(
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        medium: 'h-[44px]',
        small: 'h-[36px]',
      },
      iconPosition: {
        start: '',
        end: '',
      },
    },
    defaultVariants: {
      size: 'medium',
      iconPosition: 'start',
    },
  },
);

const Input = ({ className, type, icon, size, iconPosition = 'start', ref, ...props }: InputProps) => {
  const computedClass = cn(
    inputVariants({ size, iconPosition }),
    icon && iconPosition === 'start' ? 'pl-[40px]' : '',
    icon && iconPosition === 'end' ? 'pr-[40px]' : '',
    className,
  );

  return (
    <div
      className={cn(
        'relative w-full [&_svg]:absolute [&_svg]:size-[20px] [&_svg]:text-neutral-400',
        icon && iconPosition === 'start' ? '[&_svg]:inset-[12px]' : '',
        icon && iconPosition === 'end' ? '[&_svg]:right-[12px] [&_svg]:top-[12px]' : '',
      )}
    >
      <Show when={!!icon && iconPosition === 'start'}>{icon}</Show>
      <input type={type} className={computedClass} ref={ref} {...props} />
      <Show when={!!icon && iconPosition === 'end'}>{icon}</Show>
    </div>
  );
};
Input.displayName = 'Input';

export { Input };
