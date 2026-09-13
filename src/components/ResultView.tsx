import { useState } from 'react'

type ResultViewProps = {
  imageUrl: string | null
  loading: boolean
  onEdit: () => void
}

async function shareToInstagramStory(imageUrl: string) {
  const response = await fetch(imageUrl)
  const blob = await response.blob()
  const file = new File([blob], 'cmiygl-id.png', { type: 'image/png' })

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: 'CALL ME IF YOU GET LOST',
      text: 'Get your passport and #callmeifyougetlost',
    })
    return
  }

  const link = document.createElement('a')
  link.href = imageUrl
  link.download = 'cmiygl-id.png'
  link.click()

  window.setTimeout(() => {
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer')
  }, 400)
}

export function ResultView({ imageUrl, loading, onEdit }: ResultViewProps) {
  const [sharing, setSharing] = useState(false)

  const onInstagramStory = async () => {
    if (!imageUrl || sharing) return
    setSharing(true)
    try {
      await shareToInstagramStory(imageUrl)
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error(err)
      }
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 px-1 sm:px-2">
      <div className="flex w-full items-center justify-center">
        {loading || !imageUrl ? (
          <p className="text-lg uppercase tracking-wide text-ink">Generating…</p>
        ) : (
          <img
            src={imageUrl}
            alt="Your Call Me If You Get Lost ID"
            className="h-auto w-full max-w-[min(92vw,720px)] rounded-sm shadow-[0_12px_40px_rgba(73,43,26,0.25)]"
          />
        )}
      </div>

      <div className="result-actions">
        {imageUrl && (
          <a href={imageUrl} download="cmiygl-id.png" className="result-btn">
            Download / Save
          </a>
        )}
        <button
          type="button"
          disabled={!imageUrl || sharing}
          onClick={onInstagramStory}
          className="result-btn"
        >
          {sharing ? 'Sharing…' : 'Instagram Story'}
        </button>
        <a
          href="https://twitter.com/intent/tweet?url=https://www.callmeifyougetlost.com/generator&text=Get%20your%20passport%20and%20%23callmeifyougetlost"
          target="_blank"
          rel="noreferrer"
          className="result-btn"
        >
          Share On Twitter
        </a>
        <button type="button" onClick={onEdit} className="result-btn result-btn-accent">
          Edit ID
        </button>
      </div>
    </div>
  )
}
