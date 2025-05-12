import * as React from 'react';

import { cn } from '@/lib/utils';

const Card = ({ className, ref, ...props }: React.ComponentProps<'div'>) => (
  <div ref={ref} className={cn('rounded-lg bg-card text-card-foreground shadow-lg', className)} {...props} />
);
Card.displayName = 'Card';

const CardHeader = ({ className, ref, ...props }: React.ComponentProps<'div'>) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-10', className)} {...props} />
);
CardHeader.displayName = 'CardHeader';

const CardTitle = ({ className, ref, ...props }: React.ComponentProps<'div'>) => (
  <div ref={ref} className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
);
CardTitle.displayName = 'CardTitle';

const CardDescription = ({ className, ref, ...props }: React.ComponentProps<'div'>) => (
  <div ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
);
CardDescription.displayName = 'CardDescription';

const CardContent = ({ className, ref, ...props }: React.ComponentProps<'div'>) => (
  <div ref={ref} className={cn('p-10 pt-0', className)} {...props} />
);
CardContent.displayName = 'CardContent';

const CardFooter = ({ className, ref, ...props }: React.ComponentProps<'div'>) => (
  <div ref={ref} className={cn('flex items-center p-10 pt-0', className)} {...props} />
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
