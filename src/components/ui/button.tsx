import * as React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import SpinnerGap from '@/app/images/icons/SpinnerGap.svg';
import { cn } from '@/lib/utils';
import { IconPosition } from '../types';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-basic-blue text-primary-foreground hover:bg-brand-700 active:bg-basic-blue active:border-brand-900 active:border-[1px] active:border-solid disabled:opacity-40',
        secondary:
          'bg-transparent text-neutral-900 border-[1px] border-solid border-neutral-300 hover:border-neutral-900 active:bg-brand-00 active:border-basic-blue active:text-basic-blue disabled:bg-neutral-50 disabled:border-neutral-300 disabled:text-neutral-300',
        tertiary:
          'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-700 active:text-neutral-900 active:bg-transparent disabled:text-neutral-400',
      },
      size: {
        small: 'p-[10px] text-sm [&_svg]:size-[16px] leading-xs',
        medium: 'p-[12px] text-base [&_svg]:size-[20px] leading-base',
        big: 'p-[16px] text-lg [&_svg]:size-[24px] leading-lg',
      },
    },
    compoundVariants: [
      {
        variant: ['primary'],
        size: 'big',
        class: 'active:p-[15px]',
      },
      {
        variant: ['primary'],
        size: 'medium',
        class: 'active:p-[11px]',
      },
      {
        variant: ['primary'],
        size: 'small',
        class: 'active:p-[9px]',
      },
      {
        variant: ['secondary'],
        size: 'big',
        class: 'p-[15px]',
      },
      {
        variant: ['secondary'],
        size: 'medium',
        class: 'p-[11px]',
      },
      {
        variant: ['secondary'],
        size: 'small',
        class: 'p-[9px]',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      icon,
      iconPosition = 'start',
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    const iconAtPosition = (position: IconPosition) => {
      if (loading) {
        return position === 'start' ? <SpinnerGap /> : null;
      }

      return icon && position === iconPosition ? icon : null;
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading ? true : disabled}
        {...props}
      >
        {iconAtPosition('start')}
        <Slottable>{children}</Slottable>
        {iconAtPosition('end')}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
