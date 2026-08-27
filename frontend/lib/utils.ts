import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DaySection } from '@/components/trip/detail/trip-detail-card';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string): string {
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

// Split the markdown blob into per-day sections.
// Matches any heading (##, ###, etc.) that contains a digit — handles patterns like:
// "## Hari 1", "## Day 1: Arrival", "### Hari ke-3: Explore"
export function splitMdBlobByDay(markdown: string): DaySection[] {
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
