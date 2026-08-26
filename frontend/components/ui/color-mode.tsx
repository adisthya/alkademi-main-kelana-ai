'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Button } from './button';
import { Moon, Sun } from 'lucide-react';

export function ColorModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  if (!mounted) {
    return (
      <Button size="icon-sm" variant="ghost" disabled aria-label="Toggle color mode">
        <Sun />
      </Button>
    );
  }

  return (
    <Button size="icon-sm" variant="ghost" onClick={() => toggleTheme()} aria-label="Toggle color mode">
      {resolvedTheme === 'light' ? <Sun /> : <Moon />}
    </Button>
  );
}
