/* eslint-disable react/display-name */
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

// export interface HeadingProps<T extends keyof JSX.IntrinsicElements> extends React.ComponentProps<T> {}

// const createHeading =
//   <T extends keyof JSX.IntrinsicElements>(Component: React.ComponentType<T>, baseClassName: string) =>
//   ({ className }: React.ComponentProps<T>) => (
//     <Component className={cn('font-semibold', baseClassName, className)} {...props} />
//   );

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

// export const Heading0 = createHeading<'h1'>('h1', 'text-7xl leading-6xl');

// Heading0.displayName = 'Heading0';

// export const Heading1 = createHeading('h1', 'lg:text-6xl lg:leading-5xl text-4xl leading-3xl');

// Heading1.displayName = 'Heading1';

// export const Heading2 = createHeading('h2', 'lg:text-5xl lg:leading-4xl text-3xl leading-2xl');

// Heading2.displayName = 'Heading2';

// export const Heading3 = createHeading('h3', 'lg:text-4xl lg:leading-3xl text-2xl leading-xl');

// Heading3.displayName = 'Heading3';

// export const Heading4 = createHeading('h4', 'lg:text-3xl lg:leading-2xl text-xl leading-lg');

// Heading4.displayName = 'Heading4';

// export const Heading5 = createHeading('h5', 'lg:text-2xl lg:leading-xl text-lg leading-md');

// Heading5.displayName = 'Heading5';

// export const Heading6 = createHeading('h6', 'lg:text-xl lg:leading-lg text-base leading-base');

// Heading6.displayName = 'Heading6';
