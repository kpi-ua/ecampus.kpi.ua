import { LocaleSwitch } from '@/components/ui/locale-switch';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ProfilePicture } from './profile-picture';

export const Header = () => {
  return (
    <div className="flex items-center justify-between bg-basic-white h-[80px] px-6">
      <SidebarTrigger />
      <div className="flex items-center gap-8">
        <LocaleSwitch />
        <ProfilePicture />
      </div>
    </div>
  );
};
