import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { applyPhotoFilter, cssPreview, PHOTO_FILTERS, type PhotoFilter } from '../lib/filters'
import { ModalShell } from './ModalShell'

type PhotoModalProps = {
  onClose: () => void
  onConfirm: (dataUrl: string) => void
}

export function PhotoModal({ onClose, onConfirm }: PhotoModalProps) {
  const editorRef = useRef<AvatarEditor>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<File | string>('')
  const [scale, setScale] = useState(1.2)
  const [rotate, setRotate] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [filter, setFilter] = useState<PhotoFilter>('none')

  const setFromFile = useCallback((file?: File | null) => {
    if (!file || !file.type.startsWith('image/')) return
    setImage(file)
    setScale(1.2)
    setRotate(0)
    setFilter('none')
  }, [])

  const confirm = () => {
    const canvas = editorRef.current?.getImageScaledToCanvas()
    if (!canvas) {
      onClose()
      return
    }
    onConfirm(applyPhotoFilter(canvas, filter))
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFromFile(e.target.files?.[0])
    e.target.value = ''
  }

  const onDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setDragging(false)
    setFromFile(e.dataTransfer.files?.[0])
  }

  return (
    <ModalShell onClose={onClose} title="Submit Photo" wide>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      {!image ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`group flex min-h-[300px] w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 text-center transition ${
            dragging
              ? 'border-accent bg-accent/10'
              : 'border-[#492b1a]/25 bg-[#fffdf8] hover:border-accent hover:bg-accent/5'
          }`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-2xl text-accent transition group-hover:scale-105">
            ↑
          </span>
          <span className="text-base font-bold uppercase tracking-[0.14em] text-ink">
            Drop photo here
          </span>
          <span className="max-w-[220px] text-sm leading-relaxed text-ink/60">
            or click to browse JPG, PNG, or WEBP from your device
          </span>
          <span className="mt-2 inline-flex rounded-full bg-accent px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-cream transition group-hover:brightness-110">
            Choose File
          </span>
        </button>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl bg-[#2a1810] p-3">
            <div className="flex justify-center" style={{ filter: cssPreview(filter) }}>
              <AvatarEditor
                ref={editorRef}
                image={image}
                width={240}
                height={236}
                border={24}
                borderRadius={4}
                color={[42, 24, 16, 0.65]}
                scale={scale}
                rotate={rotate}
                style={{ borderRadius: 8 }}
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/70">
              Filter
            </p>
            <div className="flex flex-wrap gap-2">
              {PHOTO_FILTERS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setFilter(option.id)}
                  className={`touch-manipulation rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] ${
                    filter === option.id
                      ? 'bg-accent text-cream'
                      : 'border border-[#492b1a]/15 bg-white text-ink'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-ink/70">
              <span>Zoom</span>
              <span>{scale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="photo-range w-full"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              className="rounded-lg border border-[#492b1a]/15 bg-white py-2.5 text-sm font-semibold text-ink transition hover:border-accent hover:bg-accent/10"
              onClick={() => setRotate((r) => r - 90)}
            >
              ↺ Left
            </button>
            <button
              type="button"
              className="rounded-lg border border-[#492b1a]/15 bg-white py-2.5 text-sm font-semibold text-ink transition hover:border-accent hover:bg-accent/10"
              onClick={() => setRotate((r) => r + 90)}
            >
              Right ↻
            </button>
            <button
              type="button"
              className="rounded-lg border border-[#492b1a]/15 bg-white py-2.5 text-sm font-semibold text-ink transition hover:border-accent hover:bg-accent/10"
              onClick={() => fileInputRef.current?.click()}
            >
              Replace
            </button>
          </div>

          <button
            type="button"
            className="w-full rounded-lg bg-accent py-3 text-sm font-bold uppercase tracking-[0.16em] text-cream transition hover:brightness-110"
            onClick={confirm}
          >
            Use Photo
          </button>
        </div>
      )}
    </ModalShell>
  )
}
