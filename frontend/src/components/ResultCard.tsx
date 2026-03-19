import { useState } from 'react'
import { Check, Copy, TrendingUp, TrendingDown } from 'lucide-react'
import { ConfidenceBar } from './ConfidenceBar'
import type { ClassifyResult } from '../types'

interface Props {
  result: ClassifyResult
}

export function ResultCard({ result }: Props) {
  const [copied, setCopied] = useState(false)
  const isProductive = result.category === 'Produtivo'

  const accentHex = isProductive ? '#10B981' : '#F59E0B'
  const glowClass = isProductive ? 'glow-productive' : 'glow-improductive'

  const copyReply = async () => {
    await navigator.clipboard.writeText(result.suggested_reply)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={`rounded-xl border bg-bg-surface p-6 flex flex-col gap-5 animate-fade-up ${glowClass}`}
      style={{ borderColor: `${accentHex}30` }}
    >
      {/* Category badge */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
          style={{
            backgroundColor: `${accentHex}15`,
            color: accentHex,
            border: `1px solid ${accentHex}30`,
          }}
        >
          {isProductive ? (
            <TrendingUp size={14} strokeWidth={2} />
          ) : (
            <TrendingDown size={14} strokeWidth={2} />
          )}
          {result.category}
        </div>
        <span className="text-xs text-text-muted">
          {isProductive
            ? 'Este email requer uma ação ou resposta'
            : 'Este email não requer ação imediata'}
        </span>
      </div>

      {/* Confidence bar */}
      <ConfidenceBar confidence={result.confidence} category={result.category} />

      {/* Divider */}
      <div className="h-px bg-border-subtle" />

      {/* Suggested reply */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono text-text-muted uppercase tracking-wider">
            Resposta sugerida
          </p>
          <button
            onClick={copyReply}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-text-muted hover:text-text-secondary border border-border-subtle hover:border-border-default transition-all duration-200"
          >
            {copied ? (
              <>
                <Check size={12} className="text-accent-productive" />
                Copiado
              </>
            ) : (
              <>
                <Copy size={12} />
                Copiar
              </>
            )}
          </button>
        </div>
        <div className="bg-bg-elevated rounded-lg p-4 border border-border-subtle">
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
            {result.suggested_reply}
          </p>
        </div>
      </div>

      {/* Processed text preview */}
      {result.processed_text && (
        <details className="group">
          <summary className="text-xs text-text-muted cursor-pointer hover:text-text-secondary transition-colors select-none font-mono">
            Ver texto pré-processado
          </summary>
          <div className="mt-2 bg-bg-base rounded-lg p-3 border border-border-subtle">
            <p className="text-xs font-mono text-text-muted leading-relaxed break-all">
              {result.processed_text}
            </p>
          </div>
        </details>
      )}
    </div>
  )
}
