import { PublicLink } from './public-link';
import ChatTeardropDots from '../../../images/icons/ChatTeardropDots.svg';
import LifebuoyOutline from '../../../images/icons/LifebuoyOutline.svg';
import QuestionOutline from '../../../images/icons/QuestionOutline.svg';
import Student from '../../../images/icons/Student.svg';
import TelegramOutline from '../../../images/icons/TelegramOutline.svg';

export const PublicLinks = () => {
  return (
    <div className="grid grid-cols-3 gap-8 mt-8">
      <PublicLink href="/support" icon={<LifebuoyOutline />}>Підтримка користувачiв</PublicLink>
      <PublicLink href="/curator-search" icon={<Student />}>Знайти куратора групи</PublicLink>
      <PublicLink href="/complaints" icon={<ChatTeardropDots />}>Форма скарг i пропозицiй</PublicLink>
      <PublicLink href="https://t.me/joinchat/HtJ6IROiP8Rv5BR-eZ64fw" target="_blank" icon={<TelegramOutline />}>Telegram чат</PublicLink>
      <PublicLink href="/faq" icon={<QuestionOutline />}>Поширенi запитання</PublicLink>
    </div>
  );
};
