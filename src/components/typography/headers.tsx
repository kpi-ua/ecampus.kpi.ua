/* eslint-disable react/display-name */
import { cn } from '@/lib/utils';
import React from 'react';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const createHeading = (
  Component: React.ElementType<any, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>,
  baseClassName: string,
) =>
  React.forwardRef<HTMLHeadingElement, HeadingProps>(({ className, ...props }, ref) => {
    return <Component className={cn('font-semibold', baseClassName, className)} ref={ref} {...props} />;
  });

export const Heading0 = createHeading('h1', 'text-7xl leading-6xl');
Heading0.displayName = 'Heading0';

export const Heading1 = createHeading('h1', 'text-6xl leading-5xl');

Heading1.displayName = 'Heading1';

export const Heading2 = createHeading('h2', 'text-5xl leading-4xl');

Heading2.displayName = 'Heading2';

export const Heading3 = createHeading('h3', 'text-4xl leading-3xl');

Heading3.displayName = 'Heading3';

export const Heading4 = createHeading('h4', 'text-3xl leading-2xl');

Heading4.displayName = 'Heading4';

export const Heading5 = createHeading('h5', 'text-2xl leading-xl');

Heading5.displayName = 'Heading5';

export const Heading6 = createHeading('h6', 'text-xl leading-lg');

Heading6.displayName = 'Heading6';
