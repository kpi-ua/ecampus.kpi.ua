import { cn } from '@/lib/utils';
import React from 'react'

export interface HeadingProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const Paragraph = React.forwardRef<HTMLHeadingElement, HeadingProps>(
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
