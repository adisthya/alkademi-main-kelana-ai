'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TripOptions, TripSortBy } from '@/services/trip.service';
import { getCategoryStyle } from '@/lib/trip-category';
import { ButtonGroup, ButtonGroupText } from '../../ui/button-group';

type TripListFiltersProps = {
  options: TripOptions;
};

const SORT_OPTIONS: { value: TripSortBy; label: string }[] = [
  { value: 'created_at_desc', label: 'Terbaru' },
  { value: 'created_at_asc', label: 'Terlama' },
  { value: 'budget_desc', label: 'Budget Tertinggi' },
  { value: 'budget_asc', label: 'Budget Terendah' },
];

const SORT_ITEMS = SORT_OPTIONS.map(o => ({ value: o.value, label: o.label }));

export function TripListFilters({ options }: TripListFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for search input (debounced before pushing to URL)
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeSort = useMemo(
    () =>
      SORT_OPTIONS.find(item => item.value === searchParams.get('sort_by'))?.label.toLowerCase() || 'terbaru',
    [searchParams],
  );
  const filterCount = useMemo(() => {
    return [
      searchParams.has('currency'),
      searchParams.has('category'),
      searchParams.has('travel_style'),
      searchParams.has('travel_month'),
    ].filter(hasIt => hasIt).length;
  }, [searchParams]);

  // Push updated params to URL, resetting page to 1
  const pushParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('page'); // reset to page 1 on any filter change

      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  // Debounce search input — wait 400ms after user stops typing
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushParams({ search: search || undefined });
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasActiveFilters =
    searchParams.has('search') ||
    searchParams.has('currency') ||
    searchParams.has('category') ||
    searchParams.has('travel_style') ||
    searchParams.has('travel_month');

  const clearAll = () => {
    setSearch('');
    const params = new URLSearchParams();
    const sortBy = searchParams.get('sort_by');
    if (sortBy) params.set('sort_by', sortBy); // preserve sort
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Search + sort row */}
      <div className="flex gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari destinasi..."
            className="pl-8"
            aria-label="Cari destinasi"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Hapus pencarian"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter chips row */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 justify-between">
        <div className="flex flex-col justify-center sm:flex-row sm:flex-wrap gap-2 sm:justify-between flex-1 sm:grow">
          {/* Currency */}
          <Select
            value={searchParams.get('currency') ?? ''}
            onValueChange={v => pushParams({ currency: v || undefined })}>
            <SelectTrigger className="h-8 w-full sm:flex-1 sm:w-auto text-sm" aria-label="Filter mata uang">
              <SelectValue placeholder="Mata Uang" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">Semua Mata Uang</SelectItem>
                {options.currencies.map(c => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Category */}
          <Select
            value={searchParams.get('category') ?? ''}
            onValueChange={v => pushParams({ category: v || undefined })}>
            <SelectTrigger className="h-8 w-full sm:flex-1 sm:w-auto text-sm" aria-label="Filter kategori">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">Semua Kategori</SelectItem>
                {options.categories.map(c => {
                  const s = getCategoryStyle(c);
                  const Icon = s.icon;
                  return (
                    <SelectItem key={c} value={c}>
                      <span className={`inline-flex items-center gap-1.5 ${s.badgeText}`}>
                        <Icon className="size-3.5" />
                        {c}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Travel style */}
          <Select
            value={searchParams.get('travel_style') ?? ''}
            onValueChange={v => pushParams({ travel_style: v || undefined })}
            items={[{ value: '', label: 'Semua Gaya' }, ...options.travel_styles]}>
            <SelectTrigger
              className="h-8 w-full sm:flex-2 sm:w-auto text-sm"
              aria-label="Filter gaya perjalanan">
              <SelectValue placeholder="Gaya Perjalanan" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">Semua Gaya Perjalanan</SelectItem>
                {options.travel_styles.map(s => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Month */}
          <Select
            value={searchParams.get('travel_month') ?? ''}
            onValueChange={v => pushParams({ travel_month: v || undefined })}
            items={[{ value: '', label: 'Semua Bulan' }, ...options.months]}>
            <SelectTrigger className="h-8 w-full sm:flex-1 sm:w-auto text-sm" aria-label="Filter bulan">
              <SelectValue placeholder="Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">Semua Bulan</SelectItem>
                {options.months.map(m => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 sm:flex-0 items-stretch">
          {/* Sort */}
          <Select
            value={searchParams.get('sort_by') ?? 'created_at_desc'}
            onValueChange={v => pushParams({ sort_by: v || undefined })}
            items={SORT_ITEMS}>
            <SelectTrigger className="h-8 w-full min-w-40 text-sm" aria-label="Urutkan">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SORT_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex w-full flex-row sm:flex-wrap gap-2 justify-end">
        {hasActiveFilters && (
          <ButtonGroup className="">
            <Button
              type="button"
              variant="outline"
              onClick={clearAll}
              title="Klik untuk reset filter"
              className="h-8 gap-1 px-2 text-sm text-muted-foreground hover:text-destructive">
              <X className="size-3.5" />
            </Button>
            <ButtonGroupText>{filterCount} filter aktif</ButtonGroupText>
          </ButtonGroup>
        )}
        <ButtonGroup>
          <ButtonGroupText className="h-8">Diurutkan: data {activeSort}</ButtonGroupText>
        </ButtonGroup>
      </div>
    </div>
  );
}
