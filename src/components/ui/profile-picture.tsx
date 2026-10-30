'use client';

import { AvatarFallback } from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import { CircleUserRound } from 'lucide-react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';

const avatarVariants = cva('rounded-full', {
  variants: {
    size: {
      xs: 'size-[28px]',
      sm: 'size-[36px]',
      base: 'size-[48px]',
      lg: 'size-[56px]',
      xl: 'size-[120px]',
    },
  },
  defaultVariants: {
    size: 'base',
  },
});

interface ProfilePictureProps extends VariantProps<typeof avatarVariants> {
  src: string;
}

export const ProfilePicture = ({ size = 'base', src }: ProfilePictureProps) => {
  return (
    <Avatar className={avatarVariants({ size })}>
      <AvatarImage src={src} />
      <AvatarFallback>
        <CircleUserRound className={`${avatarVariants({ size })} text-basic-blue`} strokeWidth={1} />
      </AvatarFallback>
    </Avatar>
  );
};
