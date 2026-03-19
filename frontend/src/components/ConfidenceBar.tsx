import { useEffect, useState } from 'react'
import type { Category } from '../types'

interface Props {
  confidence: number
  category: Category
}

export function ConfidenceBar({ confidence, category }: Props) {
  const [width, setWidth] = useState(0)
  const pct = Math.round(confidence * 100)
  const color = category === 'Produtivo' ? '#10B981' : '#F59E0B'

  useEffect(() => {
    const timer = setTimeout(() => setWidth(pct), 100)
    return () => clearTimeout(timer)
  }, [pct])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-text-muted font-mono uppercase tracking-wider">
          Confiança da classificação
        </span>
        <span className="text-sm font-mono font-medium" style={{ color }}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
        <div
          className="h-full rounded-full confidence-fill"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
