import { ShipWheel } from 'lucide-react';

const primaryColor = 'text-amber-600 dark:text-amber-500';
const accentColor = 'text-emerald-600 dark:text-emerald-500';

export function KelanaAiText() {
  return (
    <>
      <span className={`${primaryColor} font-bold`}>Kelana</span>{' '}
      <span className={`${accentColor} font-extrabold`}>AI</span>
    </>
  );
}

export function KelanaAiLogo({ size = 8 }: { size?: number }) {
  const iconSize = `size-${size}`;

  return <ShipWheel className={`${primaryColor} ${iconSize}`} />;
}
