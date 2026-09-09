export type AppLocale = 'en' | 'pt-BR'

const CURRENCY_BY_LOCALE: Record<AppLocale, string> = {
  en: 'USD',
  'pt-BR': 'BRL',
}

export function currencyForLocale(locale: AppLocale): string {
  return CURRENCY_BY_LOCALE[locale]
}

function assertAmount(value: number): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`Amount must be a finite number, got ${value}`)
  }
}

/**
 * Formats a monetary value for the given locale
 * (en -> USD, pt-BR -> BRL). Display-only; no conversion.
 */
export function formatPrice(value: number, locale: AppLocale): string {
  assertAmount(value)
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyForLocale(locale),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Formats a per-unit price, e.g. "$5.00/L" (en) or "R$ 5,00/L" (pt-BR).
 */
export function formatUnitPrice(value: number, unit: string, locale: AppLocale): string {
  return `${formatPrice(value, locale)}/${unit}`
}

/**
 * Formats a savings fraction, e.g. 0.2 -> "20%" (en) or "20%" (pt-BR).
 */
export function formatPercent(fraction: number, locale: AppLocale): string {
  assertAmount(fraction)
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(fraction)
}
