import { Trip } from '@/services/trip.service';
import { SquareChevronLeft, CalendarDays, Wallet, Leaf, Luggage, Receipt } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

type TripDetailHeaderProps = {
  trip: Trip;
};
export function TripDetailHeader({ trip }: TripDetailHeaderProps) {
  return (
    <div className="mb-8 flex items-start gap-4">
      <Link
        href="/trips"
        aria-label="Kembali ke Beranda"
        className="shrink-0 mt-0.5 sm:mt-1 text-muted-foreground transition-colors hover:text-amber-700 dark:hover:text-amber-500">
        <SquareChevronLeft className="size-7" />
      </Link>
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{trip.destination}</h1>
        {/* Meta info — sits directly under the title */}
        <div className="mt-2 flex flex-col gap-y-1.5 sm:flex-row sm:flex-wrap sm:gap-x-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarDays className="size-4 shrink-0 text-amber-500" />
            <span>
              {trip.days} Hari · {trip.travel_month}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Wallet className="size-4 shrink-0 text-amber-500" />
            <span>{formatCurrency(trip.budget, trip.currency)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Luggage className="size-4 shrink-0 text-amber-500" />
            <span>{trip.travel_style}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Receipt className="size-4 shrink-0 text-amber-500" />
            <span>{trip.category}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Leaf className="size-4 shrink-0 text-amber-500" />
            <span>{trip.travel_season}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
