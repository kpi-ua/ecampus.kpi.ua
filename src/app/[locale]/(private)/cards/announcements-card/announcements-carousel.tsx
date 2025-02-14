'use client';

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';

import Autoplay from 'embla-carousel-autoplay';
import { AnnouncementSlide } from './announcement-slide';
import { Announcement } from '@/types/announcement';
import { DotButton } from './dot-button';
import { useState } from 'react';
import { useDotButton } from './use-dot-button';
import { DefaultAnnouncementSlide } from './default-announcement-slide';
import { Show } from '@/components/utils/show';

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
      opts={{ loop: true, align: 'center' }}
      plugins={[Autoplay({ delay: AUTOPLAY_DELAY })]}
      className="w-full"
      setApi={setApi}
    >
      <CarouselContent className="-ml-4 mb-4">
        <Show when={!announcements.length}>
          <Slide>
            <DefaultAnnouncementSlide />
          </Slide>
        </Show>
        {announcements.map((announcement) => (
          <Slide key={announcement.id}>
            <AnnouncementSlide
              title={announcement.title}
              description={announcement.description}
              link={announcement.link?.uri}
              linkTitle={announcement.link?.title}
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
