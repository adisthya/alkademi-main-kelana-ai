import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TripListItemSkeleton } from '@/components/trip/list/trip-list-skeleton';

// Skeleton shown while the profile and its trips are loading — mirrors the profile page's composition
export function ProfileSkeleton() {
  return (
    <>
      {/* Identity card */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-col items-center gap-4 border-b border-dashed pb-(--card-spacing) sm:flex-row sm:items-start">
          <Skeleton className="size-20 shrink-0 rounded-full sm:size-14" />
          <div className="flex grow flex-col items-center gap-2 sm:items-start">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="size-10 shrink-0 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-28 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trips section */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-48" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <TripListItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </>
  );
}
