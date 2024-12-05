import { cn } from '@/lib/utils';
import React from 'react';

export interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        className={cn('my-4', className)}
        ref={ref}
        {...props}
      />
    )
  }
);
