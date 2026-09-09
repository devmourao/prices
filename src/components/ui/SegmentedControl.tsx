import { useRef } from 'react'

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
 * One-tap segmented option group following the radio pattern:
 * Tab enters the group once (roving tabindex), arrows move and select,
 * no virtual keyboard involved. Screen readers hear it as radio options.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: SegmentedControlProps<T>) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  const move = (fromIndex: number, delta: number) => {
    const next = (fromIndex + delta + options.length) % options.length
    onChange(options[next].value)
    buttons.current[next]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex gap-1 rounded-xl border border-fg/15 p-1"
    >
      {options.map((option, index) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            ref={(element) => {
              buttons.current[index] = element
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault()
                move(index, 1)
              } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault()
                move(index, -1)
              } else if (event.key === 'Home') {
                event.preventDefault()
                onChange(options[0].value)
                buttons.current[0]?.focus()
              } else if (event.key === 'End') {
                event.preventDefault()
                onChange(options[options.length - 1].value)
                buttons.current[options.length - 1]?.focus()
              }
            }}
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
