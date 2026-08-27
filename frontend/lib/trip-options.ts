import type { LabeledOption } from '@/services/trip.service';

/**
 * Builds a label lookup function from a list of LabeledOption.
 * Returns the Indonesian label for a given English value.
 * Falls back to the raw value if no match is found.
 *
 * @example
 * const getLabel = buildLabelLookup(travelStyles);
 * getLabel('Couple (budget)') // → 'Bersama pasangan (paling hemat)'
 * getLabel('unknown')         // → 'unknown' (fallback)
 */
export function buildLabelLookup(options: LabeledOption[]): (value: string) => string {
  const map = new Map(options.map(o => [o.value, o.label]));
  return (value: string) => map.get(value) ?? value;
}
