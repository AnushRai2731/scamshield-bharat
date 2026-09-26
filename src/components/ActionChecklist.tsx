import { Check, CircleOff } from 'lucide-react'

export function ActionChecklist({ doItems, dontItems }: { doItems: string[]; dontItems: string[] }) {
  return <div className="grid gap-5 md:grid-cols-2">
    <div className="rounded-3xl border border-red-100 bg-danger-soft p-6 shadow-critical">
      <div className="mb-5 flex items-center gap-2 text-danger-dark"><CircleOff size={19} /><h3 className="font-semibold">Don’t</h3></div>
      <ul className="space-y-3 text-sm leading-6 text-red-950/75">{dontItems.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />{item}</li>)}</ul>
    </div>
    <div className="rounded-3xl border border-emerald-100 bg-success-soft p-6 shadow-safe">
      <div className="mb-5 flex items-center gap-2 text-success-dark"><Check size={19} /><h3 className="font-semibold">Do</h3></div>
      <ol className="space-y-3 text-sm leading-6 text-emerald-950/75">{doItems.map((item, index) => <li key={item} className="flex gap-3"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-success-dark">{index + 1}</span>{item}</li>)}</ol>
    </div>
  </div>
}
