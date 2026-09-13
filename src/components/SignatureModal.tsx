import { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { ModalShell } from './ModalShell'

type SignatureModalProps = {
  nameHint: string
  onClose: () => void
  onSave: (dataUrl: string) => void
}

export function SignatureModal({ nameHint, onClose, onSave }: SignatureModalProps) {
  const padRef = useRef<SignatureCanvas>(null)
  const [empty, setEmpty] = useState(true)

  const clear = () => {
    padRef.current?.clear()
    setEmpty(true)
    onSave('')
  }

  const finish = () => {
    if (!padRef.current || padRef.current.isEmpty()) {
      onSave('')
    } else {
      onSave(padRef.current.getCanvas().toDataURL('image/png'))
    }
    onClose()
  }

  return (
    <ModalShell onClose={onClose} title="Sign Here" wide>
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-xl border border-[#492b1a]/15 bg-white">
          {empty && (
            <p className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-sm font-bold uppercase tracking-[0.16em] text-ink/35">
              Draw your signature
            </p>
          )}
          <SignatureCanvas
            ref={padRef}
            onBegin={() => setEmpty(false)}
            onEnd={() => {
              if (padRef.current && !padRef.current.isEmpty()) {
                onSave(padRef.current.getCanvas().toDataURL('image/png'))
              }
            }}
            canvasProps={{
              width: 360,
              height: 140,
              className: 'relative block h-[140px] w-full bg-white',
            }}
          />
        </div>

        {nameHint && (
          <p className="text-center font-[family-name:var(--font-sign)] text-sm text-ink/70">
            {nameHint}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="rounded-lg border border-[#492b1a]/15 bg-white py-2.5 text-sm font-semibold text-ink transition hover:bg-[#492b1a]/5"
            onClick={clear}
          >
            Clear
          </button>
          <button
            type="button"
            className="rounded-lg bg-accent py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:brightness-110"
            onClick={finish}
          >
            Done
          </button>
        </div>
      </div>
    </ModalShell>
  )
}
