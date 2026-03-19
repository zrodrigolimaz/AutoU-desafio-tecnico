import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { EmailInput } from '../components/EmailInput'
import { ProcessingSteps } from '../components/ProcessingSteps'
import { ResultCard } from '../components/ResultCard'
import { BatchResultList } from '../components/BatchResultList'
import { HistoryList } from '../components/HistoryList'
import { useClassify } from '../hooks/useClassify'
import type { HistoryItem } from '../types'
import type { Theme } from '../hooks/useTheme'

interface Props {
  theme: Theme
  toggleTheme: () => void
}

export function Home({ theme, toggleTheme }: Props) {
  const { loading, result, batchResults, error, steps, history, classify, classifyBatch } = useClassify()
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null)

  const displayResult = selectedHistory?.result ?? result
  const isBatch = batchResults.length > 0

  const handleSubmit = (payload: { file?: File; text?: string }, preview: string) => {
    setSelectedHistory(null)
    classify(payload, preview)
  }

  const handleSubmitBatch = (files: File[]) => {
    setSelectedHistory(null)
    classifyBatch(files)
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">

        {/* Header */}
        <header className="flex items-end justify-between border-b border-border-subtle pb-6">
          <div>
            <span className="font-mono text-sm text-text-primary tracking-wide">
              Meridian
            </span>
          </div>
          <div className="flex items-center gap-4 mb-0.5">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-7 h-7 rounded-lg border border-border-subtle bg-bg-surface text-text-muted hover:text-text-primary hover:border-border-default transition-colors"
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            </button>
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
                Email para análise
              </p>
              <EmailInput
                onSubmit={handleSubmit}
                onSubmitBatch={handleSubmitBatch}
                disabled={loading}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded border border-accent-improductive/20 bg-accent-improductive/5 text-sm text-accent-improductive">
                {error}
              </div>
            )}

            {/* Processing steps — single mode only */}
            {loading && !isBatch && <ProcessingSteps steps={steps} />}

            {/* Single result */}
            {!loading && !isBatch && displayResult && (
              <ResultCard result={displayResult} />
            )}

            {/* Batch results */}
            {isBatch && <BatchResultList items={batchResults} />}
          </div>

          {/* Right: History sidebar */}
          <aside className="bg-bg-surface border border-border-subtle rounded p-5 lg:sticky lg:top-6">
            <p className="text-[10px] font-mono text-text-muted tracking-[0.18em] uppercase mb-4">
              Histórico da sessão
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
