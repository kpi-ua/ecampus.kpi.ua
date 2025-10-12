import { cn } from '@/lib/utils';
import React from 'react';

export const UList = ({ className, ref, ...props }: React.ComponentProps<'ul'>) => {
  return <ul className={cn('leading-lg ml-6 list-outside list-disc text-lg', className)} ref={ref} {...props} />;
};

UList.displayName = 'UlList';
