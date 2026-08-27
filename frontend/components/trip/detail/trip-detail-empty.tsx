import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { buttonVariants } from '@/components/ui/button';
import { ShipWheelIcon } from 'lucide-react';
import Link from 'next/link';

export function TripDetailEmpty() {
  return (
    <div className="mx-auto w-fit border rounded-xl border-amber-500">
      <Empty className="gap-5">
        <EmptyHeader>
          <EmptyMedia variant="default">
            <ShipWheelIcon className="text-amber-500 size-10" />
          </EmptyMedia>
          <EmptyTitle>Tidak Ada Data Rencana Perjalanan</EmptyTitle>
          <EmptyDescription>
            Data rencana perjalanan tidak ditemukan atau telah terjadi kesalahan pemuatan data.
          </EmptyDescription>
        </EmptyHeader>
        <Link href="/" className={buttonVariants({ variant: 'default' })}>
          Kembali
        </Link>
      </Empty>
    </div>
  );
}
