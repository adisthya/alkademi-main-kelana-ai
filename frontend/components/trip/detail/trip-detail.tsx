'use client';

import { Trip } from '@/services/trip.service';
import { Separator } from '@/components/ui/separator';
import { TripDetailHeader } from './trip-detail-header';
import { splitMdBlobByDay } from '@/lib/utils';
import { TripDetailCard } from './trip-detail-card';

type TripDetailProps = { trip: Trip };

export function TripDetail({ trip }: TripDetailProps) {
  const daySections = trip.ai_recommendation ? splitMdBlobByDay(trip.ai_recommendation) : [];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <TripDetailHeader trip={trip} />

      <Separator className="mb-8" />

      {/* Day cards */}
      {daySections.length === 0 ? (
        <p className="text-sm text-muted-foreground">Tidak ada rekomendasi tersedia.</p>
      ) : (
        <TripDetailCard sections={daySections} />
      )}
    </div>
  );
}
