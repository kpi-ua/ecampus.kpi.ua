/* eslint-disable react/display-name */
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

const headingVariants = cva('font-semibold');

export const Heading0 = ({
  className,
  ...props
}: React.ComponentProps<'h1'> & VariantProps<typeof headingVariants>) => (
  <h1 className={cn(headingVariants(), 'text-7xl leading-6xl', className)} {...props} />
);
Heading0.displayName = 'Heading0';

export const Heading1 = ({
  className,
  ...props
}: React.ComponentProps<'h1'> & VariantProps<typeof headingVariants>) => (
  <h1 className={cn(headingVariants(), 'text-4xl leading-3xl lg:text-6xl lg:leading-5xl', className)} {...props} />
);
Heading1.displayName = 'Heading1';

export const Heading2 = ({
  className,
  ...props
}: React.ComponentProps<'h2'> & VariantProps<typeof headingVariants>) => (
  <h2 className={cn(headingVariants(), 'text-3xl leading-2xl lg:text-5xl lg:leading-4xl', className)} {...props} />
);
Heading2.displayName = 'Heading2';

export const Heading3 = ({
  className,
  ...props
}: React.ComponentProps<'h3'> & VariantProps<typeof headingVariants>) => (
  <h3 className={cn(headingVariants(), 'text-2xl leading-xl lg:text-4xl lg:leading-3xl', className)} {...props} />
);
Heading3.displayName = 'Heading3';

export const Heading4 = ({
  className,
  ...props
}: React.ComponentProps<'h4'> & VariantProps<typeof headingVariants>) => (
  <h4 className={cn(headingVariants(), 'text-xl leading-lg lg:text-3xl lg:leading-2xl', className)} {...props} />
);
Heading4.displayName = 'Heading4';

export const Heading5 = ({
  className,
  ...props
}: React.ComponentProps<'h5'> & VariantProps<typeof headingVariants>) => (
  <h5 className={cn(headingVariants(), 'leading-md text-lg lg:text-2xl lg:leading-xl', className)} {...props} />
);
Heading5.displayName = 'Heading5';

export const Heading6 = ({
  className,
  ...props
}: React.ComponentProps<'h6'> & VariantProps<typeof headingVariants>) => (
  <h6 className={cn(headingVariants(), 'text-base leading-base lg:text-xl lg:leading-lg', className)} {...props} />
);
Heading6.displayName = 'Heading6';
