import { useState, useEffect } from 'react'
import { Check, Copy, AlertCircle, Bookmark, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ClassifyResult } from '../types'

interface Props {
  result: ClassifyResult
}

export function ResultCard({ result }: Props) {
  const [copied, setCopied] = useState(false)
  const [editableReply, setEditableReply] = useState(result.suggested_reply)
  const isProductive = result.category === 'Produtivo'

  useEffect(() => {
    setEditableReply(result.suggested_reply)
  }, [result])

  const accentVar = isProductive ? '--accent-productive' : '--accent-improductive'
  const accentColor = `rgb(var(${accentVar}))`
  const accentBg     = `rgb(var(${accentVar}) / 0.08)`
  const accentBorder = `rgb(var(${accentVar}) / 0.19)`

  const urgencyVar = { Alta: '--urgency-alta', Média: '--urgency-media', Baixa: '--urgency-baixa' }[result.urgency as 'Alta' | 'Média' | 'Baixa'] ?? '--urgency-baixa'
  const urgencyColor  = `rgb(var(${urgencyVar}))`
  const urgencyBg     = `rgb(var(${urgencyVar}) / 0.08)`
  const urgencyBorder = `rgb(var(${urgencyVar}) / 0.19)`

  const copyReply = async () => {
    await navigator.clipboard.writeText(editableReply)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass glass-border rounded-xl p-6 flex flex-col gap-6 shadow-2xl"
    >
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{
              backgroundColor: accentBg,
              color: accentColor,
              border: `1px solid ${accentBorder}`,
            }}
          >
            {result.category}
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-text-secondary">
            <Bookmark size={12} className="text-text-muted" />
            {result.topic}
          </div>

          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: urgencyBg,
              color: urgencyColor,
              border: `1px solid ${urgencyBorder}`,
            }}
          >
            <AlertCircle size={12} />
            Urgência {result.urgency}
          </div>
        </div>

      {/* Confidence Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <p className="text-[10px] font-mono text-text-muted tracking-[0.18em] uppercase">
            Confiança
          </p>
          <span className="text-[10px] font-mono font-bold" style={{ color: accentColor }}>
            {Math.round(result.confidence * 100)}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.confidence * 100}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      </div>
      </div>

      <div className="h-px bg-white/5" />

      {/* Suggested reply section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={14} className="text-accent-lime" />
            <p className="text-[10px] font-mono text-text-muted tracking-[0.18em] uppercase">
              — Sugestão de Resposta
            </p>
          </div>
          
          <button
            onClick={copyReply}
            className="group flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 text-accent-productive"
                >
                  <Check size={13} />
                  <span>Copiado!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5"
                >
                  <Copy size={13} />
                  <span>Copiar</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        <div className="relative group">
          <textarea
            value={editableReply}
            onChange={(e) => setEditableReply(e.target.value)}
            className="w-full min-h-[140px] bg-bg-elevated/50 text-sm text-text-secondary leading-relaxed p-4 rounded-xl border border-border-subtle focus:border-accent-lime/30 focus:ring-1 focus:ring-accent-lime/20 outline-none transition-all resize-y shadow-inner"
            placeholder="A resposta sugerida aparecerá aqui..."
          />
          <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="text-[9px] font-mono text-text-muted uppercase">Editável</span>
          </div>
        </div>
      </div>

      {/* Processed text preview */}
      {result.processed_text && (
        <details className="group cursor-pointer">
          <summary className="text-[10px] font-mono text-text-muted hover:text-text-secondary transition-colors select-none">
            LOG DE PRÉ-PROCESSAMENTO (NLP)
          </summary>
          <div className="mt-4 bg-bg-elevated rounded-lg p-4 border border-border-subtle">
            <p className="text-[11px] font-mono text-text-muted/80 leading-relaxed italic">
              {result.processed_text}
            </p>
          </div>
        </details>
      )}
    </motion.div>
  )
}
