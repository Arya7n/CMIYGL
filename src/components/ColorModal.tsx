import { COLOR_SWATCHES } from '../lib/generateId'
import type { CardColor } from '../lib/types'
import { ModalShell } from './ModalShell'

type ColorModalProps = {
  current: CardColor
  onClose: () => void
  onSelect: (color: CardColor) => void
}

export function ColorModal({ current, onClose, onSelect }: ColorModalProps) {
  return (
    <ModalShell onClose={onClose} title="Select Color">
      <div className="grid grid-cols-2 gap-2 sm:gap-3 landscape:grid-cols-4 landscape:sm:grid-cols-2">
        {COLOR_SWATCHES.map((swatch) => {
          const active = swatch.id === current
          return (
            <button
              key={swatch.id}
              type="button"
              aria-label={`Select ${swatch.id}`}
              aria-pressed={active}
              className={`flex min-h-16 touch-manipulation flex-col items-center justify-end rounded-xl border-2 pb-2 sm:min-h-24 sm:pb-3 ${
                active ? 'border-ink' : 'border-[#492b1a]/15'
              }`}
              style={{ background: swatch.hex }}
              onClick={() => onSelect(swatch.id)}
            >
              <span className="rounded-full bg-[#fffdf8]/95 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink sm:px-3">
                {swatch.id}
              </span>
            </button>
          )
        })}
      </div>
      <button
        type="button"
        className="mt-3 min-h-11 w-full touch-manipulation rounded-lg border border-[#492b1a]/15 bg-white text-sm font-semibold text-ink sm:mt-4 sm:min-h-12"
        onClick={onClose}
      >
        Cancel
      </button>
    </ModalShell>
  )
}
