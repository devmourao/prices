/**
 * Share plain text via Web Share API, with clipboard fallback.
 * Returns which path succeeded (or null if both failed).
 */
export async function shareReceiptText(
  title: string,
  text: string,
): Promise<'share' | 'clipboard' | null> {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text })
      return 'share'
    } catch (error) {
      // User cancel — don't fall through to clipboard.
      if (error instanceof DOMException && error.name === 'AbortError') return null
    }
  }

  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    try {
      await navigator.clipboard.writeText(text)
      return 'clipboard'
    } catch {
      return null
    }
  }

  return null
}
