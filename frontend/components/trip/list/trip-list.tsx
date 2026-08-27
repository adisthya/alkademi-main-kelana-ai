import { ItemGroup } from '@/components/ui/item';
import { Trip, TripListResponse } from '@/services/trip.service';
import { TripListItem } from './trip-list-item';
import type { LabeledOption } from '@/services/trip.service';

type TripListProps = {
  result:       TripListResponse;
  months:       LabeledOption[];
  travelStyles: LabeledOption[];
};

export function TripList({ result, months, travelStyles }: TripListProps) {
  return (
    <ItemGroup>
      {result.data.map(trip => (
        <TripListItem
          key={trip.id}
          trip={trip}
          months={months}
          travelStyles={travelStyles}
        />
      ))}
    </ItemGroup>
  );
}
