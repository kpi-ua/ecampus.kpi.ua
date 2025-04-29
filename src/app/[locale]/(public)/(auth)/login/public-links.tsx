import { PublicLink } from './public-link';
import ChatTeardropDots from '@/app/images/icons/ChatTeardropDots.svg';
import LifebuoyOutline from '@/app/images/icons/LifebuoyOutline.svg';
import QuestionOutline from '@/app/images/icons/QuestionOutline.svg';
import Student from '@/app/images/icons/Student.svg';
import TelegramOutline from '@/app/images/icons/TelegramOutline.svg';
import { getTranslations } from 'next-intl/server';

export const PublicLinks = async () => {
  const t = await getTranslations('auth.login.publicLink');

  return (
    <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3">
      <PublicLink href="/support" icon={<LifebuoyOutline />}>
        {t('support')}
      </PublicLink>
      <PublicLink href="/curator-search" icon={<Student />}>
        {t('curator-search')}
      </PublicLink>
      <PublicLink href="/suggestions" icon={<ChatTeardropDots />}>
        {t('suggestions')}
      </PublicLink>
      <PublicLink href="https://t.me/joinchat/HtJ6IROiP8Rv5BR-eZ64fw" target="_blank" icon={<TelegramOutline />}>
        {t('telegram-chat')}
      </PublicLink>
      <PublicLink href="/faq" icon={<QuestionOutline />}>
        {t('faq')}
      </PublicLink>
    </div>
  );
};
