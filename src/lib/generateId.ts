import type { CardColor } from './types'

import cardYellow from '../assets/cardbg-yellow.png'
import cardMint from '../assets/cardbg-mint.png'
import cardPink from '../assets/cardbg-pink.png'
import cardBlue from '../assets/cardbg-blue.png'
import copyLayer from '../assets/copylayer.png'

export const CARD_BACKGROUNDS: Record<CardColor, string> = {
  yellow: cardYellow,
  mint: cardMint,
  pink: cardPink,
  blue: cardBlue,
}

export const COPY_LAYER = copyLayer

export const COLOR_SWATCHES: { id: CardColor; hex: string }[] = [
  { id: 'yellow', hex: '#e2d2a7' },
  { id: 'mint', hex: '#b4d7b3' },
  { id: 'pink', hex: '#ddc1c6' },
  { id: 'blue', hex: '#b7ced0' },
]

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export async function generateIdCanvas(options: {
  photo?: string
  name: string
  dob: string
  location: string
  signature?: string
  color: CardColor
}): Promise<string> {
  const { photo, name, dob, location, signature, color } = options

  const [bg, overlay, photoImg, signatureImg] = await Promise.all([
    loadImage(CARD_BACKGROUNDS[color]),
    loadImage(COPY_LAYER),
    photo ? loadImage(photo) : Promise.resolve(null),
    signature ? loadImage(signature) : Promise.resolve(null),
  ])

  const canvas = document.createElement('canvas')
  canvas.width = 2014
  canvas.height = 1277
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unsupported')

  ctx.drawImage(bg, 0, 0)
  ctx.drawImage(overlay, 0, 0)

  if (photoImg) {
    ctx.save()
    ctx.shadowColor = '#000000'
    ctx.shadowBlur = 20
    ctx.shadowOffsetX = 5
    ctx.shadowOffsetY = 5
    ctx.drawImage(photoImg, 140, 240, 810, 806)
    ctx.restore()
  }

  ctx.fillStyle = '#000000'
  ctx.font = '90px "Nanum Pen Script"'

  const drawCentered = (text: string, centerX: number, y: number) => {
    const width = ctx.measureText(text).width
    ctx.fillText(text, centerX - width / 2, y)
  }

  drawCentered(name, 1530, 330)
  drawCentered(dob, 1530, 410)
  drawCentered(location, 1530, 485)

  if (signatureImg) {
    ctx.drawImage(signatureImg, 1005, 990, 800, 115)
  } else if (name) {
    ctx.font = '60px "Rock Salt"'
    drawCentered(name, 1415, 1090)
  }

  return canvas.toDataURL('image/png')
}

export function formatDob(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  let formatted = ''
  if (digits.length > 0) formatted += digits.slice(0, 2)
  if (digits.length > 2) formatted += `/${digits.slice(2, 4)}`
  if (digits.length > 4) formatted += `/${digits.slice(4, 8)}`
  return formatted
}
