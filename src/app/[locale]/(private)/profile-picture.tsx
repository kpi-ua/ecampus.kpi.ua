'use client';

import { Show } from '@/components/utils/show';
import { useLocalStorage } from '@/hooks/use-storage';
import { User } from '@/types/user';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { CircleUserRound } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const ProfilePicture = () => {
  const [isClient, setIsClient] = useState(false);
  const [user] = useLocalStorage<User>('user');

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-[48px]">
      <AspectRatio ratio={1 / 1}>
        <Show when={isClient}>
          {user?.photo
            ? <Image src={user.photo} alt={user.fullName} width={48} height={48} className="rounded-full" />
            : <CircleUserRound width={48} height={48} className="text-basic-blue" strokeWidth={1} />
          }
        </Show>
      </AspectRatio>
    </div>
  );
};
