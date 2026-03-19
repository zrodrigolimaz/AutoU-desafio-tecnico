import { useState } from 'react'
import { EmailInput } from '../components/EmailInput'
import { ProcessingSteps } from '../components/ProcessingSteps'
import { ResultCard } from '../components/ResultCard'
import { HistoryList } from '../components/HistoryList'
import { useClassify } from '../hooks/useClassify'
import type { HistoryItem } from '../types'

export function Home() {
  const { loading, result, error, steps, history, classify } = useClassify()
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null)

  const displayResult = selectedHistory?.result ?? result

  const handleSubmit = (payload: { file?: File; text?: string }, preview: string) => {
    setSelectedHistory(null)
    classify(payload, preview)
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">

        {/* Header */}
        <header className="flex items-end justify-between border-b border-border-subtle pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-accent-lime/10 border border-accent-lime/30 flex items-center justify-center">
                <span className="font-mono text-xs font-bold text-accent-lime">M</span>
              </div>
              <span className="font-mono text-sm text-text-muted tracking-wider uppercase">
                Meridian
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-lime animate-pulse-dot" />
            <span className="text-[10px] font-mono text-text-muted tracking-[0.15em] uppercase">
              Sistema Ativo
            </span>
          </div>
        </header>

        {/* Hero */}
        <section className="flex flex-col gap-4">
          <h1
            className="font-display text-5xl font-light leading-tight tracking-tight text-text-primary"
            style={{ fontVariationSettings: '"opsz" 72' }}
          >
            Inteligência na leitura{' '}
            <em className="not-italic text-text-muted">de cada email.</em>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed max-w-lg">
            Classifique emails financeiros em{' '}
            <span className="text-accent-productive font-medium">Produtivo</span> ou{' '}
            <span className="text-accent-improductive font-medium">Improdutivo</span>{' '}
            com IA — e receba sugestões de resposta automáticas em segundos.
          </p>
        </section>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 items-start">

          {/* Left: Input + Result */}
          <div className="flex flex-col gap-4">
            {/* Input card */}
            <div className="bg-bg-surface border border-border-subtle rounded p-6">
              <p className="text-[10px] font-mono text-text-muted tracking-[0.18em] uppercase mb-5">
                — Email para análise
              </p>
              <EmailInput onSubmit={handleSubmit} disabled={loading} />
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded border border-accent-improductive/20 bg-accent-improductive/5 text-sm text-accent-improductive">
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
          <aside className="bg-bg-surface border border-border-subtle rounded p-5 lg:sticky lg:top-6">
            <p className="text-[10px] font-mono text-text-muted tracking-[0.18em] uppercase mb-4">
              — Histórico da sessão
            </p>
            <HistoryList
              items={history}
              onSelect={item => setSelectedHistory(item)}
            />
          </aside>
        </div>

        {/* Footer */}
        <footer className="border-t border-border-subtle pt-5 text-center">
          <p className="text-[10px] font-mono text-text-muted/40 tracking-widest uppercase">
            Meridian · Desafio Técnico AutoU · IA via Google Gemini
          </p>
        </footer>
      </div>
    </div>
  )
}
