'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export type NavLinkItem = {
  href: string;
  label: string;
  className?: string;
};

export function NavLink({ href, label, className }: { href: string; label: string; className?: string }) {
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
