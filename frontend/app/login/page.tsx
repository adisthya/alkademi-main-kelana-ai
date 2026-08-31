import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto p-6 sm:p-0 w-full max-w-md flex items-center justify-center grow">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
}
