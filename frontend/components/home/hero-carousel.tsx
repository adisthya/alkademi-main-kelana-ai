'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';

export const heroSlides = [
  {
    src: '/places/bromo.jpg',
    alt: 'Mount Bromo, East Java',
    label: 'Bromo, Jawa Timur',
  },
  {
    src: '/places/borobudur.jpg',
    alt: 'Borobudur Temple, Central Java',
    label: 'Borobudur, Jawa Tengah',
  },
  {
    src: '/places/komodo.jpg',
    alt: 'Komodo Island, East Nusa Tenggara',
    label: 'Komodo, NTT',
  },
  {
    src: '/places/pura-ulun.jpg',
    alt: 'Pura Ulun Danu Batur, Bali',
    label: 'Pura Ulun Danu Batur, Bali',
  },
];

const AUTOPLAY_INTERVAL = 4000;

type HeroCarouselProps = {
  onSlideChange?: (index: number) => void;
};

export function HeroCarousel({ onSlideChange }: HeroCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  // Sync state + notify parent on slide change
  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      const index = api.selectedScrollSnap();
      setCurrent(index);
      onSlideChange?.(index);
    };
    api.on('select', onSelect);
    onSelect();
    return () => {
      api.off('select', onSelect);
    };
  }, [api, onSlideChange]);

  // Autoplay
  React.useEffect(() => {
    if (!api) return;
    const id = setInterval(() => api.scrollNext(), AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [api]);

  return (
    <div className="relative h-full w-full">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, dragFree: false }}
        className="h-full w-full **:data-[slot=carousel-content]:h-full">
        <CarouselContent className="ml-0 h-full">
          {heroSlides.map((slide, i) => (
            <CarouselItem key={i} className="relative h-full pl-0">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="100vw"
                loading="eager"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Gradient overlay — heavier at bottom-left for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/40 to-transparent" />

      {/* Dot indicators — bottom left */}
      <div
        className="absolute bottom-4 pl-4 xl:bottom-25 left-0 flex gap-1.5 sm:pl-8 md:pl-12 xl:pl-12 2xl:pl-20"
        role="tablist"
        aria-label="Carousel slides">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Pergi ke slide ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === current ? 'w-4 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/75',
            )}
          />
        ))}
      </div>
    </div>
  );
}
