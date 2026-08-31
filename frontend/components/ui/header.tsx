import { cookies } from 'next/headers';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { KelanaAiLogo, KelanaAiText } from './kelana-ai';
import { NavLink, NavLinkItem } from './nav-link';
import { HeaderDrawer } from './header-drawer';

const navLinks: NavLinkItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Trips', href: '/trips' },
];

export async function Header() {
  const cookieStore = await cookies();
  const isAuthenticated = !!cookieStore.get('access_token')?.value;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-heading font-semibold text-xl">
          <KelanaAiLogo />
          <h1>
            <KelanaAiText />
          </h1>
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <nav className="hidden items-center gap-4 md:flex">
          {navLinks.map(link => (
            <NavLink key={link.href} href={link.href} label={link.label} className="text-md" />
          ))}
        </nav>

        {/* Desktop right actions — hidden on mobile */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href={isAuthenticated ? '/profile' : '/login'}
            className={cn(buttonVariants({ variant: 'default' }), 'w-full')}>
            {isAuthenticated ? 'Profil' : 'Masuk'}
          </Link>
        </div>

        {/* Mobile Drawer - shown on mobile */}
        <HeaderDrawer menus={navLinks} isAuthenticated={isAuthenticated} />
      </div>
    </header>
  );
}
