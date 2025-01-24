'use client';

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';

import Autoplay from 'embla-carousel-autoplay';
import { AnnouncementCard } from './announcement-card';
import { Announcement } from '@/types/announcement';
import { DotButton } from './dot-button';
import { useState } from 'react';
import { useDotButton } from './use-dot-button';
import { DefaultAnnouncement } from './default-announcement';

const AUTOPLAY_DELAY = 10_000; // 10 seconds

interface AnnouncementsCarouselProps {
  announcements: Announcement[];
}

const Slide = ({ children }: { children: React.ReactNode }) => <CarouselItem className="pl-4">{children}</CarouselItem>;

export const AnnouncementsCarousel = ({ announcements }: AnnouncementsCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(api);

  return (
    <Carousel
      opts={{ loop: true, align: 'center', watchDrag: false }}
      plugins={[Autoplay({ delay: AUTOPLAY_DELAY })]}
      className="w-full"
      setApi={setApi}
    >
      <CarouselContent className="-ml-4">
        <Slide>
          <DefaultAnnouncement key={-1} />
        </Slide>
        {announcements.map((announcement) => (
          <Slide key={announcement.id}>
            <AnnouncementCard
              title={announcement.title}
              description={announcement.description}
              link={announcement.link}
              image={announcement.image}
            />
          </Slide>
        ))}
      </CarouselContent>
      <div className="absolute -bottom-4 -left-4 flex gap-[8px]">
        {scrollSnaps.map((_, index) => (
          <DotButton key={index} onClick={() => onDotButtonClick(index)} selected={selectedIndex === index} />
        ))}
      </div>
    </Carousel>
  );
};
