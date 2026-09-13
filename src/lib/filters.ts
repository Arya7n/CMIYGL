export type PhotoFilter = 'none' | 'bw' | 'grain' | 'vignette' | 'polaroid' | 'warm'

export const PHOTO_FILTERS: { id: PhotoFilter; label: string }[] = [
  { id: 'none', label: 'Original' },
  { id: 'bw', label: 'B&W' },
  { id: 'grain', label: 'Grain' },
  { id: 'vignette', label: 'Vignette' },
  { id: 'polaroid', label: 'Polaroid' },
  { id: 'warm', label: 'Warm' },
]

export function cssPreview(filter: PhotoFilter): string | undefined {
  switch (filter) {
    case 'bw':
      return 'grayscale(1)'
    case 'grain':
      return 'grayscale(0.85) contrast(1.12)'
    case 'vignette':
      return 'brightness(0.9) contrast(1.08)'
    case 'polaroid':
      return 'sepia(0.4) contrast(0.95) brightness(1.06)'
    case 'warm':
      return 'sepia(0.22) saturate(1.15) brightness(1.04)'
    default:
      return undefined
  }
}

export function applyPhotoFilter(source: HTMLCanvasElement, filter: PhotoFilter): string {
  const canvas = document.createElement('canvas')
  canvas.width = source.width
  canvas.height = source.height
  const ctx = canvas.getContext('2d')
  if (!ctx) return source.toDataURL('image/png')

  ctx.drawImage(source, 0, 0)
  if (filter === 'none') return canvas.toDataURL('image/png')

  const { width, height } = canvas
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i]
    let g = data[i + 1]
    let b = data[i + 2]
    const gray = r * 0.299 + g * 0.587 + b * 0.114

    if (filter === 'bw' || filter === 'grain') {
      r = g = b = gray
    } else if (filter === 'polaroid') {
      r = Math.min(255, gray * 1.06 + 20)
      g = Math.min(255, gray * 0.98 + 12)
      b = Math.min(255, gray * 0.86)
    } else if (filter === 'warm') {
      r = Math.min(255, r * 1.08 + 12)
      g = Math.min(255, g * 1.01 + 4)
      b = Math.min(255, b * 0.9)
    } else if (filter === 'vignette') {
      r = Math.min(255, r * 1.04)
      g = Math.min(255, g * 1.02)
      b = Math.min(255, b * 0.98)
    }

    if (filter === 'grain') {
      const noise = (Math.random() - 0.5) * 42
      r = clamp(r + noise)
      g = clamp(g + noise)
      b = clamp(b + noise)
    }

    data[i] = r
    data[i + 1] = g
    data[i + 2] = b
  }

  ctx.putImageData(imageData, 0, 0)

  if (filter === 'vignette' || filter === 'polaroid') {
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.28,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.72,
    )
    gradient.addColorStop(0, 'rgba(0,0,0,0)')
    gradient.addColorStop(1, filter === 'polaroid' ? 'rgba(40,25,10,0.42)' : 'rgba(0,0,0,0.52)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  if (filter === 'polaroid') {
    ctx.fillStyle = 'rgba(255,250,240,0.12)'
    ctx.fillRect(0, 0, width, height)
  }

  return canvas.toDataURL('image/png')
}

function clamp(n: number) {
  return Math.max(0, Math.min(255, n))
}
