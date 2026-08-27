import { Suspense } from 'react';
import { getTrip } from '@/services/trip.service';
import { TripDetail } from '@/components/trip/detail/trip-detail';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { TripDetailSkeleton } from '@/components/trip/detail/trip-detail-skeleton';
import { TripDetailEmpty } from '@/components/trip/detail/trip-detail-empty';

type PageProps = { params: Promise<{ id: string }> };

async function TripContent({ id }: { id: string }) {
  const trip = await getTrip(Number(id));

  if (!trip?.id) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <TripDetailEmpty />
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
