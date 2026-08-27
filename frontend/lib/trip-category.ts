import { Backpack, Gem, Map, type LucideIcon } from 'lucide-react';

export type CategoryStyle = {
  icon: LucideIcon;
  iconClass: string;  // icon color
  bgClass: string;  // media background
  badgeBg: string;  // badge background
  badgeText: string;  // badge text color
};

export const categoryStyles: Record<string, CategoryStyle> = {
  Backpacker: {
    icon: Backpack,
    iconClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-100 dark:bg-amber-900/30',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/30',
    badgeText: 'text-amber-700 dark:text-amber-400',
  },
  Standard: {
    icon: Map,
    iconClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/30',
    badgeText: 'text-blue-700 dark:text-blue-400',
  },
  Luxury: {
    icon: Gem,
    iconClass: 'text-violet-600 dark:text-violet-400',
    bgClass: 'bg-violet-100 dark:bg-violet-900/30',
    badgeBg: 'bg-violet-100 dark:bg-violet-900/30',
    badgeText: 'text-violet-700 dark:text-violet-400',
  },
};

// Fallback for unknown categories
export const defaultCategoryStyle: CategoryStyle = {
  icon: Map,
  iconClass: 'text-muted-foreground',
  bgClass: 'bg-muted',
  badgeBg: 'bg-muted',
  badgeText: 'text-muted-foreground',
};

export function getCategoryStyle(category: string): CategoryStyle {
  return categoryStyles[category] ?? defaultCategoryStyle;
}
