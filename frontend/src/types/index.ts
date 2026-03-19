export type Category = 'Produtivo' | 'Improdutivo'

export interface ClassifyResult {
  category: Category
  confidence: number
  topic: string
  urgency: 'Alta' | 'Média' | 'Baixa'
  suggested_reply: string
  processed_text: string
}

export interface HistoryItem {
  id: string
  timestamp: Date
  preview: string
  result: ClassifyResult
}

export interface BatchResultItem {
  filename: string
  result: ClassifyResult | null
  error: string | null
  status: 'pending' | 'processing' | 'done' | 'error'
}

export type InputMode = 'upload' | 'text'

export type ProcessingStep = {
  id: string
  label: string
  status: 'pending' | 'active' | 'done'
}
