'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';

import { cn } from '@/lib/utils';
import { MinusRegular, PlusRegular } from '@/app/images';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = ({ className, ref, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) => (
  <AccordionPrimitive.Item ref={ref} className={className} {...props} />
);
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = ({
  className,
  children,
  ref,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-start gap-4 py-4 font-medium transition-all hover:underline [&[data-state=closed]>.minus]:hidden [&[data-state=open]>.plus]:hidden',
        className,
      )}
      {...props}
    >
      <PlusRegular className="plus h-[28px] w-[28px] shrink-0" />
      <MinusRegular className="minus h-[28px] w-[28px] shrink-0" />
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
);
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = ({
  className,
  children,
  ref,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm transition-all"
    {...props}
  >
    <div className={cn('pt-0 pb-4', className)}>{children}</div>
  </AccordionPrimitive.Content>
);

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
