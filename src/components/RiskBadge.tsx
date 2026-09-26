import type { RiskLevel } from '../types'
import { cn } from '../lib/utils'
const styles: Record<RiskLevel, string> = { LOW: 'bg-success-soft text-success-dark border-emerald-100', MEDIUM: 'bg-amber-soft text-amber-dark border-amber-100', HIGH: 'bg-amber-soft text-amber-dark border-amber-100', CRITICAL: 'bg-danger-soft text-danger-dark border-red-100', INCONCLUSIVE: 'bg-slate-100 text-slate-600 border-slate-200' }
export function RiskBadge({ level, compact = false }: { level: RiskLevel; compact?: boolean }) { return <span className={cn('font-label inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-[10px] font-bold tracking-[0.08em]', styles[level], compact && 'h-6 px-2.5 text-[9px]')}>{level === 'INCONCLUSIVE' ? 'NEEDS MORE CONTEXT' : `${level} RISK`}</span> }
