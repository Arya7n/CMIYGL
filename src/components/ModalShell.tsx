import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ModalShellProps = {
  children: ReactNode
  onClose: () => void
  title?: string
  wide?: boolean
}

export function ModalShell({ children, onClose, title, wide }: ModalShellProps) {
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        aria-hidden
        className="absolute inset-0 bg-[#492b1a]/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 flex w-full max-h-[90dvh] flex-col overflow-hidden rounded-t-2xl border border-[#492b1a]/15 bg-cream shadow-[0_24px_60px_rgba(73,43,26,0.28)] sm:rounded-2xl ${
          wide ? 'sm:max-w-md' : 'sm:max-w-sm'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#492b1a]/10 px-4 py-3 sm:px-5 sm:py-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-ink sm:text-sm">
            {title ?? 'Dialog'}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl leading-none text-ink/70"
          >
            ×
          </button>
        </div>
        <div className="pretty-scroll min-h-0 flex-1 overflow-y-auto p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-5">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}
