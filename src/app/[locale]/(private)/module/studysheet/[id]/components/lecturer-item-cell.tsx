import { ProfilePicture } from '@/components/ui/profile-picture';

interface Props {
  photo: string;
  fullName: string;
}

export function LecturerItemCell({ photo, fullName }: Props) {
  return (
    <div className="flex items-center gap-3">
      <ProfilePicture size="xs" src={photo} />
      <span className="text-basic-black text-sm font-semibold">{fullName}</span>
    </div>
  );
}
