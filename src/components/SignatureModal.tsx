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
      onSave(padRef.current.getCanvas().toDataURL())
    }
    onClose()
  }

  return (
    <ModalShell onClose={finish}>
      <div className="relative">
        {empty && (
          <strong className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[100px] items-center justify-center text-white">
            Signature
          </strong>
        )}
        <SignatureCanvas
          ref={padRef}
          onBegin={() => setEmpty(false)}
          onEnd={() => {
            if (padRef.current && !padRef.current.isEmpty()) {
              onSave(padRef.current.getCanvas().toDataURL())
            }
          }}
          canvasProps={{
            width: 278,
            height: 100,
            className: 'relative rounded border border-black bg-white',
          }}
        />
        {!empty && (
          <button
            type="button"
            className="absolute end-0 top-0 text-2xl text-white drop-shadow"
            onClick={clear}
            aria-label="Clear signature"
          >
            ×
          </button>
        )}
        {nameHint && <p className="mt-1 text-end text-sm text-white">{nameHint}</p>}
      </div>
      <button
        type="button"
        className="mt-2 w-full rounded border border-black/20 bg-white py-2 text-sm font-semibold"
        onClick={finish}
      >
        Done
      </button>
    </ModalShell>
  )
}
