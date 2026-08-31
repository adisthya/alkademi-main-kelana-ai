'use client';

import * as React from 'react';
import { HeroCarousel, heroSlides } from './hero-carousel';

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const currentLabel = heroSlides[currentIndex]?.label ?? '';

  return (
    <section className="relative h-[calc(clamp(340px,55vh,600px)+3.5rem)] w-full overflow-hidden -mt-14 xl:fixed xl:inset-0 xl:mt-0 xl:h-dvh">
      {/* Carousel fills the entire section */}
      <HeroCarousel onSlideChange={setCurrentIndex} />

      {/* Hero text + location label — all in the same positioned container */}
      <div className="absolute bottom-16 left-0 right-0 px-4 sm:px-8 md:px-12 xl:top-0 xl:bottom-0 xl:right-auto xl:flex xl:w-1/2 xl:flex-col xl:items-start xl:justify-center xl:pl-12 2xl:pl-20">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-amber-400 drop-shadow">
          AI Travel Planner
        </p>
        <h1 className="font-heading text-3xl font-semibold leading-tight text-white drop-shadow-md sm:text-4xl md:text-5xl 2xl:text-6xl">
          Rencanakan perjalanan
          <br className="hidden sm:block" /> impianmu bersama{' '}
          <span className="font-bold text-amber-400">Kelana</span>
          <span className="font-extrabold text-emerald-400"> AI</span>
        </h1>
        <p className="mt-2 max-w-lg text-sm text-white/70 drop-shadow sm:text-base">
          Ceritakan destinasi, budget, dan gaya perjalananmu — kami siapkan itinerary lengkapnya dalam
          hitungan detik.
        </p>
        {/* Location label — same container, same padding, guaranteed alignment */}
        <p className="mt-3 text-xs font-medium tracking-wide text-white/60 drop-shadow">📍 {currentLabel}</p>
      </div>
    </section>
  );
}
