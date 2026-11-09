// @vitest-environment jsdom
import { QueryClient } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { invalidatePublishedContent, subscribeToPublishedContentChanges } from './contentCache'

class TestBroadcastChannel {
  static channels = new Map<string, Set<TestBroadcastChannel>>()
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null
  private readonly name: string

  constructor(name: string) {
    this.name = name
    const channels = TestBroadcastChannel.channels.get(name) ?? new Set<TestBroadcastChannel>()
    channels.add(this)
    TestBroadcastChannel.channels.set(name, channels)
  }

  postMessage(value: unknown) {
    for (const channel of TestBroadcastChannel.channels.get(this.name) ?? []) {
      if (channel !== this) channel.onmessage?.({ data: value } as MessageEvent<unknown>)
    }
  }

  close() {
    TestBroadcastChannel.channels.get(this.name)?.delete(this)
  }
}

afterEach(() => {
  TestBroadcastChannel.channels.clear()
  vi.unstubAllGlobals()
})

describe('published content cache invalidation', () => {
  it('invalidates only the public keys related to a changed table', async () => {
    vi.stubGlobal('BroadcastChannel', TestBroadcastChannel)
    const queryClient = new QueryClient()
    queryClient.setQueryData(['public', 'videos'], ['mapped'])
    queryClient.setQueryData(['public', 'video-rows'], ['rows'])
    queryClient.setQueryData(['public', 'events'], ['events'])

    await invalidatePublishedContent(queryClient, 'videos')

    expect(queryClient.getQueryState(['public', 'videos'])?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(['public', 'video-rows'])?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(['public', 'events'])?.isInvalidated).toBe(false)
  })

  it('propagates published changes to another browser-tab cache', async () => {
    vi.stubGlobal('BroadcastChannel', TestBroadcastChannel)
    const firstTab = new QueryClient()
    const secondTab = new QueryClient()
    secondTab.setQueryData(['public', 'site-settings'], { display_name: 'Old name' })
    const unsubscribe = subscribeToPublishedContentChanges(secondTab)

    await invalidatePublishedContent(firstTab, 'site_settings')
    await Promise.resolve()

    expect(secondTab.getQueryState(['public', 'site-settings'])?.isInvalidated).toBe(true)
    unsubscribe()
  })
})

