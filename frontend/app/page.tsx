import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { UserForm } from '@/components/trip/user-form';
import { HeroSection } from '@/components/trip/hero-section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 flex-col items-center shadow-xl">
        <HeroSection />

        {/* Form card — overlaps hero with negative margin, subtle primary top accent */}
        <section className="mb-12 w-full sm:flex sm:justify-center sm:px-6">
          <Card className="relative w-full rounded-none border-t-4 border-t-amber-700 shadow-none sm:-mt-6 sm:max-w-lg sm:rounded-xl sm:shadow-lg">
            <CardHeader>
              <CardTitle>
                <h2 className="text-xl">Rencana Perjalanan</h2>
              </CardTitle>
              <CardDescription>Isi detail perjalananmu di bawah ini.</CardDescription>
            </CardHeader>
            <CardContent>
              <UserForm />
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
