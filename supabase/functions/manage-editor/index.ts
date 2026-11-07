import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

function validPassword(value: string) {
  return value.length >= 12 && value.length <= 72 && /[A-Za-z]/.test(value) && /[0-9]/.test(value)
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const authorization = request.headers.get('Authorization')
  if (!supabaseUrl || !anonKey || !serviceRoleKey || !authorization) return json({ error: 'Unauthorized.' }, 401)

  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } })
  const serviceClient = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data: userData, error: userError } = await userClient.auth.getUser()
  if (userError || !userData.user) return json({ error: 'Your secure session is invalid or expired.' }, 401)

  const { data: ownerMembership } = await serviceClient
    .from('admin_memberships')
    .select('user_id')
    .eq('user_id', userData.user.id)
    .eq('role', 'owner')
    .eq('is_active', true)
    .maybeSingle()
  if (!ownerMembership) return json({ error: 'Only an active owner can manage editor access.' }, 403)

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }

  const action = String(body.action ?? '')

  if (action === 'list') {
    const { data, error } = await serviceClient
      .from('admin_memberships')
      .select('user_id, display_name, email, is_active, created_at, revoked_at')
      .eq('role', 'editor')
      .order('created_at', { ascending: true })
    if (error) return json({ error: error.message }, 400)
    return json({ editors: data ?? [] })
  }

  if (action === 'create') {
    const displayName = String(body.displayName ?? '').trim()
    const email = String(body.email ?? '').trim().toLowerCase()
    const password = String(body.password ?? '')
    if (displayName.length < 2 || displayName.length > 100) return json({ error: 'Enter the editor’s full name.' }, 400)
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 254) return json({ error: 'Enter a valid email address.' }, 400)
    if (!validPassword(password)) return json({ error: 'Use a password of 12–72 characters containing letters and numbers.' }, 400)

    const { count, error: countError } = await serviceClient
      .from('admin_memberships')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'editor')
      .eq('is_active', true)
    if (countError) return json({ error: countError.message }, 400)
    if ((count ?? 0) >= 2) return json({ error: 'Two editors already have active access. Remove one editor’s access before creating another.' }, 409)

    const { data: created, error: createError } = await serviceClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: displayName },
    })
    if (createError || !created.user) return json({ error: createError?.message ?? 'The editor account could not be created.' }, 400)

    const { error: membershipError } = await serviceClient.from('admin_memberships').insert({
      user_id: created.user.id,
      role: 'editor',
      display_name: displayName,
      email,
      is_active: true,
    })
    if (membershipError) {
      await serviceClient.auth.admin.deleteUser(created.user.id)
      return json({ error: membershipError.message }, membershipError.message.includes('two editors') ? 409 : 400)
    }
    return json({ editor: { user_id: created.user.id, display_name: displayName, email, is_active: true } }, 201)
  }

  const editorId = String(body.editorId ?? '')
  if (!/^[0-9a-f-]{36}$/i.test(editorId)) return json({ error: 'Invalid editor account.' }, 400)
  const { data: target } = await serviceClient.from('admin_memberships').select('user_id, role, is_active').eq('user_id', editorId).maybeSingle()
  if (!target || target.role !== 'editor') return json({ error: 'Editor account not found.' }, 404)

  if (action === 'revoke') {
    const { error } = await serviceClient.from('admin_memberships').update({ is_active: false, revoked_at: new Date().toISOString(), revoked_by: userData.user.id }).eq('user_id', editorId).eq('role', 'editor')
    if (error) return json({ error: error.message }, 400)
    return json({ success: true })
  }

  if (action === 'restore') {
    const { error } = await serviceClient.from('admin_memberships').update({ is_active: true, revoked_at: null, revoked_by: null }).eq('user_id', editorId).eq('role', 'editor')
    if (error) return json({ error: error.message }, error.message.includes('two editors') ? 409 : 400)
    return json({ success: true })
  }

  if (action === 'delete') {
    const { error } = await serviceClient.auth.admin.deleteUser(editorId)
    if (error) return json({ error: error.message }, 400)
    return json({ success: true })
  }

  return json({ error: 'Unsupported action.' }, 400)
})
