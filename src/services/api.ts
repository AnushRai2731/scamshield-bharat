import type { AnalysisRecord, InputType } from '../types'

// Production requests stay on the Vercel domain and are routed to the backend service.
const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '')

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${path}`, options)
    const body = await response.json().catch(() => null)
    if (!response.ok) throw new Error(body?.message || body?.detail?.message || (typeof body?.detail === 'string' ? body.detail : 'We could not complete that request.'))
    return body as T
  } catch (error) {
    if (error instanceof TypeError) throw new Error("We couldn't connect to ScamShield. Please try again.")
    throw error
  }
}

const json = (body: unknown): RequestInit => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

export const api = {
  analyzeText: (text: string, language: string) => request<AnalysisRecord>('/api/analyze/text', json({ text, language })),
  analyzeUrl: (url: string, context: string, language: string) => request<AnalysisRecord>('/api/analyze/url', json({ url, context, language })),
  analyzeFile: (inputType: 'image' | 'audio' | 'qr', file: File, language: string) => {
    const form = new FormData(); form.append('file', file); form.append('language', language)
    return request<AnalysisRecord>(`/api/analyze/${inputType}`, { method: 'POST', body: form })
  },
  runDemo: (id: string, language = 'English') => request<AnalysisRecord>(`/api/demo/${id}`, json({ language })),
  getHistory: () => request<AnalysisRecord[]>('/api/history'),
  clearHistory: () => request<{ success: boolean }>('/api/history', { method: 'DELETE' }),
  health: () => request<{ status: string; service: string; ai_configured?: boolean; model?: string }>('/api/health'),
}
