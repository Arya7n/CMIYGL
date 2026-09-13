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

  // Fallback: save image, then open Instagram so it can be posted to Stories
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
      // User cancelled share sheet — ignore
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error(err)
      }
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 px-4">
      <div className="flex min-h-[35vw] w-full items-center justify-center">
        {loading || !imageUrl ? (
          <p className="text-ink text-lg uppercase tracking-wide">Generating…</p>
        ) : (
          <img
            src={imageUrl}
            alt="Your Call Me If You Get Lost ID"
            className="h-auto w-[50vw] max-w-full max-md:w-[80vw]"
          />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {imageUrl && (
          <a
            href={imageUrl}
            download="cmiygl-id.png"
            className="inline-flex h-14 w-[150px] items-center justify-center rounded bg-result px-2 text-center text-sm font-bold uppercase text-cream transition hover:bg-cream hover:text-result"
          >
            Download Or Save To Photos
          </a>
        )}
        <button
          type="button"
          disabled={!imageUrl || sharing}
          onClick={onInstagramStory}
          className="inline-flex h-14 w-[150px] items-center justify-center rounded bg-result px-2 text-center text-sm font-bold uppercase text-cream transition hover:bg-cream hover:text-result disabled:opacity-60"
        >
          {sharing ? 'Sharing…' : 'Instagram Story'}
        </button>
        <a
          href="https://twitter.com/intent/tweet?url=https://www.callmeifyougetlost.com/generator&text=Get%20your%20passport%20and%20%23callmeifyougetlost"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-14 w-[150px] items-center justify-center rounded bg-result px-2 text-center text-sm font-bold uppercase text-cream transition hover:bg-cream hover:text-result"
        >
          Share On Twitter
        </a>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-14 w-[150px] items-center justify-center rounded bg-accent px-2 text-center text-sm font-bold uppercase text-cream transition hover:bg-cream hover:text-accent"
        >
          Edit ID
        </button>
      </div>
    </div>
  )
}
