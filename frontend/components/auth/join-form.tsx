'use client';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  AlertCircleIcon,
  CircleUserRound,
  Eye,
  EyeClosed,
  KeyRound,
  LockKeyholeOpen,
  MailBadge,
  UserStar,
} from 'lucide-react';
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
import { JoinInput, JoinPayload, joinSchema } from '@/lib/definitiions/auth';
import { postJoinUser } from '@/services/auth.service';
import { redirect, RedirectType } from 'next/navigation';

const defaultValues: JoinPayload = {
  fullname: '',
  email: '',
  password: '',
  confirm_password: '',
};

export function JoinForm() {
  const form = useForm<JoinInput, unknown, JoinPayload>({
    resolver: zodResolver(joinSchema),
    mode: 'onTouched',
    defaultValues,
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  const { isSubmitting } = form.formState;
  const onSubmit = async (data: JoinPayload) => {
    try {
      const user = await postJoinUser(data);

      if (!user?.id) {
        const message = user?.detail ?? user?.message ?? `Gagal mendaftarkan akunmu, silakan coba lagi.`;
        form.setError('root', { message });
      } else {
        redirect('/profile', RedirectType.push);
      }
    } catch {
      form.setError('root', { message: 'Gagal terhubung ke server. Periksa koneksimu dan coba lagi.' });
    }
  };

  return (
    <Card className="grow">
      <CardHeader>
        <CardTitle>
          <h2 className="text-xl flex flex-col gap-2 items-center justify-center">
            <UserStar className="size-12" />
            <span>
              Buat Akun <KelanaAiText />
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
              name="fullname"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      disabled={isSubmitting}
                      aria-invalid={fieldState.invalid}
                      placeholder="Siapa namamu?"
                      autoComplete="off"
                      tabIndex={1}
                    />
                    <InputGroupAddon>
                      <CircleUserRound />
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
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
                      placeholder="Apa alamat email-mu?"
                      autoComplete="off"
                      tabIndex={2}
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
                      tabIndex={3}
                    />
                    <InputGroupAddon>
                      <KeyRound />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePasswordVisibility}
                        disabled={isSubmitting}
                        tabIndex={7}
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
          <FieldGroup className="flex flex-col gap-4">
            <Controller
              name="confirm_password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      disabled={isSubmitting}
                      type={showConfirmPassword ? 'text' : 'password'}
                      aria-invalid={fieldState.invalid}
                      placeholder="Ketikkan ulang kata sandimu"
                      autoComplete="off"
                      tabIndex={4}
                    />
                    <InputGroupAddon>
                      <LockKeyholeOpen />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isSubmitting}
                        onClick={toggleConfirmPasswordVisibility}
                        tabIndex={8}
                        title={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                        aria-label={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}>
                        {showConfirmPassword && <EyeClosed />}
                        {!showConfirmPassword && <Eye />}
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <Button type="submit" variant="default" className="w-full" disabled={isSubmitting} tabIndex={5}>
              {isSubmitting && <Spinner data-icon="inline-start" />}
              Daftar
            </Button>
          </FieldGroup>
        </form>
        <div className="relative flex py-2 items-center">
          <div className="grow border-t border-2"></div>
          <span className="shrink mx-4">atau</span>
          <div className="grow border-t border-2"></div>
        </div>
        <Link
          href="/login"
          aria-label="Masuk akun Kelana AI!"
          tabIndex={6}
          className={cn(buttonVariants({ variant: 'outline' }), 'transition-opacity hover:opacity-70')}>
          Sudah Punya Akun
        </Link>
      </CardContent>
    </Card>
  );
}
