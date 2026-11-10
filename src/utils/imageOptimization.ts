const MEBIBYTE = 1024 * 1024

export const maxOptimizedImageBytes = 2 * MEBIBYTE
export const maxSourceImageBytes = 50 * MEBIBYTE

const supportedRasterTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
const alreadyEfficientTypes = new Set(['image/webp', 'image/avif'])

export type ImageOptimizationPreset = 'hero' | 'gallery' | 'banner' | 'profile' | 'logo'

type ImageOptimizationSettings = {
  maxWidth: number | null
  preferredBytes: number
  quality: number
}

export const imageOptimizationPresets: Record<ImageOptimizationPreset, ImageOptimizationSettings> = {
  hero: { maxWidth: 1920, preferredBytes: 500 * 1024, quality: 0.85 },
  gallery: { maxWidth: 1600, preferredBytes: 300 * 1024, quality: 0.85 },
  banner: { maxWidth: 1600, preferredBytes: 400 * 1024, quality: 0.85 },
  profile: { maxWidth: 800, preferredBytes: 150 * 1024, quality: 0.85 },
  logo: { maxWidth: null, preferredBytes: 100 * 1024, quality: 0.88 },
}

export type OptimizedImageResult = {
  file: File
  width: number
  height: number
  converted: boolean
  animated: boolean
}

type DecodedImage = {
  source: CanvasImageSource
  width: number
  height: number
  release: () => void
}

function fileTypeLabel(file: File) {
  return file.type || file.name.split('.').pop()?.toUpperCase() || 'unknown'
}

export function validateImageSelection(file: File) {
  if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
    throw new Error('SVG uploads are not enabled in this project. SVG files are kept as SVG and are never converted to WebP.')
  }
  if (file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif')) {
    throw new Error('Animated GIF images are not supported because optimization would remove their animation. Use a still JPG, PNG, WebP or AVIF image.')
  }
  if (!supportedRasterTypes.has(file.type)) {
    throw new Error(`The ${fileTypeLabel(file)} image format is not supported. Use a JPG, PNG, WebP or AVIF image.`)
  }
  if (file.size <= 0) throw new Error('The selected image is empty.')
  if (file.size > maxSourceImageBytes) {
    throw new Error('The selected image is too large to optimize safely in the browser. Choose an image smaller than 50 MB.')
  }
}

export function validateOptimizedImage(file: File) {
  if (file.size > maxOptimizedImageBytes) {
    throw new Error('The optimized image is still larger than 2 MB. Choose a smaller-resolution image so visual quality can be preserved.')
  }
}

function containsAscii(bytes: Uint8Array, value: string) {
  const pattern = Array.from(value, (character) => character.charCodeAt(0))
  outer: for (let index = 0; index <= bytes.length - pattern.length; index += 1) {
    for (let offset = 0; offset < pattern.length; offset += 1) {
      if (bytes[index + offset] !== pattern[offset]) continue outer
    }
    return true
  }
  return false
}

export async function isAnimatedImage(file: File) {
  const header = new Uint8Array(await file.slice(0, Math.min(file.size, MEBIBYTE)).arrayBuffer())
  if (file.type === 'image/png') return containsAscii(header, 'acTL')
  if (file.type === 'image/webp') return containsAscii(header, 'ANIM')
  if (file.type === 'image/avif') return containsAscii(header, 'avis') || containsAscii(header, 'msf1')
  return false
}

async function decodeWithImageElement(file: File): Promise<DecodedImage> {
  const url = URL.createObjectURL(file)
  const image = new Image()
  try {
    image.decoding = 'async'
    image.src = url
    if (typeof image.decode === 'function') await image.decode()
    else await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('The selected image could not be decoded.'))
    })
    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    }
  } catch (error) {
    URL.revokeObjectURL(url)
    throw error
  }
}

async function decodeImage(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: 'from-image',
        premultiplyAlpha: 'default',
        colorSpaceConversion: 'default',
      })
      return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() }
    } catch {
      // Some Safari versions cannot decode every supported type through ImageBitmap.
    }
  }
  return decodeWithImageElement(file)
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => resolve())
    else setTimeout(resolve, 0)
  })
}

function fallbackMimeType(originalType: string) {
  // Older iOS/Safari releases cannot encode WebP from Canvas. Keep PNG when
  // transparency may be present; photographs can safely fall back to JPEG.
  return originalType === 'image/png' ? 'image/png' : 'image/jpeg'
}

async function encodeImage(source: CanvasImageSource, width: number, height: number, quality: number, originalType: string) {
  await nextFrame()
  if (typeof OffscreenCanvas !== 'undefined') {
    try {
      const canvas = new OffscreenCanvas(width, height)
      const context = canvas.getContext('2d')
      if (context) {
        context.imageSmoothingEnabled = true
        context.imageSmoothingQuality = 'high'
        context.clearRect(0, 0, width, height)
        context.drawImage(source, 0, 0, width, height)
        const blob = await canvas.convertToBlob({ type: 'image/webp', quality })
        if (blob.type === 'image/webp') return blob
      }
    } catch {
      // Fall back to an HTML canvas when OffscreenCanvas WebP encoding is incomplete.
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Image processing is unavailable in this browser.')
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.clearRect(0, 0, width, height)
  context.drawImage(source, 0, 0, width, height)
  let blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error('The image could not be optimized.')), 'image/webp', quality)
  })
  if (blob.type !== 'image/webp') {
    const fallbackType = fallbackMimeType(originalType)
    blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => result ? resolve(result) : reject(new Error('The image could not be optimized in this browser.')), fallbackType, fallbackType === 'image/png' ? undefined : quality)
    })
  }
  canvas.width = 1
  canvas.height = 1
  return blob
}

function optimizedFilename(filename: string, mimeType: string) {
  const base = filename.replace(/\.[^.]+$/, '').trim() || 'church-image'
  const extension = mimeType === 'image/png' ? 'png' : mimeType === 'image/jpeg' ? 'jpg' : 'webp'
  return `${base}.${extension}`
}

function asFile(blob: Blob, original: File) {
  return new File([blob], optimizedFilename(original.name, blob.type), { type: blob.type, lastModified: Date.now() })
}

function resizedDimensions(width: number, height: number, maxWidth: number | null, scale = 1) {
  const widthLimit = maxWidth === null ? width : Math.min(width, maxWidth)
  const outputWidth = Math.max(1, Math.round(widthLimit * scale))
  return { width: outputWidth, height: Math.max(1, Math.round(height * (outputWidth / width))) }
}

export async function optimizeImageFile(file: File, preset: ImageOptimizationPreset = 'hero'): Promise<OptimizedImageResult> {
  validateImageSelection(file)
  const settings = imageOptimizationPresets[preset]
  const animated = await isAnimatedImage(file)
  let decoded: DecodedImage
  try {
    decoded = await decodeImage(file)
  } catch {
    throw new Error('The selected image could not be read. It may be damaged or unsupported by this browser.')
  }

  try {
    if (!decoded.width || !decoded.height) throw new Error('The selected image has invalid dimensions.')
    const withinDimensions = settings.maxWidth === null || decoded.width <= settings.maxWidth

    if (animated) {
      if (withinDimensions && file.size <= maxOptimizedImageBytes) {
        return { file, width: decoded.width, height: decoded.height, converted: false, animated: true }
      }
      throw new Error('This animated image cannot be optimized below the upload limit without removing its animation. Choose a still image or a smaller animated file.')
    }

    if (alreadyEfficientTypes.has(file.type) && withinDimensions && file.size <= settings.preferredBytes) {
      return { file, width: decoded.width, height: decoded.height, converted: false, animated: false }
    }

    const base = resizedDimensions(decoded.width, decoded.height, settings.maxWidth)
    const firstBlob = await encodeImage(decoded.source, base.width, base.height, settings.quality, file.type)
    let selected = { blob: firstBlob, width: base.width, height: base.height }

    if (firstBlob.size > maxOptimizedImageBytes) {
      const attempts = [
        { scale: 1, quality: 0.8 },
        { scale: 0.9, quality: 0.84 },
        { scale: 0.82, quality: 0.82 },
        { scale: 0.74, quality: 0.8 },
        { scale: 0.68, quality: 0.76 },
      ]
      let fitting: typeof selected | null = null
      for (const attempt of attempts) {
        const dimensions = resizedDimensions(decoded.width, decoded.height, settings.maxWidth, attempt.scale)
        const blob = await encodeImage(decoded.source, dimensions.width, dimensions.height, attempt.quality, file.type)
        if (blob.size <= maxOptimizedImageBytes) {
          fitting = { blob, ...dimensions }
          break
        }
      }
      if (!fitting) {
        throw new Error('The image cannot be reduced below 2 MB without an unacceptable loss of quality. Choose a smaller-resolution image.')
      }
      selected = fitting
    } else if (firstBlob.size > settings.preferredBytes) {
      const preferredBlob = await encodeImage(decoded.source, base.width, base.height, Math.max(0.82, settings.quality - 0.03), file.type)
      if (preferredBlob.size < firstBlob.size && preferredBlob.size <= settings.preferredBytes) {
        selected = { blob: preferredBlob, width: base.width, height: base.height }
      }
    }

    const canKeepOriginal = withinDimensions && file.size <= maxOptimizedImageBytes
    const webpSavingsAreNegligible = selected.blob.size >= file.size * 0.95
    if (canKeepOriginal && webpSavingsAreNegligible) {
      return { file, width: decoded.width, height: decoded.height, converted: false, animated: false }
    }

    const optimized = asFile(selected.blob, file)
    validateOptimizedImage(optimized)
    return { file: optimized, width: selected.width, height: selected.height, converted: true, animated: false }
  } finally {
    decoded.release()
  }
}

