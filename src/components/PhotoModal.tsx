import { useCallback, useRef, useState } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { useDropzone } from 'react-dropzone'
import { ModalShell } from './ModalShell'

type PhotoModalProps = {
  onClose: () => void
  onConfirm: (dataUrl: string) => void
}

export function PhotoModal({ onClose, onConfirm }: PhotoModalProps) {
  const editorRef = useRef<AvatarEditor>(null)
  const [image, setImage] = useState<File | string>('')
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [width, setWidth] = useState(220)
  const [height, setHeight] = useState(217)

  const onDrop = useCallback((files: File[]) => {
    if (files[0]) setImage(files[0])
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    disabled: Boolean(image),
    onDrop,
  })

  const confirm = () => {
    const canvas = editorRef.current?.getImage()
    if (canvas) onConfirm(canvas.toDataURL())
    else onClose()
  }

  const rotateBy = (deg: number) => {
    setRotate((r) => r + deg)
    setWidth(height)
    setHeight(width)
  }

  return (
    <ModalShell onClose={onClose}>
      {!image ? (
        <div {...getRootProps()} className="cursor-pointer">
          <input {...getInputProps()} />
          <div className="flex h-[316px] items-center justify-center border border-black bg-white text-black">
            <strong>Drop or Upload</strong>
          </div>
        </div>
      ) : (
        <div className="relative space-y-2">
          <AvatarEditor
            ref={editorRef}
            image={image}
            width={width}
            height={height}
            scale={scale}
            rotate={rotate}
            className="rounded"
          />
          <div className="flex items-center gap-2 rounded border border-black/20 bg-white px-2 py-1">
            <span className="text-xs">−</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-xs">+</span>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              className="flex-1 rounded border border-black/20 bg-white py-2 text-sm"
              onClick={() => rotateBy(90)}
            >
              ↻
            </button>
            <button
              type="button"
              className="flex-1 rounded border border-black/20 bg-white py-2 text-sm"
              onClick={() => rotateBy(-90)}
            >
              ↺
            </button>
            <button
              type="button"
              className="flex-1 rounded border border-black/20 bg-white py-2 text-sm font-bold"
              onClick={confirm}
            >
              ✓
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        className="mt-2 w-full rounded border border-black/20 bg-white py-2 text-sm font-semibold"
        onClick={image ? confirm : onClose}
      >
        {image ? 'Done' : 'Close'}
      </button>
    </ModalShell>
  )
}
