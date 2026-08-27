'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelRightOpen, ShipWheel, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ColorModeToggle } from '@/components/ui/color-mode';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerTrigger,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Trips', href: '/trips' },
];

function NavLink({ href, label, className }: { href: string; label: string; className?: string }) {
  const pathname = usePathname();
  // Use exact match for home, prefix match for all other routes
  const isActive = href === '/' ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium underline-offset-4 transition-colors',
        'hover:underline hover:text-amber-700 dark:hover:text-amber-500',
        isActive ? 'text-amber-700 underline dark:text-amber-500' : 'text-muted-foreground',
        className,
      )}>
      {label}
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-heading font-semibold text-xl">
          <ShipWheel className="size-8 text-amber-500" />
          <span>
            <span className="text-amber-500 font-bold">Kelana</span>
            <span className="text-emerald-500 font-extrabold"> AI</span>
          </span>
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <nav className="hidden items-center gap-4 md:flex">
          {navLinks.map(link => (
            <NavLink key={link.href} href={link.href} label={link.label} className="text-md" />
          ))}
        </nav>

        {/* Desktop right actions — hidden on mobile */}
        <div className="hidden items-center gap-2 md:flex">
          <ColorModeToggle />
          <Button size="sm" variant="default">
            Sign In
          </Button>
        </div>

        {/* Mobile: drawer trigger — visible only on mobile */}
        <div className="flex md:hidden">
          <Drawer modal swipeDirection="right" showSwipeHandle>
            <DrawerTrigger
              render={
                <Button size="icon" variant="ghost" aria-label="Open menu">
                  <PanelRightOpen />
                </Button>
              }
            />
            <DrawerContent>
              <DrawerHeader className="flex-row items-center justify-between">
                <DrawerTitle>Menu</DrawerTitle>
                <DrawerClose
                  render={
                    <Button size="icon" variant="ghost" aria-label="Close menu">
                      <X />
                    </Button>
                  }
                />
              </DrawerHeader>

              {/* Nav links */}
              <nav className="flex flex-col gap-1 px-4 py-2">
                {navLinks.map(link => (
                  <DrawerClose
                    key={link.href}
                    render={<NavLink href={link.href} label={link.label} className="py-2.5 text-base" />}
                  />
                ))}
              </nav>

              <Separator className="mx-4 my-2 w-auto" />

              {/* Footer actions */}
              <DrawerFooter className="flex-col gap-2">
                <Button size="default" className="w-full">
                  Sign In
                </Button>
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm text-muted-foreground">Tema</span>
                  <ColorModeToggle />
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
