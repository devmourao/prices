import { useTranslation } from 'react-i18next'
import { SegmentedControl } from '../../../components/ui/SegmentedControl'
import type { Unit } from '../lib/units'

const UNIT_OPTIONS = [
  { value: 'L', label: 'L' },
  { value: 'mL', label: 'mL' },
  { value: 'kg', label: 'kg' },
  { value: 'g', label: 'g' },
  { value: 'un', label: 'un' },
] as const

interface UnitSelectorProps {
  readonly value: Unit
  readonly onChange: (unit: Unit) => void
}

/**
 * One-tap unit picker. Replaces unit typing entirely:
 * the virtual keyboard is never opened for units.
 */
export function UnitSelector({ value, onChange }: UnitSelectorProps) {
  const { t } = useTranslation()
  return (
    <SegmentedControl<Unit>
      label={t('calculator.unitSelector.label')}
      options={UNIT_OPTIONS}
      value={value}
      onChange={onChange}
    />
  )
}
