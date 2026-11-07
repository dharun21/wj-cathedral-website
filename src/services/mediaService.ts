import type { SupabaseClient } from '@supabase/supabase-js'
import { requireSupabase } from '../lib/supabase'
import type { MediaAssetRow } from '../types/database'

const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
export const maxImageBytes = 8 * 1024 * 1024

function untypedClient(): SupabaseClient {
  return requireSupabase() as unknown as SupabaseClient
}

export function validateImageFile(file: File) {
  if (!allowedImageTypes.has(file.type)) throw new Error('Use a JPG, PNG, WebP or AVIF image.')
  if (file.size > maxImageBytes) throw new Error('The image must be 8 MB or smaller.')
}

async function imageDimensions(file: File) {
  const bitmap = await createImageBitmap(file)
  const dimensions = { width: bitmap.width, height: bitmap.height }
  bitmap.close()
  return dimensions
}

export async function optimizeImage(file: File, maxDimension = 2400) {
  validateImageFile(file)
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Image processing is unavailable in this browser.')
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error('The image could not be prepared.')), 'image/webp', 0.84)
  })
  return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, { type: 'image/webp' })
}

export async function uploadDraftImage(file: File, altEn: string, altTa: string, onProgress?: (progress: number) => void) {
  validateImageFile(file)
  const client = requireSupabase()
  const { data: userData } = await client.auth.getUser()
  const user = userData.user
  if (!user) throw new Error('Your admin session has expired.')
  onProgress?.(10)
  const optimized = await optimizeImage(file)
  const dimensions = await imageDimensions(optimized)
  const path = `${user.id}/${new Date().getUTCFullYear()}/${crypto.randomUUID()}.webp`
  onProgress?.(35)
  const { error: uploadError } = await client.storage.from('church-drafts').upload(path, optimized, {
    cacheControl: '3600',
    contentType: 'image/webp',
    upsert: false,
  })
  if (uploadError) throw uploadError
  onProgress?.(80)
  const { data, error } = await untypedClient().from('media_assets').insert({
    storage_bucket: 'church-drafts',
    storage_path: path,
    public_url: null,
    original_name: file.name,
    mime_type: optimized.type,
    file_size: optimized.size,
    width: dimensions.width,
    height: dimensions.height,
    alt_en: altEn.trim(),
    alt_ta: altTa.trim(),
    approval_status: 'pending',
    created_by: user.id,
  }).select().single()
  if (error) {
    await client.storage.from('church-drafts').remove([path])
    throw error
  }
  onProgress?.(100)
  return data as MediaAssetRow
}

export async function publishMediaAsset(asset: MediaAssetRow) {
  const client = requireSupabase()
  if (asset.storage_bucket === 'church-media' && asset.approval_status === 'approved') return asset
  const publicPath = `approved/${new Date().getUTCFullYear()}/${asset.id}.webp`
  const { error: copyError } = await client.storage.from(asset.storage_bucket).copy(asset.storage_path, publicPath, { destinationBucket: 'church-media' })
  if (copyError) throw copyError
  const publicUrl = client.storage.from('church-media').getPublicUrl(publicPath).data.publicUrl
  const { data, error } = await untypedClient().from('media_assets').update({
    storage_bucket: 'church-media',
    storage_path: publicPath,
    public_url: publicUrl,
    approval_status: 'approved',
  }).eq('id', asset.id).select().single()
  if (error) throw error
  if (asset.storage_bucket === 'church-drafts') await client.storage.from('church-drafts').remove([asset.storage_path])
  return data as MediaAssetRow
}

export async function getMediaPreviewUrl(asset: MediaAssetRow) {
  if (asset.public_url) return asset.public_url
  const { data, error } = await requireSupabase().storage.from(asset.storage_bucket).createSignedUrl(asset.storage_path, 900)
  if (error) throw error
  return data.signedUrl
}

export async function deleteMediaAsset(asset: MediaAssetRow) {
  const client = requireSupabase()
  const { data: referenceCount, error: referenceError } = await untypedClient().rpc('media_reference_count', { asset_id: asset.id })
  if (referenceError) throw referenceError
  if (typeof referenceCount === 'number' && referenceCount > 0) throw new Error(`This image is used in ${referenceCount} content item(s). Remove those references first.`)
  const { error: storageError } = await client.storage.from(asset.storage_bucket).remove([asset.storage_path])
  if (storageError) throw storageError
  const { error } = await untypedClient().from('media_assets').delete().eq('id', asset.id)
  if (error) throw error
}
