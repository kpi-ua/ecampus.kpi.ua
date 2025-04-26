import { ProfilePicture } from '@/components/ui/profile-picture';
import React from 'react';

interface Props {
  photo: string;
  fullName: string;
}

export function LecturerItemCell({ photo, fullName }: Props) {
  return (
    <div className="flex items-center gap-3">
      <ProfilePicture size="xs" src={photo} />
      <span className="text-sm font-semibold text-basic-black">{fullName}</span>
    </div>
  );
}
