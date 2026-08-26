import Link from 'next/link';
import Image from 'next/image';
import { ShipWheel } from 'lucide-react';

const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL;
const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 bg-background shadow-2xl">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        {/* Left — logo + tagline (desktop) */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 font-heading font-semibold">
            <ShipWheel className="size-6 text-amber-500" />
            <span className="text-amber-500 font-bold">Kelana</span>
            <span className="text-emerald-500 font-extrabold">AI</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Temanmu dalam merencanakan perjalanan tak terlupakan.
          </p>
        </div>

        {/* Right — copyright + GitHub */}
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1">
          <p className="text-xs text-muted-foreground">© {currentYear} Made by Adis</p>
          {githubUrl && (
            <Link
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Lihat kode sumber di GitHub"
              className="transition-opacity hover:opacity-70">
              {/* Light mode */}
              <Image
                src="/GitHub_black.svg"
                alt="GitHub"
                width={16}
                height={16}
                className="block dark:hidden"
              />
              {/* Dark mode */}
              <Image
                src="/GitHub_white.svg"
                alt="GitHub"
                width={16}
                height={16}
                className="hidden dark:block"
              />
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
