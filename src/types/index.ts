export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'INCONCLUSIVE'
export type Confidence = 'LOW' | 'MEDIUM' | 'HIGH'
export type InputType = 'text' | 'image' | 'audio' | 'url' | 'qr'

export interface ScamSignal { type: string; title: string; description: string }
export interface ScamAnalysis {
  risk_level: RiskLevel
  category: string
  confidence: Confidence
  summary: string
  claimed_identity?: string | null
  requested_action?: string | null
  signals: ScamSignal[]
  do_not: string[]
  do: string[]
  parent_explanation: string
  escalation_required: boolean
  escalation_guidance?: string | null
  disclaimer: string
}
export interface AnalysisRecord extends ScamAnalysis {
  id: string
  created_at: string
  input_type: InputType
  demo_fallback?: boolean
  source_label?: string
}
export interface ApiError { success: false; error_code: string; message: string }

export interface DemoCase { id: string; label: string; eyebrow: string; description: string; input_type: InputType; preview: string; risk: RiskLevel; color: string }
