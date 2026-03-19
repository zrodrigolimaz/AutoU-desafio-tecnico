import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { ConfidenceBar } from './ConfidenceBar'
import type { ClassifyResult } from '../types'

interface Props {
  result: ClassifyResult
}

export function ResultCard({ result }: Props) {
  const [copied, setCopied] = useState(false)
  const isProductive = result.category === 'Produtivo'

  const accentHex = isProductive ? '#4ADE80' : '#FF5555'

  const copyReply = async () => {
    await navigator.clipboard.writeText(result.suggested_reply)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={`rounded border border-border-subtle bg-bg-surface p-6 flex flex-col gap-5 animate-fade-up`}
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
          <p className="text-[10px] font-mono text-text-muted tracking-[0.18em] uppercase">
            — Resposta sugerida
          </p>
          <button
            onClick={copyReply}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-text-muted hover:text-text-secondary border border-border-subtle hover:border-border-default rounded transition-all duration-150"
          >
            {copied ? (
              <>
                <Check size={11} className="text-accent-productive" />
                Copiado
              </>
            ) : (
              <>
                <Copy size={11} />
                Copiar
              </>
            )}
          </button>
        </div>
        <div className="bg-bg-elevated rounded p-4 border border-border-subtle">
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
            {result.suggested_reply}
          </p>
        </div>
      </div>

      {/* Processed text preview */}
      {result.processed_text && (
        <details className="group">
          <summary className="text-xs font-mono text-text-muted cursor-pointer hover:text-text-secondary transition-colors select-none">
            ver texto pré-processado ↓
          </summary>
          <div className="mt-2 bg-bg-base rounded p-3 border border-border-subtle">
            <p className="text-xs font-mono text-text-muted leading-relaxed break-all">
              {result.processed_text}
            </p>
          </div>
        </details>
      )}
    </div>
  )
}
