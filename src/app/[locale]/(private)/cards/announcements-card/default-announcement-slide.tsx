import { useTranslations } from 'next-intl';
import { AnnouncementSlide } from './announcement-slide';
import RichText from '@/components/typography/rich-text';

export const DefaultAnnouncementSlide = () => {
  const t = useTranslations('private.main.cards.carousel.default-slide');

  const title = (
    <RichText>
      {(tags) =>
        t.rich('title-base', {
          ...tags,
          systemname: () => <span className="text-brand-700">«{t('title-system-name')}»</span>,
        })
      }
    </RichText>
  );

  return (
    <AnnouncementSlide
      title={title}
      description={t('description')}
      image="https://do4rt9wur3t6m.cloudfront.net/welcome-to-campus.png"
    />
  );
};
