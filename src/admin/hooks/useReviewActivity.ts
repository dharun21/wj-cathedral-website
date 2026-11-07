import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { listContentReviewRequests, subscribeToContentReviewRequests } from '../../services/contentService'

export function useReviewActivity() {
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: ['admin', 'review-activity'], queryFn: listContentReviewRequests })

  useEffect(() => subscribeToContentReviewRequests(() => {
    void queryClient.invalidateQueries({ queryKey: ['admin', 'review-activity'] })
    void queryClient.invalidateQueries({ queryKey: ['admin', 'pending-approvals'] })
    void queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-counts'] })
  }), [queryClient])

  return query
}
