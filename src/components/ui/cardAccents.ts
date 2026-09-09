export interface CardAccent {
  /** Number chip background + foreground. */
  readonly chip: string
  /** Top edge strip of the card. */
  readonly edge: string
}

// Full literal class names (Tailwind JIT): never build these dynamically.
const CARD_ACCENTS: readonly CardAccent[] = [
  { chip: 'bg-violet-500 text-white', edge: 'border-t-violet-500' },
  { chip: 'bg-sky-500 text-white', edge: 'border-t-sky-500' },
  { chip: 'bg-amber-500 text-white', edge: 'border-t-amber-500' },
  { chip: 'bg-emerald-500 text-white', edge: 'border-t-emerald-500' },
  { chip: 'bg-rose-500 text-white', edge: 'border-t-rose-500' },
  { chip: 'bg-cyan-500 text-white', edge: 'border-t-cyan-500' },
]

/** Zero-based slot -> accent, cycling. Saturated tones read on light and dark. */
export function accentFor(slot: number): CardAccent {
  const normalized = ((slot % CARD_ACCENTS.length) + CARD_ACCENTS.length) % CARD_ACCENTS.length
  return CARD_ACCENTS[normalized]
}
