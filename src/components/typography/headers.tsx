import { cn } from '@/lib/utils';
import React from 'react'

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const createHeading = (Component: React.ElementType<any, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>, baseClassName: string) => React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, ...props }, ref) => {
    return (
      <Component
        className={cn('font-semibold', baseClassName, className)}
        ref={ref}
        {...props}
      />
    )
  }
);

export const Heading1 = createHeading('h1', 'text-6xl leading-10');

export const Heading2 = createHeading('h2', 'text-5xl leading-9');

export const Heading3 = createHeading('h3', 'text-4xl leading-8');

export const Heading4 = createHeading('h4', 'text-3xl leading-7');

export const Heading5 = createHeading('h5', 'text-2xl leading-6');

export const Heading6 = createHeading('h6', 'text-xl leading-5');
