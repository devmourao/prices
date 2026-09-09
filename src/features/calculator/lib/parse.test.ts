import { describe, expect, it } from 'vitest'
import { parseAmount } from './parse'

describe('parseAmount', () => {
  it.each([
    ['2', 2],
    ['1.5', 1.5],
    ['1,5', 1.5],
    [' 250 ', 250],
    ['1,', 1],
  ])('parses %s as %s', (input, expected) => {
    expect(parseAmount(input)).toBe(expected)
  })

  it.each([[''], ['.'], ['abc'], ['1.2.3'], ['1,2,3']])('returns null for %s', (input) => {
    expect(parseAmount(input)).toBeNull()
  })
})
