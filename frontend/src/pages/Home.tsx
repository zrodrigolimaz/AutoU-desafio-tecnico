import { useState } from 'react'
import { Mail, Zap, Shield, Clock } from 'lucide-react'
import { EmailInput } from '../components/EmailInput'
import { ProcessingSteps } from '../components/ProcessingSteps'
import { ResultCard } from '../components/ResultCard'
import { HistoryList } from '../components/HistoryList'
import { useClassify } from '../hooks/useClassify'
import type { HistoryItem } from '../types'

const STATS = [
  { icon: Zap, label: 'Classificação', value: 'Instantânea' },
  { icon: Shield, label: 'Categorias', value: '2 tipos' },
  { icon: Clock, label: 'Formatos', value: '.txt / .pdf' },
]

export function Home() {
  const { loading, result, error, steps, history, classify } = useClassify()
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null)

  const displayResult = selectedHistory?.result ?? result

  const handleSubmit = (payload: { file?: File; text?: string }, preview: string) => {
    setSelectedHistory(null)
    classify(payload, preview)
  }

  return (
    <div className="min-h-screen bg-bg-base bg-dot-grid">
      {/* Radial gradient overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(45,124,246,0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col gap-12">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center">
              <Mail size={14} className="text-accent-blue" />
            </div>
            <span className="font-mono text-sm text-text-muted tracking-wider uppercase">
              Meridian
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border-subtle bg-bg-surface">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-productive animate-pulse" />
            <span className="text-xs font-mono text-text-muted">Sistema ativo</span>
          </div>
        </header>

        {/* Hero */}
        <section className="flex flex-col gap-6 max-w-2xl">
          <div className="flex flex-col gap-4">
            <h1
              className="font-display text-5xl font-light leading-tight tracking-tight text-text-primary"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              Inteligência na leitura{' '}
              <em className="not-italic text-text-muted">de cada email.</em>
            </h1>
            <p className="text-base text-text-secondary leading-relaxed max-w-xl">
              Classifique emails financeiros em{' '}
              <span className="text-accent-productive font-medium">Produtivo</span> ou{' '}
              <span className="text-accent-improductive font-medium">Improdutivo</span>{' '}
              com IA — e receba sugestões de resposta automáticas em segundos.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex gap-4">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-surface border border-border-subtle"
              >
                <Icon size={13} className="text-text-muted" />
                <span className="text-xs text-text-muted">{label}:</span>
                <span className="text-xs text-text-secondary font-medium">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">

          {/* Left: Input + Result */}
          <div className="flex flex-col gap-5">
            {/* Input card */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6">
              <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-5">
                Email para análise
              </p>
              <EmailInput onSubmit={handleSubmit} disabled={loading} />
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Processing steps */}
            {loading && <ProcessingSteps steps={steps} />}

            {/* Result */}
            {!loading && displayResult && (
              <ResultCard result={displayResult} />
            )}
          </div>

          {/* Right: History sidebar */}
          <aside className="bg-bg-surface border border-border-subtle rounded-2xl p-5 lg:sticky lg:top-6">
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">
              Histórico da sessão
            </p>
            <HistoryList
              items={history}
              onSelect={item => setSelectedHistory(item)}
            />
          </aside>
        </div>

        {/* Footer */}
        <footer className="text-center">
          <p className="text-xs font-mono text-text-muted/40">
            Meridian · Desafio Técnico AutoU · NLP via Hugging Face
          </p>
        </footer>
      </div>
    </div>
  )
}
