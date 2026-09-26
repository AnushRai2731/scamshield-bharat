import { AlertTriangle, Banknote, ExternalLink, Fingerprint, Gauge, MessageCircleWarning } from 'lucide-react'
import type { ScamSignal } from '../types'
const icons = [AlertTriangle, Banknote, ExternalLink, Fingerprint, Gauge, MessageCircleWarning]
export function SignalCard({ signal, index }: { signal: ScamSignal; index: number }) { const Icon = icons[index % icons.length]; return <div className="rounded-2xl border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-amber-soft text-amber-dark"><Icon size={19}/></div><h3 className="font-semibold text-ink">{signal.title}</h3><p className="mt-1.5 text-sm leading-6 text-muted">{signal.description}</p></div> }
