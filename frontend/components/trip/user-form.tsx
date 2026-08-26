'use client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '../ui/field';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { generateTrip, TripPayload } from '@/services/trip.service';

const requiredNumber = (requiredMessage: string, positiveMessage: string) =>
  z.preprocess(
    value => (value === '' || value === null ? undefined : value),
    z.coerce.number(requiredMessage).gt(0, positiveMessage),
  );

const schema = z.object({
  id: z.number().optional(),
  destination: z.string().min(1, 'Kota tujuan harus diisi.'),
  currency: z.string().min(1, 'Mata uang harus diisi.').max(3, 'Kode mata uang maksimal 3 huruf.').toUpperCase(),
  budget: requiredNumber('Budget perjalanan harus diisi', 'Budget perjalanan harus di atas 0.'),
  days: requiredNumber('Durasi perjalanan harus diisi.', 'Durasi perjalanan harus di atas 0.'),
  travel_style: z.string().min(1, 'Gaya perjalanan harus diisi.'),
  travel_month: z.string().min(1, 'Waktu perjalanan harus diisi.'),
});

export function UserForm() {
  const router = useRouter();
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

  const currencies = ['EUR', 'IDR', 'USD', 'JPY', 'SGD', 'RUB'].sort();
  const travelStyle = [
    'Sendiri',
    'Sendiri (paling hemat)',
    'Sendiri (pengalaman terbaik)',
    'Bersama pasangan',
    'Bersama pasangan (paling hemat)',
    'Bersama pasangan (pengalaman terbaik)',
    'Keluarga',
    'Keluarga (paling hemat)',
    'Keluarga (pengalaman terbaik)',
    'Beri aku rekomendasi yang unik!',
  ];
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

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
                <FieldLabel id={field.name}>Destinasi Tujuan</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Mau jalan-jalan kemana kita?"
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
                <Select {...field} onValueChange={field.onChange} id={field.name} disabled={isSubmitting}>
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Pilih mata uang" />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger>
                    <SelectGroup>
                      {currencies.map((value, index) => (
                        <SelectItem key={index} value={value}>
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
                  placeholder="Mau berapa lama jalan-jalannya?"
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
                <Select {...field} onValueChange={field.onChange} id={field.name} disabled={isSubmitting}>
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Pilih gaya perjalanan" />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger>
                    <SelectGroup>
                      {travelStyle.map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {item}
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
                <Select {...field} onValueChange={field.onChange} id={field.name} disabled={isSubmitting}>
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Pilih bulan" />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger>
                    <SelectGroup>
                      {months.map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {item}
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
            <div role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}

          <div className="flex flex-row gap-2 w-full justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner className="size-4" /> : 'Generate'}
            </Button>
            <Button
              type="reset"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => form.reset()}>
              Reset
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
