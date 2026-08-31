import { Suspense } from 'react';
import { Header } from '@/components/ui/header';
import { ProfileContent } from '@/components/profile/profile-content';
import { ProfileSkeleton } from '@/components/profile/profile-skeleton';
import { Footer } from '@/components/ui/footer';

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto px-4 py-8 w-full max-w-5xl flex flex-col gap-6 grow">
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
