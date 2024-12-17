import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import SpinnerGap from '@/app/images/icons/SpinnerGap.svg';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';

const textButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:shrink-0 cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'text-basic-blue hover:text-brand-700 disabled:text-neutral-400',
        secondary: 'text-neutral-600 hover:text-brand-700 disabled:text-neutral-400',
        link: 'text-neutral-600 hover:text-brand-700 underline',
      },
      size: {
        small: 'text-sm [&_svg]:size-[16px] leading-xs',
        medium: 'text-base [&_svg]:size-[20px] leading-base',
        big: 'text-lg [&_svg]:size-[24px] leading-lg',
        huge: 'text-xl [&_svg]:size-[32px] leading-2xl font-bold',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  },
);

type IconPosition = 'start' | 'end';

type LinkProps = React.ComponentProps<typeof Link>;

export interface TextButtonProps extends LinkProps, VariantProps<typeof textButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
}

const TextButton = React.forwardRef<HTMLAnchorElement, TextButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, icon, iconPosition = 'start', children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : Link;

    const iconAtPosition = (position: IconPosition) => {
      if (loading) {
        return position === 'start' ? <SpinnerGap /> : null;
      }

      return icon && position === iconPosition ? icon : null;
    };

    return (
      <Comp className={cn(textButtonVariants({ variant, size, className }))} ref={ref} {...props}>
        <>
          {iconAtPosition('start')}
          {children}
          {iconAtPosition('end')}
        </>
      </Comp>
    );
  },
);
TextButton.displayName = 'TextButton';

export { TextButton, textButtonVariants };
