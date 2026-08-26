import { getTrip } from '@/services/trip.service';
import { TripDetail } from '@/components/trip/trip-detail';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

type PageProps = { params: Promise<{ id: string }> };

// Skeleton shown while the server fetches the trip
function TripDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      {/* Back button */}
      <Skeleton className="mb-6 h-8 w-20" />

      {/* Badges */}
      <div className="mb-2 flex gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      {/* Title */}
      <Skeleton className="mb-4 h-8 w-3/4" />

      {/* Meta grid */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>

      <Skeleton className="mb-8 h-px w-full" />

      {/* Day cards */}
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-l-4 border-l-amber-500 p-6">
            <Skeleton className="mb-4 h-5 w-1/3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function TripContent({ id }: { id: string }) {
  const trip = await getTrip(Number(id));

  if (!trip?.id) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <p className="text-sm text-destructive">
          Trip tidak ditemukan atau terjadi kesalahan saat memuat data.
        </p>
      </div>
    );
  }

  return <TripDetail trip={trip} />;
}

export default async function TripPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <Suspense fallback={<TripDetailSkeleton />}>
          <TripContent id={id} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
