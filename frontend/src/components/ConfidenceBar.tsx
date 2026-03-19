import { useEffect, useState } from 'react'
import type { Category } from '../types'

interface Props {
  confidence: number
  category: Category
}

export function ConfidenceBar({ confidence, category }: Props) {
  const [width, setWidth] = useState(0)
  const pct = Math.round(confidence * 100)
  const color = category === 'Produtivo' ? '#4ADE80' : '#FF5555'

  useEffect(() => {
    const timer = setTimeout(() => setWidth(pct), 80)
    return () => clearTimeout(timer)
  }, [pct])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-mono text-text-muted tracking-[0.15em] uppercase">
          Confiança
        </span>
        <span className="text-sm font-mono font-medium tabular-nums" style={{ color }}>
          {pct}%
        </span>
      </div>
      <div className="h-1 bg-bg-elevated overflow-hidden rounded-sm">
        <div
          className="h-full confidence-fill"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
