type IntroOverlayProps = {
  open: boolean
  removed: boolean
  onDismiss: () => void
}

export function IntroOverlay({ open, removed, onDismiss }: IntroOverlayProps) {
  return (
    <>
      <div className={`intro-text ${open ? 'open' : ''} ${removed ? 'hidden' : ''}`}>
        Click to make your own
      </div>
      <button
        type="button"
        aria-label="Start ID generator"
        className={`intro-card ${open ? 'open' : ''} ${removed ? 'hidden' : ''}`}
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/tylerid.png)` }}
        onClick={onDismiss}
      />
    </>
  )
}
