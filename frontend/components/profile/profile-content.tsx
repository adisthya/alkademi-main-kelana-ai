import { CalendarDays, Camera, Mail, MapPin, Plane, SquarePen } from 'lucide-react';
import { Avatar, AvatarBadge, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TripListItem } from '@/components/trip/list/trip-list-item';
import { Trip, LabeledOption } from '@/services/trip.service';
import { User } from '@/lib/definitiions/user';

const months: LabeledOption[] = [
  { value: 'June', label: 'Juni' },
  { value: 'December', label: 'Desember' },
];

const travelStyles: LabeledOption[] = [
  { value: 'Solo (budget)', label: 'Sendiri (hemat)' },
  { value: 'Couple (best experience)', label: 'Berpasangan (pengalaman terbaik)' },
  { value: 'Solo', label: 'Sendiri' },
];

function getInitials(fullname: string) {
  return fullname
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');
}

export async function ProfileContent() {
  // Simulate the network round-trip until real user/trip fetching is wired in
  await new Promise(resolve => setTimeout(resolve, 1500));

  const user: Pick<User, 'id' | 'fullname' | 'email'> = {
    id: 1,
    fullname: 'Anton Budiono',
    email: 'anton@budi.ono',
  };

  const myTrips: Trip[] = [
    {
      id: 4,
      destination: 'London',
      days: 7,
      currency: 'EUR',
      budget: 1000,
      category: 'Standard',
      daily_budget: 142.857142857143,
      travel_style: 'Solo (budget)',
      travel_month: 'June',
      travel_season: 'Holiday Season',
      user_id: 1,
    },
    {
      id: 3,
      destination: 'Grindelwald',
      days: 10,
      currency: 'EUR',
      budget: 5000,
      category: 'Luxury',
      daily_budget: 500,
      travel_style: 'Couple (best experience)',
      travel_month: 'June',
      travel_season: 'Holiday Season',
      user_id: 1,
    },
    {
      id: 2,
      destination: 'Sidney',
      days: 10,
      currency: 'USD',
      budget: 2000,
      category: 'Standard',
      daily_budget: 200,
      travel_style: 'Solo',
      travel_month: 'December',
      travel_season: 'Peak Season',
      user_id: 1,
    },
  ];

  const totalTrips = myTrips.length;
  const totalDays = myTrips.reduce((sum, trip) => sum + trip.days, 0);
  const totalDestinations = new Set(myTrips.map(trip => trip.destination)).size;

  return (
    <>
      {/* Identity card, styled like a travel boarding pass */}
      <Card className="relative overflow-hidden">
        <Plane className="absolute -top-4 -right-4 size-32 rotate-45 text-primary opacity-20" aria-hidden />
        <CardHeader className="flex flex-col items-center gap-4 text-center border-b border-dashed pb-(--card-spacing) sm:flex-row sm:items-start sm:text-left z-10">
          <div className="relative shrink-0">
            <Avatar className="size-20 sm:size-14">
              <AvatarFallback className="text-lg font-medium">{getInitials(user.fullname)}</AvatarFallback>
              <AvatarBadge className="size-14 me-1 mb-1">
                <Button size="icon-xs" className="rounded-full">
                  <Camera />
                </Button>
              </AvatarBadge>
            </Avatar>
          </div>
          <div className="flex flex-col gap-1 grow">
            <h2 className="font-heading text-xl font-medium">{user.fullname}</h2>
            <span className="inline-flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
              <Mail className="size-3.5 shrink-0" />
              {user.email}
            </span>
          </div>
          <Button variant="outline" size="icon-lg" className="rounded-full">
            <SquarePen data-icon="inline-start" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
              <Plane className="size-3.5 shrink-0" />
              {totalTrips} Perjalanan
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
              <CalendarDays className="size-3.5 shrink-0" />
              {totalDays} Hari
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              {totalDestinations} Destinasi
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Trips section */}
      <div className="flex flex-col gap-3">
        <h3 className="font-heading text-lg font-medium">Catatan Perjalananku</h3>
        <div className="flex flex-col gap-2">
          {myTrips.map(trip => (
            <TripListItem key={trip.id} trip={trip} months={months} travelStyles={travelStyles} />
          ))}
        </div>
      </div>
    </>
  );
}
