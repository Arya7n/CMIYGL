import { COLOR_SWATCHES } from '../lib/generateId'
import type { CardColor } from '../lib/types'
import { ModalShell } from './ModalShell'

type ColorModalProps = {
  onClose: () => void
  onSelect: (color: CardColor) => void
}

export function ColorModal({ onClose, onSelect }: ColorModalProps) {
  return (
    <ModalShell onClose={onClose} title="Select Color">
      <div className="grid grid-cols-2 gap-3">
        {COLOR_SWATCHES.map((swatch) => (
          <button
            key={swatch.id}
            type="button"
            aria-label={`Select ${swatch.id}`}
            className="group flex h-20 flex-col items-center justify-end overflow-hidden rounded-xl border border-[#492b1a]/10 transition hover:scale-[1.02] hover:border-accent"
            style={{ background: swatch.hex }}
            onClick={() => onSelect(swatch.id)}
          >
            <span className="mb-2 rounded-full bg-[#fffdf8]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ink opacity-90">
              {swatch.id}
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="mt-4 w-full rounded-lg border border-[#492b1a]/15 bg-white py-2.5 text-sm font-semibold text-ink transition hover:bg-[#492b1a]/5"
        onClick={onClose}
      >
        Cancel
      </button>
    </ModalShell>
  )
}
