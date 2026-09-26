import { useEffect, useRef, useState } from 'react'
import { FileAudio, FileImage, FileText, Link2, MessageSquareText, QrCode, UploadCloud, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { AnalysisProgress } from '../components/AnalysisProgress'
import { LanguageSelector } from '../components/LanguageSelector'
import { demoCases } from '../data/demos'

type Mode = 'message' | 'image' | 'link' | 'audio' | 'qr'
const modes: { id: Mode; label: string; icon: typeof FileText; accept?: string; copy: string }[] = [
  { id: 'message', label: 'Message', icon: MessageSquareText, copy: 'Paste text from SMS, WhatsApp or email.' },
  { id: 'image', label: 'Screenshot', icon: FileImage, accept: 'image/png,image/jpeg,image/webp', copy: 'Upload a JPG, PNG or WebP image.' },
  { id: 'link', label: 'Link', icon: Link2, copy: 'Paste a URL with optional context.' },
  { id: 'audio', label: 'Voice', icon: FileAudio, accept: 'audio/mpeg,audio/wav,audio/mp4,audio/ogg,audio/webm', copy: 'Upload an audio note up to 10 MB.' },
  { id: 'qr', label: 'QR', icon: QrCode, accept: 'image/png,image/jpeg,image/webp', copy: 'Upload a QR screenshot. Nothing will be opened.' },
]

export function CheckPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState<Mode>('message')
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [context, setContext] = useState('')
  const [language, setLanguage] = useState('English')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const demoId = new URLSearchParams(location.search).get('demo')
    const demo = demoCases.find((item) => item.id === demoId)
    if (!demo) return
    setMode(demo.input_type === 'text' ? 'message' : demo.input_type === 'url' ? 'link' : demo.input_type)
    setText(demo.preview)
  }, [location.search])

  const current = modes.find((item) => item.id === mode)!

  async function submit() {
    setError('')
    if (mode === 'message' && text.trim().length < 8) return setError('Please paste a little more of the message so we can understand its context.')
    if (mode === 'link' && !url.trim()) return setError('Please paste a URL to check.')
    if (['image', 'audio', 'qr'].includes(mode) && !file) return setError('Please add a file first.')

    setLoading(true)
    try {
      const result = mode === 'message'
        ? await api.analyzeText(text, language)
        : mode === 'link'
          ? await api.analyzeUrl(url, context, language)
          : await api.analyzeFile(mode, file!, language)
      sessionStorage.setItem(`scamshield-analysis-${result.id}`, JSON.stringify(result))
      navigate(`/results/${result.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Scam analysis is temporarily unavailable. Try one of the demo cases.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <main className="container-shell py-24"><AnalysisProgress /></main>

  return (
    <main className="container-shell py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <span className="eyebrow">Private by design</span>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">What looks suspicious?</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">Send us the message, image, voice note or link. We’ll help you understand the risk — and what to do next.</p>

        <div className="mt-9 flex flex-wrap gap-2 rounded-full border border-line bg-white p-2 shadow-card">
          {modes.map((item) => {
            const Icon = item.icon
            return <button key={item.id} onClick={() => { setMode(item.id); setError('') }} className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-3 text-sm font-semibold transition sm:min-w-[108px] ${mode === item.id ? 'bg-ink text-white shadow-card' : 'text-muted hover:bg-paper hover:text-ink'}`}><Icon size={16} />{item.label}</button>
          })}
        </div>

        <div className="card mt-5 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-5">
            <div><h2 className="text-2xl font-semibold">{current.label}</h2><p className="mt-1 text-sm leading-6 text-muted">{current.copy}</p></div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft p-3 text-brand"><current.icon size={21} /></div>
          </div>

          {mode === 'message' && <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Paste the suspicious message here…" className="input-shell mt-7 w-full resize-none p-4 text-sm leading-6" />}
          {mode === 'link' && <div className="mt-7 space-y-4"><input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/verify" className="input-shell w-full px-4 py-3 text-sm" /><textarea value={context} onChange={(e) => setContext(e.target.value)} rows={4} placeholder="What did the sender say? (optional context)" className="input-shell w-full resize-none p-4 text-sm leading-6" /></div>}

          {['image', 'audio', 'qr'].includes(mode) && <div onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0] || null) }} className="mt-7 cursor-pointer rounded-2xl border-2 border-dashed border-line bg-paper p-10 text-center transition hover:border-brand/40 hover:bg-brand-soft/30">
            <input ref={inputRef} type="file" accept={current.accept} className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            {file ? <><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-soft text-success-dark"><FileText /></div><p className="mt-3 font-bold">{file.name}</p><button onClick={(e) => { e.stopPropagation(); setFile(null) }} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-muted hover:text-danger-dark">Remove <X size={13} /></button></> : <><UploadCloud className="mx-auto text-brand" size={30} /><p className="mt-3 font-bold">Drop it here or click to browse</p><p className="mt-1 text-xs text-muted">Maximum file size: 10 MB</p></>}
          </div>}

          <div className="mt-7 flex flex-col justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center"><div><p className="text-sm font-bold">Explain results in</p><p className="mt-1 text-xs text-muted">We’ll keep it short, respectful and action-focused.</p></div><LanguageSelector value={language} onChange={setLanguage} /></div>
          {error && <div className="mt-5 rounded-xl border border-red-100 bg-danger-soft px-4 py-3 text-sm font-semibold text-danger-dark">{error}</div>}
          <button onClick={submit} className="btn-primary mt-6 w-full py-3.5">Check for scam signals <UploadCloud size={17} /></button>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-amber-soft p-4 text-xs leading-5 text-amber-900"><span className="mt-0.5">🔒</span><p><strong>Privacy note:</strong> ScamShield processes uploads temporarily. Don’t upload passwords, OTPs, PINs or other sensitive credentials.</p></div>
      </div>
    </main>
  )
}
