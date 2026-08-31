import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { UserForm } from '@/components/trip/user-form';
import { HeroSection } from '@/components/home/hero-section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 flex-col items-center shadow-xl">
        <HeroSection />

        {/* Form card — fixed to the right half of the viewport on desktop, vertically centered */}
        <section className="mb-12 w-full xl:fixed xl:inset-y-0 xl:right-0 xl:z-10 xl:mb-0 xl:flex xl:w-1/2 xl:items-center xl:justify-center xl:px-6 2xl:px-10">
          <Card className="relative w-full rounded-none border-t-4 border-t-amber-700 shadow-none xl:max-w-sm xl:rounded-xl xl:shadow-2xl 2xl:max-w-md xl:border xl:border-black/10 xl:bg-white/70 xl:ring-1 xl:ring-black/10 xl:backdrop-blur-md xl:backdrop-saturate-150 dark:xl:border-white/10 dark:xl:bg-card/60 dark:xl:ring-white/10">
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
