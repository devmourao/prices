import { useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { useListActions } from '../hooks/useList'

/**
 * Name-only add. Submit keeps focus in the field for rapid aisle entry.
 */
export function AddItemField() {
  const { t } = useTranslation()
  const { addItem } = useListActions()
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (trimmed === '') return
    addItem(trimmed)
    setName('')
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <label htmlFor="list-add-item" className="sr-only">
        {t('list.add.label')}
      </label>
      <input
        ref={inputRef}
        id="list-add-item"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder={t('list.add.placeholder')}
        autoComplete="off"
        className="min-h-[48px] flex-1 rounded-xl border border-fg/20 bg-bg px-3 text-fg placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
      />
      <button
        type="submit"
        disabled={name.trim() === ''}
        className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center gap-2 rounded-xl bg-accent px-4 font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus size={20} aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">{t('list.add.submit')}</span>
      </button>
    </form>
  )
}
