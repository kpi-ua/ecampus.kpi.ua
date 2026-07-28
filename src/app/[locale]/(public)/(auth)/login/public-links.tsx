import { PublicLink } from './public-link';
import LifebuoyOutline from '@/app/images/icons/LifebuoyOutline.svg';
import Student from '@/app/images/icons/Student.svg';
import { getTranslations } from 'next-intl/server';
import { Chats } from '@/app/images';

export const PublicLinks = async () => {
  const t = await getTranslations('auth.login.publicLink');

  return (
    <div className="mt-[36px] flex justify-center gap-4 sm:gap-6">
      <PublicLink target="_blank" href={process.env.NEXT_PUBLIC_SUGGESTIONS_FORM!} icon={<LifebuoyOutline />}>
        {t('support')}
      </PublicLink>
      <PublicLink href="/curator-search" icon={<Student />}>
        {t('curator-search')}
      </PublicLink>
      <PublicLink href={process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_LINK!} target="_blank" icon={<Chats />}>
        {t('chat')}
      </PublicLink>
    </div>
  );
};
