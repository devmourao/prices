import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Trash2 } from 'lucide-react'
import { TextField } from '../../../components/ui/TextField'
import { useCalculatorActions } from '../hooks/useCalculator'
import { parseAmount } from '../lib/parse'
import type { Product } from '../store/calculatorStore'
import { UnitSelector } from './UnitSelector'

interface ProductCardProps {
  readonly product: Product
  /** 1-based position, used for the default title. */
  readonly index: number
}

/**
 * Editable product card. Numeric fields keep raw text locally (so typing
 * "1," never jumps) and commit parsed numbers to the store instantly;
 * empty/invalid text commits 0 and is reported as an inline error.
 * Incomplete entries (price/quantity <= 0) are excluded from results.
 */
export function ProductCard({ product, index }: ProductCardProps) {
  const { t } = useTranslation()
  const { updateProduct, removeProduct } = useCalculatorActions()

  const [quantityText, setQuantityText] = useState(() => String(product.quantity))
  const [priceText, setPriceText] = useState(() =>
    product.price === 0 ? '' : String(product.price),
  )

  const quantity = parseAmount(quantityText)
  const price = parseAmount(priceText)

  const quantityError =
    quantity === null || quantity <= 0 ? t('calculator.product.errors.quantityPositive') : undefined
  const priceError =
    price === null || price < 0 ? t('calculator.product.errors.priceInvalid') : undefined

  const handleQuantityChange = (text: string) => {
    setQuantityText(text)
    const parsed = parseAmount(text)
    updateProduct(product.id, { quantity: parsed === null ? 0 : parsed })
  }

  const handlePriceChange = (text: string) => {
    setPriceText(text)
    const parsed = parseAmount(text)
    updateProduct(product.id, { price: parsed === null ? 0 : parsed })
  }

  return (
    <article aria-labelledby={`${product.id}-title`} className="flex flex-col gap-3 rounded-2xl border border-fg/15 bg-bg p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 id={`${product.id}-title`} className="text-base font-semibold text-fg">
          {product.label.trim() === '' ? t('calculator.product.title', { index }) : product.label}
        </h3>
        <button
          type="button"
          aria-label={t('calculator.product.remove')}
          onClick={() => removeProduct(product.id)}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Trash2 size={20} aria-hidden="true" />
        </button>
      </div>

      <TextField
        id={`${product.id}-name`}
        label={t('calculator.product.nameLabel')}
        value={product.label}
        placeholder={t('calculator.product.namePlaceholder')}
        onChange={(value) => updateProduct(product.id, { label: value })}
      />

      <TextField
        id={`${product.id}-quantity`}
        label={t('calculator.product.quantityLabel')}
        value={quantityText}
        placeholder={t('calculator.product.quantityPlaceholder')}
        inputMode="decimal"
        error={quantityError}
        onChange={handleQuantityChange}
      />

      <UnitSelector
        value={product.unit}
        onChange={(unit) => updateProduct(product.id, { unit })}
      />

      <TextField
        id={`${product.id}-price`}
        label={t('calculator.product.priceLabel')}
        value={priceText}
        placeholder={t('calculator.product.pricePlaceholder')}
        inputMode="decimal"
        error={priceError}
        onChange={handlePriceChange}
      />
    </article>
  )
}
