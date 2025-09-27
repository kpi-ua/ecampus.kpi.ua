import { PublicLink } from './public-link';
import LifebuoyOutline from '@/app/images/icons/LifebuoyOutline.svg';
import Student from '@/app/images/icons/Student.svg';
import TelegramOutline from '@/app/images/icons/TelegramOutline.svg';
import { getTranslations } from 'next-intl/server';

export const PublicLinks = async () => {
  const t = await getTranslations('auth.login.publicLink');

  return (
    <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3">
      <PublicLink target="_blank" href={process.env.NEXT_PUBLIC_SUGGESTIONS_FORM!} icon={<LifebuoyOutline />}>
        {t('support')}
      </PublicLink>
      <PublicLink href="/curator-search" icon={<Student />}>
        {t('curator-search')}
      </PublicLink>
      <PublicLink href="https://t.me/joinchat/HtJ6IROiP8Rv5BR-eZ64fw" target="_blank" icon={<TelegramOutline />}>
        {t('telegram-chat')}
      </PublicLink>
    </div>
  );
};
