import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SegmentedControl } from './SegmentedControl'

const OPTIONS = [
  { value: 'L', label: 'L' },
  { value: 'mL', label: 'mL' },
  { value: 'kg', label: 'kg' },
] as const

describe('SegmentedControl', () => {
  it('moves selection with arrow keys', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <SegmentedControl
        label="Unit"
        options={OPTIONS}
        value="L"
        onChange={onChange}
      />,
    )

    const selected = screen.getByRole('radio', { name: 'L' })
    selected.focus()
    await user.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith('mL')
  })

  it('selects on click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <SegmentedControl
        label="Unit"
        options={OPTIONS}
        value="L"
        onChange={onChange}
      />,
    )

    await user.click(screen.getByRole('radio', { name: 'kg' }))
    expect(onChange).toHaveBeenCalledWith('kg')
  })
})
