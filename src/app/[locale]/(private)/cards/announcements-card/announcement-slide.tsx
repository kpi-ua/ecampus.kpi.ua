'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Heading3 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnnouncementSlideProps {
  title: React.ReactNode;
  description: React.ReactNode;
  link?: string;
  linkTitle?: string;
  image?: string;
}

export const AnnouncementSlide = ({ title, description, link, linkTitle, image }: AnnouncementSlideProps) => {
  const t = useTranslations('private.main.cards.carousel');

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="mb-4 max-w-full grow overflow-y-hidden">
        <Heading3>{title}</Heading3>
        <Paragraph
          className={cn('mb-0 grow', {
            'line-clamp-6 lg:line-clamp-6 xl:line-clamp-8': !!link,
            'line-clamp-8 lg:line-clamp-7 xl:line-clamp-9': !link,
          })}
        >
          {description}
        </Paragraph>
        {link && (
          <Button variant="secondary" className="mt-4" asChild>
            <Link href={link} target="_blank" rel="noopener noreferrer">
              {linkTitle || t('default-link-title')}
            </Link>
          </Button>
        )}
      </div>
      <div className={cn('hidden min-w-[300px] basis-[300px] lg:block xl:min-w-[400px] xl:basis-[400px]')}>
        <AspectRatio ratio={4 / 3.5}>
          {image && <img src={image} alt={title as string} className="h-full w-full rounded-md object-cover" />}
        </AspectRatio>
      </div>
    </div>
  );
};
