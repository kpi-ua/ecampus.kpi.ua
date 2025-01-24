'use client';

import Link from 'next/link';
import { Heading3 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Show } from '@/components/utils/show';

interface AnnouncementCardProps {
  title: React.ReactNode;
  description: React.ReactNode;
  link?: string;
  image?: string;
}

export const AnnouncementCard = ({ title, description, link, image }: AnnouncementCardProps) => {
  return (
    <div className="flex gap-8">
      <div className="grow">
        <Heading3>{title}</Heading3>
        <Paragraph>{description}</Paragraph>
        {link && (
          <Button variant="secondary" asChild>
            <Link href={link} target="_blank" rel="noopener noreferrer">
              Перейти до разкладу
            </Link>
          </Button>
        )}
      </div>
      <div className="flex min-w-[400px]">
        <AspectRatio ratio={4 / 3.5}>
          <Show when={!!image}>
            <img src={image!} alt={title as string} className="h-full w-full rounded-md object-cover" />
          </Show>
        </AspectRatio>
      </div>
    </div>
  );
};
