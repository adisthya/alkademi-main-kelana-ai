import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Alamat email harus diisi sesuai format email yang benar.').trim(),
  password: z.string()
    .min(1, { error: 'Password harus diisi.' })
    .min(6, { error: 'Password kurang panjang.' })
    .regex(/[a-zA-Z]/, { error: 'Harus ada minimal 1 karakter huruf.' })
    .regex(/[0-9]/, { error: 'Harus ada minimal 1 karakter angka.' })
    .regex(/[^a-zA-Z0-9]/, { error: 'Harus ada minimal 1 karakter simbol.' })
    .trim()
  ,
});

export type LoginInput = z.input<typeof loginSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;

export const joinSchema = z
  .object({
    fullname: z.string().min(1, 'Nama lengkap harus diisi.').trim(),
    email: z.email('Alamat email harus diisi sesuai format email yang benar.').trim(),
    password: z.string()
      .min(1, { error: 'Password harus diisi.' })
      .min(6, { error: 'Password kurang panjang.' })
      .regex(/[a-zA-Z]/, { error: 'Harus ada minimal 1 karakter huruf.' })
      .regex(/[0-9]/, { error: 'Harus ada minimal 1 karakter angka.' })
      .regex(/[^a-zA-Z0-9]/, { error: 'Harus ada minimal 1 karakter simbol.' })
      .trim(),
    confirm_password: z.string()
      .min(1, 'Konfirmasi password harus diisi.')
      .trim(),
  })
  .refine(data => data.password === data.confirm_password, {
    error: 'Isi konfirmasi password harus sama dengan password.',
    path: ['confirm_password'],
  });

export type JoinInput = z.input<typeof joinSchema>;
export type JoinPayload = z.infer<typeof joinSchema>;


export type LoginResponse = {
  type: 'token' | 'cookie' | 'unknown'
  status: 'authenticated' | 'unauthenticated' | number;
  detail?: string;
}
