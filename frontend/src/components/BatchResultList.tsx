import { Loader2, FileText, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { ResultCard } from './ResultCard'
import type { BatchResultItem } from '../types'

interface Props {
  items: BatchResultItem[]
}

export function BatchResultList({ items }: Props) {
  const done = items.filter(i => i.status === 'done').length
  const total = items.length

  return (
    <div className="flex flex-col gap-4">
      {/* Progress header */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-mono text-text-muted tracking-[0.18em] uppercase">
          — Análise em lote
        </p>
        <span className="text-[10px] font-mono text-text-muted">
          {done}/{total} concluídos
        </span>
      </div>

      {/* Result items */}
      {items.map((item, i) => (
        <motion.div
          key={item.filename}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="flex flex-col gap-2"
        >
          {/* File label */}
          <div className="flex items-center gap-2">
            <FileText size={11} className="text-text-muted flex-shrink-0" />
            <span className="text-[10px] font-mono text-text-muted truncate">{item.filename}</span>
            {item.status === 'processing' && (
              <Loader2 size={11} className="animate-spin text-accent-lime flex-shrink-0" />
            )}
            {item.status === 'pending' && (
              <span className="text-[10px] font-mono text-text-muted/50">aguardando...</span>
            )}
          </div>

          {/* Content */}
          {item.status === 'done' && item.result && (
            <ResultCard result={item.result} />
          )}

          {item.status === 'processing' && (
            <div className="glass glass-border rounded-xl p-5 flex items-center gap-3">
              <Loader2 size={14} className="animate-spin text-accent-lime flex-shrink-0" />
              <span className="text-sm text-text-muted">Classificando com IA...</span>
            </div>
          )}

          {item.status === 'pending' && (
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-border-default flex-shrink-0" />
              <span className="text-sm text-text-muted/50">Na fila</span>
            </div>
          )}

          {item.status === 'error' && (
            <div className="flex items-center gap-2 px-4 py-3 rounded border border-accent-improductive/20 bg-accent-improductive/5 text-sm text-accent-improductive">
              <AlertCircle size={13} />
              {item.error}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
