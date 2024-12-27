'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useLocalStorage } from '@/hooks/use-storage';
import { User } from '@/types/user';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { CircleUserRound } from 'lucide-react';

type Variant = 'xs' | 'sm' | 'base' | 'lg' | 'xl';

const sizeMap = {
  xs: 'h-[28px] w-[28px]',
  sm: 'h-[36px] w-[36px]',
  base: 'h-[48px] w-[48px]',
  lg: 'h-[56px] w-[56px]',
  xl: 'h-[120px] w-[120px]',
};

const iconSizeMap = {
  xs: 28,
  sm: 36,
  base: 48,
  lg: 56,
  xl: 120,
};

interface ProfilePictureProps {
  variant?: Variant;
  src?: string;
}

export const ProfilePicture = ({ variant = 'base', src }: ProfilePictureProps) => {
  const [user] = useLocalStorage<User>('user');

  const sizeClass = sizeMap[variant];
  const iconSize = iconSizeMap[variant];

  return (
    <Avatar className={sizeClass}>
      <AvatarImage src={src || user?.photo} />
      <AvatarFallback>
        <CircleUserRound width={iconSize} height={iconSize} className="text-basic-blue" strokeWidth={1} />
      </AvatarFallback>
    </Avatar>
  );
};
