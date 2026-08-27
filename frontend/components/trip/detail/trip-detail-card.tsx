import { MapPin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export type DaySection = {
  title: string;
  content: string;
};

export type TripDetailCardProps = {
  sections: DaySection[];
};

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

export function TripDetailCard({ sections }: TripDetailCardProps) {
  return (
    <div className="flex flex-col gap-4">
      {sections.map((section, i) => (
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
  );
}
