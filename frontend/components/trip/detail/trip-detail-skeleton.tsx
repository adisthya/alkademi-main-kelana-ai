import { Skeleton } from '../../ui/skeleton';
import { Separator } from '../../ui/separator';

// Skeleton shown while the server fetches the trip — mirrors TripDetailHeader's composition
export function TripDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      {/* Header: back button + title + meta info, matching TripDetailHeader */}
      <div className="mb-8 flex items-start gap-4">
        <Skeleton className="size-7 shrink-0 rounded-md mt-0.5 sm:mt-1" />
        <div className="flex flex-col gap-2 w-full">
          <Skeleton className="h-8 w-1/3 sm:h-9" />
          <div className="mt-2 flex flex-col gap-y-2 sm:flex-row sm:flex-wrap sm:gap-x-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <Skeleton className="size-4 shrink-0 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Day cards */}
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
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
