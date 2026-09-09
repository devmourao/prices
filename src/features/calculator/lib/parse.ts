/**
 * Parses a localized decimal typed by hand. Accepts comma or dot as the
 * decimal separator ("1,5" -> 1.5). Returns null while the text is empty
 * or not yet a valid number, so callers can distinguish "missing"
 * from "invalid" without throwing.
 */
export function parseAmount(text: string): number | null {
  const normalized = text.trim().replace(/\s/g, '').replace(',', '.')
  if (normalized === '' || normalized === '.' || normalized === '-' || normalized === '+') {
    return null
  }
  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(normalized)) {
    return null
  }
  const value = Number(normalized)
  return Number.isFinite(value) ? value : null
}
