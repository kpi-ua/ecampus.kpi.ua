'use client';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

import Autoplay from "embla-carousel-autoplay";
import Fade from 'embla-carousel-fade';
import Image from 'next/image';

const IMAGES = [
  'img1.jpg',
  'img2.jpg',
  'img3.jpg',
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
      className="flex w-[100%] h-[100%]"
    >
      <CarouselContent className="-ml-0 w-[100%] h-[100%]">
        {IMAGES.map(image => (
          <CarouselItem key={image} className="flex w-[100%] h-[100%]">
            <div  className="flex items-center justify-center overflow-hidden w-[100%] h-[100%] rounded-xl">
              <Image src={`/${image}`} alt={image} width={914} height={1280} className="object-cover shrink-0 w-[100%] h-[100%]" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
