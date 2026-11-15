import React from 'react';

import { cn } from '@/lib/utils';

export const Strong = ({ className, ref, ...props }: React.ComponentProps<'strong'>) => {
  return <strong className={cn('font-bold', className)} ref={ref} {...props} />;
};

Strong.displayName = 'Strong';
