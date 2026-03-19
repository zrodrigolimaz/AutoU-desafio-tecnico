import { Clock } from 'lucide-react'
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
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <Clock size={14} className="text-text-muted" />
        <p className="text-xs font-mono text-text-muted leading-relaxed">
          O histórico da sessão<br />aparecerá aqui
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col divide-y divide-border-subtle">
      {items.map(item => {
        const isProductive = item.result.category === 'Produtivo'
        const accentHex = isProductive ? '#4ADE80' : '#FF5555'
        const pct = Math.round(item.result.confidence * 100)

        return (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="flex flex-col gap-1.5 py-3 text-left group hover:bg-bg-elevated transition-colors duration-150 px-1 -mx-1"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[10px] font-mono font-medium tracking-wider uppercase"
                style={{ color: accentHex }}
              >
                {item.result.category}
              </span>
              <span className="text-[10px] font-mono text-text-muted tabular-nums">
                {pct}% · {formatTime(item.timestamp)}
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed line-clamp-2 group-hover:text-text-secondary transition-colors">
              {item.preview}…
            </p>
          </button>
        )
      })}
    </div>
  )
}
