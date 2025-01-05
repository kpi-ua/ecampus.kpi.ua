'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { CircleUserRound } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

const avatarVariants = cva('rounded-full', {
  variants: {
    size: {
      xs: 'h-[28px] w-[28px]',
      sm: 'h-[36px] w-[36px]',
      base: 'h-[48px] w-[48px]',
      lg: 'h-[56px] w-[56px]',
      xl: 'h-[120px] w-[120px]',
    },
  },
  defaultVariants: {
    size: 'base',
  },
});

const iconSizeMap: Record<string, number> = {
  xs: 28,
  sm: 36,
  base: 48,
  lg: 56,
  xl: 120,
};

interface ProfilePictureProps extends VariantProps<typeof avatarVariants> {
  src: string;
}

export const ProfilePicture = ({ size = 'base', src }: ProfilePictureProps) => {
  const iconSize = iconSizeMap[size as keyof typeof iconSizeMap];

  return (
    <Avatar className={avatarVariants({ size })}>
      <AvatarImage src={src} />
      <AvatarFallback>
        <CircleUserRound width={iconSize} height={iconSize} className="text-basic-blue" strokeWidth={1} />
      </AvatarFallback>
    </Avatar>
  );
};
