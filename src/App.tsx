import { useEffect, useState } from 'react'
import { ColorModal } from './components/ColorModal'
import { IdCardForm } from './components/IdCardForm'
import { IntroOverlay } from './components/IntroOverlay'
import { PhotoModal } from './components/PhotoModal'
import { ResultView } from './components/ResultView'
import { SignatureModal } from './components/SignatureModal'
import { generateIdCanvas } from './lib/generateId'
import type { AppView, CardColor, ModalKind } from './lib/types'

export default function App() {
  const [introOpen, setIntroOpen] = useState(true)
  const [introRemoved, setIntroRemoved] = useState(false)
  const [view, setView] = useState<AppView>('form')
  const [modal, setModal] = useState<ModalKind>(null)

  const [color, setColor] = useState<CardColor>('yellow')
  const [photo, setPhoto] = useState('')
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [location, setLocation] = useState('')
  const [signature, setSignature] = useState('')
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  const dismissIntro = () => {
    setIntroOpen(false)
    window.setTimeout(() => setIntroRemoved(true), 3000)
  }

  useEffect(() => {
    if (view !== 'result') return

    let cancelled = false
    setGenerating(true)

    generateIdCanvas({
      photo: photo || undefined,
      name,
      dob,
      location,
      signature: signature || undefined,
      color,
    })
      .then((url) => {
        if (!cancelled) setResultUrl(url)
      })
      .catch((err) => {
        console.error(err)
        if (!cancelled) setResultUrl(null)
      })
      .finally(() => {
        if (!cancelled) setGenerating(false)
      })

    return () => {
      cancelled = true
    }
  }, [view, photo, name, dob, location, signature, color])

  return (
    <div className="relative min-h-screen w-full">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/bg.jpg)` }}
      />

      <div className="stage">
        <IntroOverlay open={introOpen} removed={introRemoved} onDismiss={dismissIntro} />

        {view === 'form' ? (
          <IdCardForm
            color={color}
            photo={photo}
            name={name}
            dob={dob}
            location={location}
            signature={signature}
            onNameChange={setName}
            onDobChange={setDob}
            onLocationChange={setLocation}
            onOpenPhoto={() => setModal('photo')}
            onOpenColor={() => setModal('color')}
            onOpenSignature={() => {
              setSignature('')
              setModal('signature')
            }}
            onSubmit={() => setView('result')}
          />
        ) : (
          <ResultView
            imageUrl={resultUrl}
            loading={generating}
            onEdit={() => setView('form')}
          />
        )}
      </div>

      <footer className="absolute bottom-0 left-0 right-0 bg-cream px-4 py-5 text-center text-[11px] uppercase text-ink">
        Fan recreation of the Call Me If You Get Lost ID generator. Not affiliated with
        Columbia Records or Tyler, The Creator.
      </footer>

      {modal === 'photo' && (
        <PhotoModal
          onClose={() => setModal(null)}
          onConfirm={(dataUrl) => {
            setPhoto(dataUrl)
            setModal(null)
          }}
        />
      )}
      {modal === 'color' && (
        <ColorModal
          onClose={() => setModal(null)}
          onSelect={(next) => {
            setColor(next)
            setModal(null)
          }}
        />
      )}
      {modal === 'signature' && (
        <SignatureModal
          nameHint={name}
          onClose={() => setModal(null)}
          onSave={setSignature}
        />
      )}
    </div>
  )
}
