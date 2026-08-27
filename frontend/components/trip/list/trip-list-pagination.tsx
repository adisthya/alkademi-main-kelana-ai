import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TripListPaginationProps = {
  page:        number;
  totalPages:  number;
  searchParams: Record<string, string | string[] | undefined>;
};

function buildPageUrl(
  searchParams: Record<string, string | string[] | undefined>,
  page: number,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (key === 'page') continue;
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v));
    } else if (value) {
      params.set(key, value);
    }
  }

  params.set('page', String(page));
  return `/trips?${params.toString()}`;
}

export function TripListPagination({ page, totalPages, searchParams }: TripListPaginationProps) {
  if (totalPages <= 1) return null;

  const prevPage = page - 1;
  const nextPage = page + 1;
  const hasPrev  = page > 1;
  const hasNext  = page < totalPages;

  return (
    <div className="flex items-center justify-between gap-4 pt-2">
      {/* Prev */}
      {hasPrev ? (
        <Link
          href={buildPageUrl(searchParams, prevPage)}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1')}>
          <ChevronLeft className="size-4" />
          Sebelumnya
        </Link>
      ) : (
        <span className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1 cursor-not-allowed opacity-50 pointer-events-none')}>
          <ChevronLeft className="size-4" />
          Sebelumnya
        </span>
      )}

      {/* Page indicator */}
      <span className="text-sm text-muted-foreground">
        Halaman {page} dari {totalPages}
      </span>

      {/* Next */}
      {hasNext ? (
        <Link
          href={buildPageUrl(searchParams, nextPage)}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1')}>
          Selanjutnya
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1 cursor-not-allowed opacity-50 pointer-events-none')}>
          Selanjutnya
          <ChevronRight className="size-4" />
        </span>
      )}
    </div>
  );
}
