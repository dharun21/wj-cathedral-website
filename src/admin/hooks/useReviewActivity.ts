import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { listContentReviewRequests, subscribeToContentReviewRequests } from '../../services/contentService'

export function useReviewActivity(options: { enabled?: boolean; subscribe?: boolean } = {}) {
  const { enabled = true, subscribe = true } = options
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: ['admin', 'review-activity'], queryFn: listContentReviewRequests, enabled })

  useEffect(() => {
    if (!enabled || !subscribe) return undefined
    return subscribeToContentReviewRequests(() => {
    void queryClient.invalidateQueries({ queryKey: ['admin', 'review-activity'] })
    void queryClient.invalidateQueries({ queryKey: ['admin', 'pending-approvals'] })
    void queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-counts'] })
    })
  }, [enabled, queryClient, subscribe])

  return query
}
