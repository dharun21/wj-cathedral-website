// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { imageOptimizationPresets, isAnimatedImage, maxOptimizedImageBytes, optimizeImageFile, validateImageSelection, validateOptimizedImage } from './imageOptimization'

const MEBIBYTE = 1024 * 1024

function mockBrowserImageProcessing(width: number, height: number, encodedSizes: number[], encodedType?: string) {
  const close = vi.fn()
  const createBitmap = vi.fn(async () => ({ width, height, close }))
  vi.stubGlobal('createImageBitmap', createBitmap)
  vi.stubGlobal('OffscreenCanvas', undefined)

  const clearRect = vi.fn()
  const drawImage = vi.fn()
  const outputDimensions: Array<{ width: number; height: number }> = []
  const originalCreateElement = document.createElement.bind(document)
  const createElement = vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
    if (tagName !== 'canvas') return originalCreateElement(tagName)
    const canvas = {
      width: 0,
      height: 0,
      getContext: () => ({ imageSmoothingEnabled: false, imageSmoothingQuality: 'low', clearRect, drawImage }),
      toBlob: (callback: BlobCallback, type?: string) => {
        outputDimensions.push({ width: canvas.width, height: canvas.height })
        const size = encodedSizes.shift() ?? 200 * 1024
        callback(new Blob([new Uint8Array(size)], { type: encodedType ?? type ?? 'image/webp' }))
      },
    }
    return canvas as unknown as HTMLCanvasElement
  })
  return { close, createBitmap, clearRect, drawImage, outputDimensions, createElement }
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('image optimization rules', () => {
  it('uses the requested category dimension and target recommendations', () => {
    expect(imageOptimizationPresets.hero).toMatchObject({ maxWidth: 1920, quality: 0.85 })
    expect(imageOptimizationPresets.gallery).toMatchObject({ maxWidth: 1600, quality: 0.85 })
    expect(imageOptimizationPresets.banner).toMatchObject({ maxWidth: 1600, quality: 0.85 })
    expect(imageOptimizationPresets.profile).toMatchObject({ maxWidth: 800, quality: 0.85 })
    expect(imageOptimizationPresets.logo.maxWidth).toBeNull()
  })

  it('preserves SVG handling by refusing to rasterize it', () => {
    const file = new File(['<svg/>'], 'logo.svg', { type: 'image/svg+xml' })
    expect(() => validateImageSelection(file)).toThrow(/never converted to WebP/)
  })

  it('reports GIF animation instead of flattening it', () => {
    const file = new File(['GIF89a'], 'announcement.gif', { type: 'image/gif' })
    expect(() => validateImageSelection(file)).toThrow(/remove their animation/)
  })

  it('detects animated WebP and APNG markers', async () => {
    const webp = new File(['RIFFxxxxWEBPVP8XxxxxANIM'], 'service.webp', { type: 'image/webp' })
    const apng = new File(['\u0089PNGxxxxacTL'], 'service.png', { type: 'image/png' })
    expect(await isAnimatedImage(webp)).toBe(true)
    expect(await isAnimatedImage(apng)).toBe(true)
  })

  it('accepts still supported raster images', async () => {
    const image = new File(['still-image'], 'service.jpg', { type: 'image/jpeg' })
    expect(() => validateImageSelection(image)).not.toThrow()
    expect(await isAnimatedImage(image)).toBe(false)
  })

  it('rejects final files over two megabytes', () => {
    const file = { name: 'large.webp', type: 'image/webp', size: maxOptimizedImageBytes + 1 } as File
    expect(() => validateOptimizedImage(file)).toThrow(/larger than 2 MB/)
  })

  it('correctly orients, resizes and converts a large photograph to WebP', async () => {
    const browser = mockBrowserImageProcessing(4000, 2000, [400 * 1024])
    const file = new File([new Uint8Array(6 * MEBIBYTE)], 'church-photo.jpg', { type: 'image/jpeg' })
    const result = await optimizeImageFile(file, 'hero')

    expect(result.file.type).toBe('image/webp')
    expect(result.file.name).toBe('church-photo.webp')
    expect(result.file.size).toBe(400 * 1024)
    expect(result.width).toBe(1920)
    expect(result.height).toBe(960)
    expect(browser.outputDimensions[0]).toEqual({ width: 1920, height: 960 })
    expect(browser.createBitmap).toHaveBeenCalledWith(file, expect.objectContaining({ imageOrientation: 'from-image' }))
    expect(browser.clearRect).toHaveBeenCalledWith(0, 0, 1920, 960)
    expect(browser.drawImage).toHaveBeenCalled()
    expect(browser.close).toHaveBeenCalledOnce()
  })

  it('preserves a transparent portrait aspect ratio while applying the profile width limit', async () => {
    const browser = mockBrowserImageProcessing(1200, 2400, [120 * 1024])
    const file = new File([new Uint8Array(600 * 1024)], 'transparent-portrait.png', { type: 'image/png' })
    const result = await optimizeImageFile(file, 'profile')

    expect(result.file.type).toBe('image/webp')
    expect(result.width).toBe(800)
    expect(result.height).toBe(1600)
    expect(browser.outputDimensions[0]).toEqual({ width: 800, height: 1600 })
    expect(browser.clearRect).toHaveBeenCalledWith(0, 0, 800, 1600)
    expect(browser.close).toHaveBeenCalledOnce()
  })

  it('falls back to JPEG when iOS Safari cannot encode WebP', async () => {
    mockBrowserImageProcessing(2400, 1600, [320 * 1024, 320 * 1024, 320 * 1024, 320 * 1024], 'image/jpeg')
    const file = new File([new Uint8Array(4 * MEBIBYTE)], 'ios-photo.jpg', { type: 'image/jpeg' })
    const result = await optimizeImageFile(file, 'gallery')

    expect(result.file.type).toBe('image/jpeg')
    expect(result.file.name).toBe('ios-photo.jpg')
    expect(result.file.size).toBe(320 * 1024)
    expect(result.width).toBe(1600)
    expect(result.height).toBe(1067)
  })

  it('keeps PNG transparency when iOS Safari needs a non-WebP fallback', async () => {
    mockBrowserImageProcessing(900, 900, [90 * 1024, 90 * 1024], 'image/png')
    const file = new File([new Uint8Array(600 * 1024)], 'transparent-logo.png', { type: 'image/png' })
    const result = await optimizeImageFile(file, 'logo')

    expect(result.file.type).toBe('image/png')
    expect(result.file.name).toBe('transparent-logo.png')
    expect(result.width).toBe(900)
    expect(result.height).toBe(900)
  })

  it('does not recompress an efficient WebP that already meets the target', async () => {
    const browser = mockBrowserImageProcessing(1200, 800, [])
    const file = new File([new Uint8Array(200 * 1024)], 'already-efficient.webp', { type: 'image/webp' })
    const result = await optimizeImageFile(file, 'hero')

    expect(result.file).toBe(file)
    expect(result.converted).toBe(false)
    expect(browser.createElement).not.toHaveBeenCalled()
    expect(browser.close).toHaveBeenCalledOnce()
  })

  it('fails clearly when reasonable quality-preserving attempts remain above 2 MB', async () => {
    const browser = mockBrowserImageProcessing(5000, 3500, Array.from({ length: 6 }, () => maxOptimizedImageBytes + 1))
    const file = new File([new Uint8Array(5 * MEBIBYTE)], 'difficult-photo.png', { type: 'image/png' })

    await expect(optimizeImageFile(file, 'gallery')).rejects.toThrow(/unacceptable loss of quality/)
    expect(browser.outputDimensions).toHaveLength(6)
    expect(browser.close).toHaveBeenCalledOnce()
  })
})
