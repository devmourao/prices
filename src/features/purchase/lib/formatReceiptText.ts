import { formatPrice, type AppLocale } from '../../../lib/currency'
import { purchaseTotal } from './purchaseTotals'
import type { PurchaseLine } from '../store/purchaseStore'

export type ReceiptTextInput = {
  readonly lines: readonly PurchaseLine[]
  readonly locale: AppLocale
  readonly title: string
  readonly startedAt?: string
  readonly closedAt?: string
  /** Frozen total in major units; defaults to live sum of lines. */
  readonly total?: number
}

function formatWhen(iso: string, locale: AppLocale): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

/**
 * Plain-text cupom for share / clipboard (no markdown).
 */
export function formatReceiptText(input: ReceiptTextInput): string {
  const total =
    input.total !== undefined ? input.total : purchaseTotal(input.lines)
  const rows = input.lines.map((line) => {
    const qty = `${line.quantity}${line.unit}`
    return `${line.name} (${qty})  ${formatPrice(line.price, input.locale)}`
  })

  const header = [input.title]
  if (input.startedAt !== undefined) {
    header.push(formatWhen(input.startedAt, input.locale))
  }
  if (input.closedAt !== undefined) {
    header.push(formatWhen(input.closedAt, input.locale))
  }

  return [...header, '', ...rows, '', `TOTAL  ${formatPrice(total, input.locale)}`].join('\n')
}
