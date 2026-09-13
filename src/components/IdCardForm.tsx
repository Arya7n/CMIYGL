import { CARD_BACKGROUNDS, COLOR_SWATCHES, COPY_LAYER, formatDob } from '../lib/generateId'
import type { CardColor } from '../lib/types'

type IdCardFormProps = {
  color: CardColor
  photo: string
  name: string
  dob: string
  location: string
  signature: string
  introOpen: boolean
  introRemoved: boolean
  onDismissIntro: () => void
  onNameChange: (value: string) => void
  onDobChange: (value: string) => void
  onLocationChange: (value: string) => void
  onOpenPhoto: () => void
  onOpenColor: () => void
  onSelectColor: (color: CardColor) => void
  onOpenSignature: () => void
  onSubmit: () => void
}

export function IdCardForm({
  color,
  photo,
  name,
  dob,
  location,
  signature,
  introOpen,
  introRemoved,
  onDismissIntro,
  onNameChange,
  onDobChange,
  onLocationChange,
  onOpenPhoto,
  onOpenColor,
  onSelectColor,
  onOpenSignature,
  onSubmit,
}: IdCardFormProps) {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="id-frame">
        <div
          className="id-layer z-[1]"
          style={{ backgroundImage: `url(${CARD_BACKGROUNDS[color]})` }}
        />
        <div
          className="id-layer z-[3]"
          style={{ backgroundImage: `url(${COPY_LAYER})` }}
        />

        {photo ? (
          <img
            src={photo}
            alt="Your ID photo"
            className="photo-preview"
            onClick={onOpenPhoto}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onOpenPhoto()
            }}
          />
        ) : (
          <button type="button" className="photo-slot" onClick={onOpenPhoto}>
            Submit Photo
          </button>
        )}

        <input
          type="text"
          className="field-name handwriting"
          placeholder="Name"
          autoComplete="off"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
        <input
          type="text"
          className="field-dob handwriting"
          placeholder="Date Of Birth"
          autoComplete="off"
          maxLength={10}
          value={dob}
          onChange={(e) => onDobChange(formatDob(e.target.value))}
        />
        <input
          type="text"
          className="field-location handwriting"
          placeholder="Location"
          autoComplete="off"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
        />

        <button type="button" className="signature-box" onClick={onOpenSignature}>
          {signature ? (
            <img src={signature} alt="Signature" className="h-full w-full object-contain" />
          ) : (
            <span>{name || 'Sign Here'}</span>
          )}
        </button>

        <div className="card-actions card-actions-desktop">
          <button type="button" className="action-btn" onClick={onOpenColor}>
            Select Color
          </button>
          <button type="button" className="action-btn" onClick={onSubmit}>
            Get Your ID
          </button>
        </div>

        {!introRemoved && (
          <>
            <div className={`intro-text ${introOpen ? 'open' : ''}`}>
              Click to make your own
            </div>
            <button
              type="button"
              aria-label="Start ID generator"
              className={`intro-card ${introOpen ? 'open' : ''}`}
              style={{
                backgroundImage: `url(${import.meta.env.BASE_URL}images/tylerid.png)`,
              }}
              onClick={onDismissIntro}
            />
          </>
        )}
      </div>

      <div className="mobile-controls">
        <div className="color-strip" role="group" aria-label="Select card color">
          {COLOR_SWATCHES.map((swatch) => (
            <button
              key={swatch.id}
              type="button"
              aria-label={`Select ${swatch.id}`}
              aria-pressed={color === swatch.id}
              className={`color-dot ${color === swatch.id ? 'is-active' : ''}`}
              style={{ background: swatch.hex }}
              onClick={() => onSelectColor(swatch.id)}
            />
          ))}
        </div>
        <div className="card-actions card-actions-mobile">
          <button type="button" className="action-btn" onClick={onOpenColor}>
            Select Color
          </button>
          <button type="button" className="action-btn" onClick={onSubmit}>
            Get Your ID
          </button>
        </div>
      </div>
    </div>
  )
}
