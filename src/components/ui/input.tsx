import * as React from 'react';

import { cn } from '@/lib/utils';
import { IconPosition } from '../types';
import { Show } from '../utils/show';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, iconPosition = 'start', ...props }, ref) => {
    return (
      <div
        className={cn(
          'relative w-full [&_svg]:absolute [&_svg]:size-[20px] [&_svg]:text-neutral-400',
          iconPosition === 'start' ? '[&_svg]:inset-[12px]' : '[&_svg]:right-[12px] [&_svg]:top-[12px]',
        )}
      >
        <Show when={!!icon && iconPosition === 'start'}>{icon}</Show>
        <input
          type={type}
          className={cn(
            'flex h-[44px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 disabled:cursor-not-allowed disabled:opacity-50',
            icon && iconPosition === 'start' ? 'pl-[40px]' : undefined,
            icon && iconPosition === 'end' ? 'pr-[40px]' : undefined,
            className,
          )}
          ref={ref}
          {...props}
        />
        <Show when={!!icon && iconPosition === 'end'}>{icon}</Show>
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
