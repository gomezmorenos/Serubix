export interface ContentItem {
  id: string
  tool: string
  label: string
  status: 'pending' | 'done' | 'error'
  filename: string | null
  createdAt: string
}
