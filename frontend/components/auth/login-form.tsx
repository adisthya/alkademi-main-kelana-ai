'use client';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AlertCircleIcon, Eye, EyeClosed, LockOpen, MailBadge, UserShield } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KelanaAiText } from '@/components/ui/kelana-ai';
import { Field, FieldGroup, FieldError } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Button, buttonVariants } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoginInput, LoginPayload, LoginResponse, loginSchema } from '@/lib/definitiions/auth';
import { postLogin } from '@/services/auth.service';
import { redirect, RedirectType, useSearchParams } from 'next/navigation';

const defaultValues: LoginPayload = {
  email: '',
  password: '',
};

export function LoginForm() {
  const params = useSearchParams();
  const from = params.get('from') || '/profile';

  const form = useForm<LoginInput, unknown, LoginPayload>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues,
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const isSubmitting = useMemo(() => form.formState.isSubmitting, [form.formState]);
  const onSubmit = async (data: LoginPayload) => {
    try {
      const res: LoginResponse = await postLogin(data);

      console.log('res:', res);

      if (res?.status !== 'authenticated') {
        const message = res?.detail ?? `Gagal mengautentikasi akunmu..`;
        form.setError('root', { message });
        return;
      }
    } catch {
      form.setError('root', { message: 'Gagal terhubung ke server. Periksa koneksimu dan coba lagi.' });
      return;
    }

    redirect(from, RedirectType.push);
  };

  return (
    <Card className="grow">
      <CardHeader>
        <CardTitle>
          <h2 className="text-xl flex flex-col gap-2 items-center justify-center">
            <UserShield className="size-12" />
            <span>
              Masuk <KelanaAiText />
            </span>
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Root / server error */}
          {form.formState.errors.root && (
            <Alert variant="destructive" className="max-w-md">
              <AlertCircleIcon />
              <AlertTitle>Galat!</AlertTitle>
              <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
            </Alert>
          )}
          <FieldGroup className="flex flex-col gap-4">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      disabled={isSubmitting}
                      aria-invalid={fieldState.invalid}
                      placeholder="Ketikkan email-mu"
                      autoComplete="off"
                      tabIndex={1}
                    />
                    <InputGroupAddon>
                      <MailBadge />
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <FieldGroup className="flex flex-col gap-4">
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      disabled={isSubmitting}
                      type={showPassword ? 'text' : 'password'}
                      aria-invalid={fieldState.invalid}
                      placeholder="Ketikkan kata sandimu"
                      autoComplete="off"
                      tabIndex={2}
                    />
                    <InputGroupAddon>
                      <LockOpen />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePasswordVisibility}
                        tabIndex={4}
                        title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                        aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}>
                        {showPassword && <EyeClosed />}
                        {!showPassword && <Eye />}
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <Button type="submit" variant="default" className="w-full" disabled={isSubmitting} tabIndex={3}>
              {isSubmitting && <Spinner data-icon="inline-start" />}
              Masuk
            </Button>
          </FieldGroup>
        </form>
        <div className="relative flex py-2 items-center">
          <div className="grow border-t border-2"></div>
          <span className="shrink mx-4">atau</span>
          <div className="grow border-t border-2"></div>
        </div>
        <Link
          href="/join"
          aria-label="Bergabung dengan KelanaAI!"
          tabIndex={5}
          className={cn(buttonVariants({ variant: 'outline' }), 'transition-opacity hover:opacity-70')}>
          Buat Akun Baru
        </Link>
      </CardContent>
    </Card>
  );
}
