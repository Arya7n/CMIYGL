import { useEffect, useState } from 'react'
import { ColorModal } from './components/ColorModal'
import { IdCardForm } from './components/IdCardForm'
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
    window.setTimeout(() => setIntroRemoved(true), 900)
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
    <div className="app-shell">
      <div
        className="app-bg"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/bg.jpg)` }}
      />

      <a
        href="https://github.com/Arya7n"
        target="_blank"
        rel="noreferrer"
        className="site-credit"
      >
        made by Aryan · @Arya7n
      </a>

      <main className="stage">
        {view === 'form' ? (
          <IdCardForm
            color={color}
            photo={photo}
            name={name}
            dob={dob}
            location={location}
            signature={signature}
            introOpen={introOpen}
            introRemoved={introRemoved}
            onDismissIntro={dismissIntro}
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
      </main>

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
          current={color}
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
