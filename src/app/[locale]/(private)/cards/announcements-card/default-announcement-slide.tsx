import { useTranslations } from 'next-intl';
import { AnnouncementSlide } from './announcement-slide';

export const DefaultAnnouncementSlide = () => {
  const t = useTranslations('private.main.cards.carousel.default-slide');

  const title = t.rich('title-base', {
    systemname: () => <span className="text-brand-700">«{t('title-system-name')}»</span>,
  });

  return (
    <AnnouncementSlide
      title={title}
      description={t('description')}
      linkTitle=""
      image="https://do4rt9wur3t6m.cloudfront.net/welcome-to-campus.png"
    />
  );
};
