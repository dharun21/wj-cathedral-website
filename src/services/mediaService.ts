import type { SupabaseClient } from '@supabase/supabase-js'
import { requireSupabase } from '../lib/supabase'
import type { MediaAssetRow } from '../types/database'
import { maxOptimizedImageBytes, optimizeImageFile, validateImageSelection, validateOptimizedImage } from '../utils/imageOptimization'

const allowedAudioTypes = new Set(['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/x-m4a', 'audio/wav', 'audio/x-wav', 'audio/ogg'])
export const maxImageBytes = maxOptimizedImageBytes
export const maxAudioBytes = 50 * 1024 * 1024

function untypedClient(): SupabaseClient {
  return requireSupabase() as unknown as SupabaseClient
}

export function validateImageFile(file: File) {
  validateImageSelection(file)
}

export function validateAudioFile(file: File) {
  if (!allowedAudioTypes.has(file.type)) throw new Error('Use an MP3, M4A, WAV or OGG audio file.')
  if (file.size > maxAudioBytes) throw new Error('The audio file must be 50 MB or smaller.')
}

function extensionForMime(mimeType: string) {
  if (mimeType === 'audio/mpeg' || mimeType === 'audio/mp3') return 'mp3'
  if (mimeType === 'audio/mp4' || mimeType === 'audio/x-m4a') return 'm4a'
  if (mimeType === 'audio/wav' || mimeType === 'audio/x-wav') return 'wav'
  if (mimeType === 'audio/ogg') return 'ogg'
  if (mimeType === 'image/jpeg') return 'jpg'
  if (mimeType === 'image/png') return 'png'
  if (mimeType === 'image/avif') return 'avif'
  return 'webp'
}

export async function uploadDraftImage(file: File, altEn: string, altTa: string, onProgress?: (progress: number) => void) {
  validateImageFile(file)
  const client = requireSupabase()
  const { data: userData } = await client.auth.getUser()
  const user = userData.user
  if (!user) throw new Error('Your admin session has expired.')
  onProgress?.(5)
  const optimized = await optimizeImageFile(file)
  validateOptimizedImage(optimized.file)
  const extension = extensionForMime(optimized.file.type)
  const path = `${user.id}/${new Date().getUTCFullYear()}/${crypto.randomUUID()}.${extension}`
  onProgress?.(35)
  const { error: uploadError } = await client.storage.from('church-drafts').upload(path, optimized.file, {
    cacheControl: '31536000',
    contentType: optimized.file.type,
    upsert: false,
  })
  if (uploadError) throw uploadError
  onProgress?.(80)
  const { data, error } = await untypedClient().from('media_assets').insert({
    storage_bucket: 'church-drafts',
    storage_path: path,
    public_url: null,
    original_name: file.name,
    mime_type: optimized.file.type,
    file_size: optimized.file.size,
    width: optimized.width,
    height: optimized.height,
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

export async function uploadDraftAudio(file: File, titleEn: string, titleTa: string, onProgress?: (progress: number) => void) {
  validateAudioFile(file)
  const client = requireSupabase()
  const { data: userData } = await client.auth.getUser()
  const user = userData.user
  if (!user) throw new Error('Your admin session has expired.')
  const extension = extensionForMime(file.type)
  const path = `${user.id}/audio/${new Date().getUTCFullYear()}/${crypto.randomUUID()}.${extension}`
  onProgress?.(15)
  const { error: uploadError } = await client.storage.from('church-drafts').upload(path, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: false,
  })
  if (uploadError) throw uploadError
  onProgress?.(75)
  const { data, error } = await untypedClient().from('media_assets').insert({
    storage_bucket: 'church-drafts',
    storage_path: path,
    public_url: null,
    original_name: file.name,
    mime_type: file.type,
    file_size: file.size,
    width: null,
    height: null,
    alt_en: titleEn.trim(),
    alt_ta: titleTa.trim(),
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
  const publicPath = `approved/${new Date().getUTCFullYear()}/${asset.id}.${extensionForMime(asset.mime_type)}`
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
  if (typeof referenceCount === 'number' && referenceCount > 0) throw new Error(`This media file is used in ${referenceCount} content item(s). Remove those references first.`)
  const { error: storageError } = await client.storage.from(asset.storage_bucket).remove([asset.storage_path])
  if (storageError) throw storageError
  const { error } = await untypedClient().from('media_assets').delete().eq('id', asset.id)
  if (error) throw error
}
