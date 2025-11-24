'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import Image from 'next/image';
import Link from 'next/link';

const CAROUSEL_CDN_BASE_URL = 'https://do4rt9wur3t6m.cloudfront.net/ecampus.kpi.ua/carousel';

type CarouselImage = {
  src: string;
  description: string;
  credits: string;
  creditsUrl?: string;
};

const IMAGES: CarouselImage[] = [
  {
    src: 'img1.jpg',
    description: 'Корпус № 1 КПІ ім. Ігоря Сікорського',
    credits: '@kpi_look',
    creditsUrl: 'https://www.instagram.com/kpi_look',
  },
  {
    src: 'img2.jpg',
    description: 'Корпус № 20 КПІ ім. Ігоря Сікорського',
    credits: '@kpi_look',
    creditsUrl: 'https://www.instagram.com/kpi_look',
  },
  {
    src: 'img3.jpg',
    description: 'Науково-технічна бібліотека ім. Г. І. Денисенка КПІ ім. Ігоря Сікорського',
    credits: '@kpi_look',
    creditsUrl: 'https://www.instagram.com/kpi_look',
  },
  {
    src: 'img4.jpg',
    description: 'Науково-технічна бібліотека ім. Г. І. Денисенка КПІ ім. Ігоря Сікорського',
    credits: '@kpi_look',
    creditsUrl: 'https://www.instagram.com/kpi_look',
  },
  {
    src: 'img5.jpg',
    description: 'Корпус № 1 КПІ ім. Ігоря Сікорського',
    credits: '@kpi_look',
    creditsUrl: 'https://www.instagram.com/kpi_look',
  },
  {
    src: 'img6.jpg',
    description: 'Науково-технічна бібліотека ім. Г. І. Денисенка КПІ ім. Ігоря Сікорського',
    credits: '@kpi_look',
    creditsUrl: 'https://www.instagram.com/kpi_look',
  },
  {
    src: 'img7.jpg',
    description: 'Корпус № 1 КПІ ім. Ігоря Сікорського',
    credits: '@kpi_look',
    creditsUrl: 'https://www.instagram.com/kpi_look',
  },
  {
    src: 'img8.jpg',
    description: 'Науково-технічна бібліотека ім. Г. І. Денисенка КПІ ім. Ігоря Сікорського',
    credits: '@kpi_look',
    creditsUrl: 'https://www.instagram.com/kpi_look',
  },
  {
    src: 'img9.jpg',
    description: 'Центр студентського харчування',
    credits: '@kpi_look',
    creditsUrl: 'https://www.instagram.com/kpi_look',
  },
  {
    src: 'img10.jpg',
    description: 'Корпус № 1 КПІ ім. Ігоря Сікорського',
    credits: '@kpi_look',
    creditsUrl: 'https://www.instagram.com/kpi_look',
  },
];

export const LoginCarousel = () => {
  return (
    <Carousel
      opts={{
        loop: true,
        align: 'center',
        duration: 50,
      }}
      plugins={[
        Autoplay({
          delay: 10000,
        }),
        Fade(),
      ]}
      className="relative flex h-full w-full"
    >
      <CarouselContent className="-ml-0 h-full w-full">
        {IMAGES.map((image) => (
          <CarouselItem key={image.src} className="relative flex h-full w-full">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl">
              <Image
                src={`${CAROUSEL_CDN_BASE_URL}/${image.src}`}
                alt={image.description}
                width={914}
                height={1280}
                quality={100}
                className="h-[calc(100dvh-40px)] w-full shrink-0 object-cover"
              />
              <div className="from-basic-black/80 to-basic-black/0 text-basic-white absolute bottom-0 left-0 w-full rounded-b-xl bg-linear-to-t from-10% px-14 pt-32 pb-14">
                <h6>{image.description}</h6>
                <span>
                  by{' '}
                  {image.creditsUrl ? (
                    <Link className="text-basic-white" href={image.creditsUrl} target="_blank">
                      {image.credits}
                    </Link>
                  ) : (
                    image.credits
                  )}
                </span>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute right-0 bottom-0 flex justify-between p-14">
        <CarouselPrevious className="static mr-4 translate-y-0" />
        <CarouselNext className="static translate-y-0" />
      </div>
    </Carousel>
  );
};
