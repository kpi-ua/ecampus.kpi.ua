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
      link="#"
      linkTitle={t('link-title')}
      image="/images/Saly-10.png"
    />
  );
};
