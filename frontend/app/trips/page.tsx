import { Suspense } from 'react';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { getTrips, getOptions, TripListParams, TripSortBy } from '@/services/trip.service';
import { TripList } from '@/components/trip/list/trip-list';
import { TripListEmpty } from '@/components/trip/list/trip-list-empty';
import { TripListSkeleton } from '@/components/trip/list/trip-list-skeleton';
import { TripListFilters } from '@/components/trip/list/trip-list-filters';
import { TripListPagination } from '@/components/trip/list/trip-list-pagination';
import { Separator } from '@/components/ui/separator';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const VALID_SORT: TripSortBy[] = ['created_at_desc', 'created_at_asc', 'budget_desc', 'budget_asc'];

function getString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value || undefined;
}

async function TripListContent({
  params,
  rawSearchParams,
}: {
  params: TripListParams;
  rawSearchParams: Record<string, string | string[] | undefined>;
}) {
  const [result, options] = await Promise.all([getTrips(params), getOptions()]);

  if (!result?.data?.length) {
    return <TripListEmpty />;
  }

  return (
    <div className="flex flex-col gap-6">
      <TripList result={result} months={options.months} travelStyles={options.travel_styles} />
      <TripListPagination page={result.page} totalPages={result.total_pages} searchParams={rawSearchParams} />
    </div>
  );
}

export default async function TripsPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const page = Math.max(1, Number(getString(raw.page) ?? '1') || 1);
  const sortRaw = getString(raw.sort_by);
  const sortBy = VALID_SORT.includes(sortRaw as TripSortBy) ? (sortRaw as TripSortBy) : 'created_at_desc';

  const params: TripListParams = {
    search: getString(raw.search),
    currency: getString(raw.currency),
    category: getString(raw.category),
    travel_style: getString(raw.travel_style),
    travel_month: getString(raw.travel_month),
    sort_by: sortBy,
    page,
    page_size: 10,
  };

  // Fetch options separately for filters (server-side)
  const options = await getOptions();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Catatan Perjalanan
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Semua rencana perjalanan yang telah dibuat.</p>
          </div>

          {/* Filters — client component */}
          <div className="mb-3">
            <TripListFilters options={options} />
          </div>

          <Separator className="mb-8" />

          {/* List — server fetched, wrapped in Suspense */}
          <Suspense fallback={<TripListSkeleton />}>
            <TripListContent params={params} rawSearchParams={raw} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
