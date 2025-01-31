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

export const Heading1 = createHeading('h1', 'lg:text-6xl lg:leading-5xl text-4xl leading-3xl');

Heading1.displayName = 'Heading1';

export const Heading2 = createHeading('h2', 'lg:text-5xl lg:leading-4xl text-3xl leading-2xl');

Heading2.displayName = 'Heading2';

export const Heading3 = createHeading('h3', 'lg:text-4xl lg:leading-3xl text-2xl leading-xl');

Heading3.displayName = 'Heading3';

export const Heading4 = createHeading('h4', 'lg:text-3xl lg:leading-2xl text-xl leading-lg');

Heading4.displayName = 'Heading4';

export const Heading5 = createHeading('h5', 'lg:text-2xl lg:leading-xl text-lg leading-md');

Heading5.displayName = 'Heading5';

export const Heading6 = createHeading('h6', 'lg:text-xl lg:leading-lg text-base leading-base');

Heading6.displayName = 'Heading6';
