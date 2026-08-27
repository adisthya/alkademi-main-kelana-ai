import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { SearchX } from 'lucide-react';

export function TripListEmpty() {
  return (
    <Empty className="gap-4 py-12">
      <EmptyHeader>
        <EmptyMedia variant="default">
          <SearchX className="size-10 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>Tidak Ada Hasil</EmptyTitle>
        <EmptyDescription>
          Tidak ada rencana perjalanan yang cocok dengan filter yang dipilih. Coba ubah atau hapus beberapa filter.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
