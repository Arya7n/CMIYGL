type ResultViewProps = {
  imageUrl: string | null
  loading: boolean
  onEdit: () => void
}

export function ResultView({ imageUrl, loading, onEdit }: ResultViewProps) {
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
        <a
          href="https://www.facebook.com/sharer/sharer.php?u=https://www.callmeifyougetlost.com/generator"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-14 w-[150px] items-center justify-center rounded bg-result px-2 text-center text-sm font-bold uppercase text-cream transition hover:bg-cream hover:text-result"
        >
          Share On Facebook
        </a>
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
