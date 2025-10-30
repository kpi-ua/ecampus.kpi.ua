'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const tabsListVariants = cva(
  'inline-flex items-center justify-center rounded-md border border-neutral-400 p-[3px] text-muted-foreground',
  {
    variants: {
      size: {
        small: 'h-fit text-sm font-semibold',
        medium: 'h-11 text-base font-semibold',
        big: 'h-14 text-lg font-semibold',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  },
);

type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>;

const TabsList = ({ className, ref, size, ...props }: TabsListProps) => (
  <TabsPrimitive.List ref={ref} className={cn(tabsListVariants({ size }), className)} {...props} />
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = ({ className, ref, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'ring-offset-background focus-visible:ring-ring data-[state=active]:bg-basic-blue data-[state=active]:text-basic-white inline-flex cursor-pointer items-center justify-center rounded-sm bg-white px-3 py-1.5 text-sm font-medium whitespace-nowrap text-neutral-700 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-xs',
      className,
    )}
    {...props}
  />
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabSheetTrigger = ({ className, ref, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) => {
  return (
    <TabsTrigger
      {...props}
      className="data-[state=active]:bg-basic-white data-[state=active]:text-basic-blue h-12 rounded-t-[8px] rounded-b-none px-3 py-0 text-base font-semibold data-[state=inactive]:bg-transparent data-[state=inactive]:text-neutral-700 md:px-8"
    />
  );
};
TabSheetTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = ({ className, ref, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
      className,
    )}
    {...props}
  />
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent, TabSheetTrigger };
