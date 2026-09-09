import type { InputHTMLAttributes } from 'react'

interface TextFieldProps {
  readonly id: string
  readonly label: string
  readonly value: string
  readonly onChange: (value: string) => void
  readonly placeholder?: string
  readonly inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode']
  readonly autoComplete?: string
  readonly error?: string
}

/**
 * Labeled text input with inline error. Controlled with raw text so
 * partially typed values (e.g. "1,") never fight the user's input.
 */
export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  autoComplete = 'off',
  error,
}: TextFieldProps) {
  const errorId = `${id}-error`
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={error !== undefined}
        aria-describedby={error !== undefined ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[44px] rounded-lg border border-fg/20 bg-bg px-3 text-fg placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
      />
      {error !== undefined && (
        <p id={errorId} role="alert" className="text-sm text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
