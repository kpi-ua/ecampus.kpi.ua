'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { CircleUserRound } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

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
