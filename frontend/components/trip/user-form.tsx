'use client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '../ui/field';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { generateTrip, getOptions, TripOptions, TripPayload } from '@/services/trip.service';
import { Navigation } from 'lucide-react';

const requiredNumber = (requiredMessage: string, positiveMessage: string) =>
  z.preprocess(
    value => (value === '' || value === null ? undefined : value),
    z.coerce.number(requiredMessage).gt(0, positiveMessage),
  );

const schema = z.object({
  id: z.number().optional(),
  destination: z.string().min(1, 'Kota tujuan harus diisi.'),
  currency: z
    .string()
    .min(1, 'Mata uang harus diisi.')
    .max(3, 'Kode mata uang maksimal 3 huruf.')
    .toUpperCase(),
  budget: requiredNumber('Budget perjalanan harus diisi', 'Budget perjalanan harus di atas 0.'),
  days: requiredNumber('Durasi perjalanan harus diisi.', 'Durasi perjalanan harus di atas 0.'),
  travel_style: z.string().min(1, 'Gaya perjalanan harus diisi.'),
  travel_month: z.string().min(1, 'Waktu perjalanan harus diisi.'),
});

export function UserForm() {
  const router = useRouter();
  const [options, setOptions] = useState<TripOptions | null>(null);

  useEffect(() => {
    getOptions().then(setOptions);
  }, []);

  const form = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      destination: '',
      currency: '',
      budget: '',
      days: '',
      travel_style: '',
      travel_month: '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: TripPayload) => {
    try {
      const trip = await generateTrip(data);
      if (!trip?.id) {
        const message = trip?.detail ?? trip?.message ?? 'Terjadi kesalahan. Silakan coba lagi.';
        form.setError('root', { message });
        return;
      }
      router.push(`/trips/${trip.id}`);
    } catch {
      form.setError('root', { message: 'Gagal terhubung ke server. Periksa koneksimu dan coba lagi.' });
    }
  };

  return (
    <div className="relative">
      {/* Spinner overlay — covers inputs while submitting */}
      {isSubmitting && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-md bg-background/80 backdrop-blur-sm">
          <Spinner className="size-8 text-primary" />
          <p className="text-sm text-muted-foreground">Sedang membuat itinerary...</p>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="flex flex-col gap-5">
          <Controller
            name="destination"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel id={field.name}>Destinasi</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Kemana tujuanmu?"
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="currency"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel id={field.name}>Mata Uang</FieldLabel>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  id={field.name}
                  disabled={isSubmitting || !options}>
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Pilih mata uang" />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger>
                    <SelectGroup>
                      {(options?.currencies ?? []).map(value => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="budget"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel id={field.name}>Estimasi Budget</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="number"
                  value={(field.value as string | number | undefined) ?? ''}
                  placeholder="Berapa estimasi budget-nya?"
                  disabled={isSubmitting}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="days"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel id={field.name}>Durasi Perjalanan</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="number"
                  value={(field.value as string | number | undefined) ?? ''}
                  placeholder="Berapa hari perjalananmu?"
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="travel_style"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel id={field.name}>Gaya Perjalanan</FieldLabel>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  id={field.name}
                  disabled={isSubmitting || !options}
                  items={options?.travel_styles}>
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Pilih gaya perjalanan" />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger>
                    <SelectGroup>
                      {(options?.travel_styles ?? []).map(style => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="travel_month"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel id={field.name}>Waktu Perjalanan (Bulan)</FieldLabel>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  id={field.name}
                  disabled={isSubmitting || !options}
                  items={options?.months}>
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Pilih bulan" />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger>
                    <SelectGroup>
                      {(options?.months ?? []).map(month => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <FieldSeparator />

          {/* Root / server error */}
          {form.formState.errors.root && (
            <div
              role="alert"
              className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}

          <div className="flex flex-row gap-2 w-full justify-end">
            <Button type="submit" disabled={isSubmitting} className="w-24">
              Mulai <Navigation data-icon="inline-end" />
            </Button>
            <Button type="reset" variant="outline" disabled={isSubmitting} onClick={() => form.reset()}>
              Ulangi
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
