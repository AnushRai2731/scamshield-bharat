import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight, PhoneCall, ShieldCheck } from 'lucide-react'
import { cn } from '../lib/utils'

const links = [
  { to: '/check', label: 'Check Suspicious' },
  { to: '/demo', label: 'Interactive Demos' },
  { to: '/learn', label: 'Scam Library' },
  { to: '/emergency', label: 'Emergency 1930' },
  { to: '/history', label: 'History' },
  { to: '/about', label: 'About' },
]

export function Navbar() {
  return <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur-xl">
    <div className="bg-ink px-4 py-1.5 text-center text-[11px] text-slate-200"><div className="mx-auto flex max-w-7xl items-center justify-center gap-2"><span className="font-label rounded-full bg-danger px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">Urgent alert</span><p>National Cyber Crime Emergency: Dial <a className="font-semibold text-red-200 hover:underline" href="tel:1930">1930</a> immediately if money has been deducted <span className="mx-1 hidden text-white/30 sm:inline">|</span><span className="hidden text-blue-100 sm:inline">Free public protection utility for Indian citizens</span></p></div></div>
    <div className="container-shell flex h-[76px] items-center justify-between gap-4">
      <Link to="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white shadow-card"><ShieldCheck size={20} strokeWidth={2.5} /></span><span className="flex flex-col text-left"><span className="font-extrabold tracking-tight text-ink">ScamShield Bharat</span><span className="font-label -mt-1 text-[10px] text-muted">Citizen Safety Copilot</span></span></Link>
      <nav className="hidden items-center gap-5 xl:flex">{links.map((link) => <NavLink key={link.to} to={link.to} className={({ isActive }) => cn('font-label text-xs font-semibold transition-colors', isActive ? 'text-brand' : 'text-muted hover:text-ink')}>{link.label}</NavLink>)}</nav>
      <div className="flex items-center gap-2"><a className="hidden items-center gap-1.5 rounded-full bg-danger-soft px-3 py-2 font-label text-xs font-semibold text-danger-dark transition hover:opacity-90 sm:inline-flex" href="tel:1930"><PhoneCall size={14} />1930 Helpline</a><Link to="/check" className="btn-primary px-4 py-2.5 text-xs sm:px-5 sm:text-sm"><ShieldCheck size={15} />Check message</Link><span className="hidden h-8 w-8 items-center justify-center rounded-full bg-ink text-white sm:flex"><span className="font-label text-xs">SS</span></span></div>
    </div>
  </header>
}
