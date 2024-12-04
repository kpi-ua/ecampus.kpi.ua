'use client';

import { useLocalStorage } from '@/hooks/useStorage';
import { User } from '@/types/user';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { CircleUserRound } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ProfilePicture = () => {
  const [isClient, setIsClient] = useState(false);
  const [user] = useLocalStorage<User>('user');

  useEffect(() => {
    setIsClient(true);
  }, [])

  if (!isClient) {
    return null;
  }

  return (
    <div className="w-[48px]">
      <AspectRatio ratio={1 / 1}>
        {user?.photo
          ? <img src={user.photo} alt={user.fullName} className="rounded-full" />
          : <CircleUserRound width={48} height={48} className="text-basic-blue" strokeWidth={1} />
        }
      </AspectRatio>
    </div>
  );
};
