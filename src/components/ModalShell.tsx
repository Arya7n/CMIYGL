import type { ReactNode } from 'react'

type ModalShellProps = {
  children: ReactNode
  onClose: () => void
  title?: string
  wide?: boolean
}

export function ModalShell({ children, onClose, title, wide }: ModalShellProps) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-[#492b1a]/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        className={`relative z-10 max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-[#492b1a]/15 bg-cream shadow-[0_24px_60px_rgba(73,43,26,0.28)] sm:rounded-2xl ${
          wide ? 'sm:max-w-md' : 'sm:max-w-sm'
        }`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#492b1a]/10 bg-cream px-5 py-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-ink">
            {title ?? 'Dialog'}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/70 transition hover:bg-[#492b1a]/8 hover:text-ink"
          >
            ×
          </button>
        </div>
        <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">{children}</div>
      </div>
    </div>
  )
}
