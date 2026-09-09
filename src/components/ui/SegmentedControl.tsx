export interface SegmentOption<T extends string> {
  readonly value: T
  readonly label: string
}

interface SegmentedControlProps<T extends string> {
  readonly options: readonly SegmentOption<T>[]
  readonly value: T
  readonly onChange: (value: T) => void
  /** Accessible name for the option group. */
  readonly label: string
}

/**
 * One-tap segmented option group. Native buttons: keyboard operable
 * by default, no virtual keyboard involved.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={label} className="flex gap-1 rounded-xl border border-fg/15 p-1">
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={
              selected
                ? 'min-h-[44px] flex-1 rounded-lg bg-accent px-3 font-semibold text-white transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
                : 'min-h-[44px] flex-1 rounded-lg px-3 text-muted transition-colors duration-200 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
            }
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
