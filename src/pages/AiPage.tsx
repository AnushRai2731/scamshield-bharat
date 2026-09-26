import { useEffect, useState } from 'react'
import { Activity, ArrowRight, Check, FileAudio, FileImage, Link2, MessageSquareText, QrCode, Server, ShieldCheck, Sparkles, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

const inputs = [
  ['Messages', 'SMS, WhatsApp, email and copied text', MessageSquareText],
  ['Screenshots', 'Notices, payment requests and fake alerts', FileImage],
  ['Links', 'Domain structure and user-provided context', Link2],
  ['Voice notes', 'Audio understanding where supported', FileAudio],
  ['QR images', 'Decode payloads without opening or executing them', QrCode],
]

const stages = [
  ['01', 'Understand the context', 'Gemini reads submitted content as untrusted data and identifies the claimed sender, intent and requested action.'],
  ['02', 'Assess the risk', 'The response is validated against a strict schema with LOW, MEDIUM, HIGH, CRITICAL or INCONCLUSIVE confidence.'],
  ['03', 'Explain what to do', 'ScamShield turns the assessment into warning signals, safer next steps and a short parent-friendly explanation.'],
]

export function AiPage() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null)
  const [model, setModel] = useState('Gemini configured on the server')

  useEffect(() => {
    api.health().then((health) => { setStatus('online'); setAiConfigured(health.ai_configured ?? null); setModel(health.model || 'Gemini configured on the server') }).catch(() => setStatus('offline'))
  }, [])

  const connectionLabel = status === 'checking' ? 'Checking connection…' : status === 'online' ? 'Backend connected' : 'Backend unavailable'
  const configurationLabel = aiConfigured === true ? 'Gemini is configured' : aiConfigured === false ? 'Gemini key not detected' : 'Configuration status unavailable'

  return <main className="container-shell py-12 sm:py-16"><div className="mx-auto max-w-5xl">
    <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_.9fr]">
      <div><span className="eyebrow">The AI safety engine</span><h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">A calm second opinion, built for high-pressure moments.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-muted">ScamShield uses Gemini on the backend to understand suspicious content, identify social-engineering signals and explain a safer next step. It is an advisor, not a bank or a guarantee engine.</p><div className="mt-7 flex flex-wrap gap-3"><Link to="/check" className="btn-primary"><Sparkles size={17} /> Try the AI checker</Link><Link to="/demo" className="btn-secondary">See a demo case <ArrowRight size={16} /></Link></div></div>
      <div className="rounded-3xl border border-line bg-white p-5 shadow-soft"><div className="flex items-center justify-between border-b border-line pb-4"><div className="flex items-center gap-2"><Activity className="text-brand" size={18} /><span className="font-label text-[11px] font-bold uppercase tracking-[.14em] text-muted">Engine status</span></div><span className={`font-label rounded-full px-2.5 py-1 text-[10px] font-bold ${status === 'online' ? 'bg-success-soft text-success-dark' : status === 'offline' ? 'bg-danger-soft text-danger-dark' : 'bg-amber-soft text-amber-dark'}`}>{connectionLabel}</span></div><div className="mt-5 space-y-3"><div className="flex items-center justify-between rounded-2xl bg-paper p-4"><span className="text-sm text-muted">AI provider</span><span className="font-semibold text-ink">Google Gemini</span></div><div className="flex items-center justify-between rounded-2xl bg-paper p-4"><span className="text-sm text-muted">Model</span><span className="font-label max-w-[180px] truncate text-right text-xs font-semibold text-ink">{model}</span></div><div className="flex items-center justify-between rounded-2xl bg-paper p-4"><span className="text-sm text-muted">API key</span><span className={`font-semibold ${aiConfigured === true ? 'text-success-dark' : aiConfigured === false ? 'text-danger-dark' : 'text-muted'}`}>{configurationLabel}</span></div></div><p className="mt-4 text-xs leading-5 text-muted">Your key is read only by FastAPI. It is never sent to the browser.</p></div>
    </div>

    <section className="mt-16"><div className="max-w-2xl"><span className="eyebrow">What the AI can understand</span><h2 className="mt-3 text-3xl font-semibold">One safety engine across the channels families already use.</h2></div><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{inputs.map(([title, copy, Icon]) => <div className="rounded-2xl border border-line bg-white p-4 shadow-card" key={title as string}><div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-brand"><Icon size={17} /></div><h3 className="mt-5 text-sm font-semibold">{title as string}</h3><p className="mt-2 text-xs leading-5 text-muted">{copy as string}</p></div>)}</div></section>

    <section className="mt-16 rounded-3xl bg-ink p-7 text-white shadow-soft sm:p-10"><div className="max-w-2xl"><span className="font-label text-[11px] font-bold uppercase tracking-[.14em] text-blue-200">Behind every result</span><h2 className="mt-3 text-3xl font-semibold">Structured analysis, not a generic chat response.</h2><p className="mt-3 text-sm leading-6 text-blue-100">The app keeps the AI focused on one job: help a human make a safer decision before they click, pay or share.</p></div><div className="mt-9 grid gap-4 md:grid-cols-3">{stages.map(([number, title, copy]) => <div className="rounded-2xl border border-white/10 bg-white/10 p-5" key={number}><span className="font-label text-xs font-bold text-blue-200">{number}</span><h3 className="mt-7 text-lg font-semibold">{title as string}</h3><p className="mt-2 text-sm leading-6 text-blue-100">{copy as string}</p></div>)}</div></section>

    <section className="mt-16 grid gap-5 md:grid-cols-2"><div className="rounded-3xl border border-emerald-100 bg-success-soft p-7 shadow-safe"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-success-dark"><ShieldCheck size={19} /></div><h2 className="mt-6 text-2xl font-semibold">Safety boundaries</h2><ul className="mt-5 space-y-3 text-sm leading-6 text-emerald-950/75">{['Never asks for an OTP, PIN, password or CVV.', 'Never transfers money or approves a transaction.', 'Never claims certainty when evidence is insufficient.', 'Treats uploaded content as untrusted data, not instructions.'].map((item) => <li className="flex gap-3" key={item}><Check className="mt-1 shrink-0 text-success-dark" size={16} />{item}</li>)}</ul></div><div className="rounded-3xl border border-red-100 bg-danger-soft p-7 shadow-critical"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-danger-dark"><TriangleAlert size={19} /></div><h2 className="mt-6 text-2xl font-semibold">Know the limitation</h2><p className="mt-5 text-sm leading-7 text-red-950/75">AI-assisted analysis is not proof that a communication is legitimate or fraudulent. Verify important financial or account-related requests independently through an official channel.</p><Link to="/emergency" className="mt-6 inline-flex items-center gap-2 font-semibold text-danger-dark">I may have been scammed <ArrowRight size={15} /></Link></div></section>

    <section className="mt-16 rounded-3xl border border-line bg-white p-7 shadow-card sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand"><Server size={20} /></div><div><h2 className="text-xl font-semibold">Ready to see it work?</h2><p className="mt-1 text-sm leading-6 text-muted">Paste a suspicious message and get a real structured result from the backend.</p></div></div><Link to="/check" className="btn-primary shrink-0">Open AI checker <ArrowRight size={16} /></Link></div></section>
  </div></main>
}
