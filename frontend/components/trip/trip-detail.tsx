'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Trip } from '@/services/trip.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, MapPin, Users, Wallet, Leaf, SquareChevronLeft } from 'lucide-react';
import Link from 'next/link';

// Split the markdown blob into per-day sections.
// Matches any heading (##, ###, etc.) that contains a digit — handles patterns like:
// "## Hari 1", "## Day 1: Arrival", "### Hari ke-3: Explore"
function splitByDay(markdown: string): { title: string; content: string }[] {
  const dayHeadingRegex = /^(#{1,2})\s+(.+\d.*)$/m;
  const parts = markdown.split(/(^#{1,2}\s+.+\d.*$)/m);
  const sections: { title: string; content: string }[] = [];

  // Preamble before the first day heading
  if (parts[0].trim()) {
    sections.push({ title: '', content: parts[0].trim() });
  }

  let i = 1;
  while (i < parts.length) {
    const heading = parts[i];
    const content = parts[i + 1] ?? '';
    const match = heading.match(dayHeadingRegex);
    const title = match ? match[2].trim() : heading.trim();
    sections.push({ title, content: content.trim() });
    i += 2;
  }

  return sections;
}

function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString('id-ID')}`;
  }
}

// Explicit markdown component styles — no @tailwindcss/typography needed
const markdownComponents: React.ComponentProps<typeof ReactMarkdown>['components'] = {
  h1: ({ children }) => (
    <h1 className="font-heading text-lg font-semibold tracking-tight text-foreground mb-2 mt-4 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-heading text-base font-semibold text-foreground mb-2 mt-4 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1 mt-3 first:mt-0">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-sm leading-relaxed text-foreground/90 mb-2 last:mb-0">{children}</p>
  ),
  ul: ({ children }) => <ul className="mb-2 space-y-1 pl-4">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 space-y-1 pl-4 list-decimal">{children}</ol>,
  li: ({ children }) => (
    <li className="text-sm leading-relaxed text-foreground/90 before:content-['•'] before:mr-2 before:text-amber-500">
      {children}
    </li>
  ),
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic text-muted-foreground">{children}</em>,
  hr: () => <Separator className="my-3" />,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-amber-600 underline underline-offset-4 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-amber-400 pl-3 italic text-sm text-muted-foreground my-2">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-2">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border bg-muted px-3 py-1.5 text-left text-xs font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border border-border px-3 py-1.5 text-sm">{children}</td>,
};

type TripDetailProps = { trip: Trip };

export function TripDetail({ trip }: TripDetailProps) {
  const daySections = trip.ai_recommendation ? splitByDay(trip.ai_recommendation) : [];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      {/* Page header bar — back icon left, destination title right of it */}
      <div className="mb-8 flex items-start gap-4">
        <Link
          href="/"
          aria-label="Kembali ke Beranda"
          className="shrink-0 mt-0.5 sm:mt-1 text-muted-foreground transition-colors hover:text-amber-700 dark:hover:text-amber-500">
          <SquareChevronLeft className="size-7" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            {trip.destination}
          </h1>
          {/* Meta info — sits directly under the title */}
          <div className="mt-2 flex flex-col gap-y-1.5 sm:flex-row sm:flex-wrap sm:gap-x-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CalendarDays className="size-4 shrink-0 text-amber-500" />
              <span>
                {trip.days} Hari · {trip.travel_month}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Wallet className="size-4 shrink-0 text-amber-500" />
              <span>{formatCurrency(trip.budget, trip.currency)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="size-4 shrink-0 text-amber-500" />
              <span>{trip.travel_style}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Leaf className="size-4 shrink-0 text-amber-500" />
              <span>{trip.travel_season}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Day cards */}
      {daySections.length === 0 ? (
        <p className="text-sm text-muted-foreground">Tidak ada rekomendasi tersedia.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {daySections.map((section, i) => (
            <Card key={i} className="border-l-4 border-l-amber-500 rounded-l-none">
              {section.title && (
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MapPin className="size-4 shrink-0 text-amber-500" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
              )}
              <CardContent>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {section.content}
                </ReactMarkdown>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
