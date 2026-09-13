import { COLOR_SWATCHES } from '../lib/generateId'
import type { CardColor } from '../lib/types'
import { ModalShell } from './ModalShell'

type ColorModalProps = {
  onClose: () => void
  onSelect: (color: CardColor) => void
}

export function ColorModal({ onClose, onSelect }: ColorModalProps) {
  return (
    <ModalShell onClose={onClose}>
      <div className="flex flex-wrap overflow-hidden rounded border border-black/20 bg-white">
        {COLOR_SWATCHES.map((swatch) => (
          <button
            key={swatch.id}
            type="button"
            aria-label={`Select ${swatch.id}`}
            className="h-16 w-1/4 border border-black/10"
            style={{ background: swatch.hex }}
            onClick={() => onSelect(swatch.id)}
          />
        ))}
      </div>
      <button
        type="button"
        className="mt-2 w-full rounded border border-black/20 bg-white py-2 text-sm font-semibold"
        onClick={onClose}
      >
        Done
      </button>
    </ModalShell>
  )
}
