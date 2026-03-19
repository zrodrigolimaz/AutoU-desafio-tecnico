import { Clock, TrendingUp, TrendingDown } from 'lucide-react'
import type { HistoryItem } from '../types'

interface Props {
  items: HistoryItem[]
  onSelect: (item: HistoryItem) => void
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function HistoryList({ items, onSelect }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border-subtle flex items-center justify-center">
          <Clock size={16} className="text-text-muted" />
        </div>
        <p className="text-xs text-text-muted leading-relaxed">
          O histórico da sessão<br />aparecerá aqui
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map(item => {
        const isProductive = item.result.category === 'Produtivo'
        const accentHex = isProductive ? '#10B981' : '#F59E0B'
        const pct = Math.round(item.result.confidence * 100)

        return (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="flex flex-col gap-2 p-3 rounded-lg border border-border-subtle bg-bg-surface hover:bg-bg-elevated hover:border-border-default transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between gap-2">
              <div
                className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ color: accentHex, backgroundColor: `${accentHex}15` }}
              >
                {isProductive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {item.result.category}
              </div>
              <span className="text-xs font-mono text-text-muted">
                {pct}%
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed line-clamp-2 group-hover:text-text-secondary transition-colors">
              {item.preview}…
            </p>
            <span className="text-xs font-mono text-text-muted/60">
              {formatTime(item.timestamp)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
