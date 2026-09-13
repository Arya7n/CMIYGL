import type { ReactNode } from 'react'

type ModalShellProps = {
  children: ReactNode
  onClose: () => void
}

export function ModalShell({ children, onClose }: ModalShellProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-xs rounded-md bg-transparent p-3">{children}</div>
    </div>
  )
}
