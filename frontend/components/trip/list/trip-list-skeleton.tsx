import { Skeleton } from '@/components/ui/skeleton';

export function TripListItemSkeleton() {
  return (
    <div className="flex items-center gap-3.5 rounded-md border border-border px-4 py-3.5">
      {/* Icon media */}
      <Skeleton className="size-10 shrink-0 rounded-md" />
      {/* Content */}
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3.5 w-56" />
      </div>
      {/* Chevron */}
      <Skeleton className="size-4 shrink-0 rounded" />
    </div>
  );
}

export function TripListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <TripListItemSkeleton key={i} />
      ))}
    </div>
  );
}
