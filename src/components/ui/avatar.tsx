'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { cn } from '@/lib/utils';

const Avatar = ({ className, ref, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
    {...props}
  />
);
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = ({ className, ref, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) => (
  <AvatarPrimitive.Image ref={ref} className={cn('aspect-square h-full w-full', className)} {...props} />
);
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = ({ className, ref, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-[#D3E1F0] text-xl font-semibold text-[#3C88CE]',
      className,
    )}
    {...props}
  />
);
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
