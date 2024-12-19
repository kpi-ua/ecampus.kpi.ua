'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useLocalStorage } from '@/hooks/use-storage';
import { User } from '@/types/user';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { CircleUserRound } from 'lucide-react';

export const ProfilePicture = () => {
  const [user] = useLocalStorage<User>('user');

  return (
    <Avatar className="h-[48px] w-[48px]">
      <AvatarImage src={user?.photo} />
      <AvatarFallback>
        <CircleUserRound width={48} height={48} className="text-basic-blue" strokeWidth={1} />
      </AvatarFallback>
    </Avatar>
  );
};
