import Link from 'next/link';
import { ChevronRight, CalendarDays, Wallet } from 'lucide-react';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Trip } from '@/services/trip.service';
import { getCategoryStyle } from '@/lib/trip-category';
import { buildLabelLookup } from '@/lib/trip-options';
import { formatCurrency } from '@/lib/utils';
import type { LabeledOption } from '@/services/trip.service';

type TripListItemProps = {
  trip: Trip;
  months: LabeledOption[];
  travelStyles: LabeledOption[];
};

export function TripListItem({ trip, months, travelStyles }: TripListItemProps) {
  const style = getCategoryStyle(trip.category);
  const Icon = style.icon;
  const getMonth = buildLabelLookup(months);
  const getStyle = buildLabelLookup(travelStyles);

  return (
    <Item
      variant="outline"
      className="shadow"
      render={
        <Link href={`/trips/${trip.id}`} aria-label={`Lihat rencana perjalanan ke ${trip.destination}`} />
      }>
      {/* Category icon */}
      <ItemMedia variant="icon" className={`size-10 shrink-0 rounded-md ${style.bgClass}`}>
        <Icon className={`size-5 ${style.iconClass}`} />
      </ItemMedia>

      {/* Main content */}
      <ItemContent>
        <ItemTitle>
          {trip.destination}
          {/* Category badge */}
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${style.badgeBg} ${style.badgeText}`}>
            {trip.category}
          </span>
        </ItemTitle>
        <ItemDescription>
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-3.5 shrink-0" />
              {trip.days} Hari · {getMonth(trip.travel_month)}
            </span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Wallet className="size-3.5 shrink-0" />
              {formatCurrency(trip.budget, trip.currency)}
            </span>
            <span aria-hidden>·</span>
            <span>{getStyle(trip.travel_style)}</span>
          </span>
        </ItemDescription>
      </ItemContent>

      {/* Chevron */}
      <ItemActions>
        <ChevronRight className="size-4 text-muted-foreground" />
      </ItemActions>
    </Item>
  );
}
