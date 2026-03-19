import { useState, useCallback } from 'react'
import { classifyEmail } from '../lib/api'
import type { BatchResultItem, ClassifyResult, HistoryItem, ProcessingStep } from '../types'

const INITIAL_STEPS: ProcessingStep[] = [
  { id: 'extract', label: 'Extraindo texto do email', status: 'pending' },
  { id: 'preprocess', label: 'Pré-processando com NLP', status: 'pending' },
  { id: 'classify', label: 'Classificando com IA', status: 'pending' },
  { id: 'reply', label: 'Gerando resposta automática', status: 'pending' },
]

export function useClassify() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ClassifyResult | null>(null)
  const [batchResults, setBatchResults] = useState<BatchResultItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [steps, setSteps] = useState<ProcessingStep[]>(INITIAL_STEPS)
  const [history, setHistory] = useState<HistoryItem[]>([])

  const advanceStep = (stepId: string) => {
    setSteps(prev =>
      prev.map(s => {
        if (s.id === stepId) return { ...s, status: 'active' }
        const stepIndex = prev.findIndex(x => x.id === stepId)
        const sIndex = prev.findIndex(x => x.id === s.id)
        if (sIndex < stepIndex) return { ...s, status: 'done' }
        return s
      })
    )
  }

  const completeSteps = () => {
    setSteps(prev => prev.map(s => ({ ...s, status: 'done' })))
  }

  const addToHistory = (preview: string, data: ClassifyResult) => {
    const item: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      preview: preview.slice(0, 80),
      result: data,
    }
    setHistory(prev => [item, ...prev].slice(0, 20))
  }

  const classify = useCallback(async (payload: { file?: File; text?: string }, preview: string) => {
    setLoading(true)
    setResult(null)
    setBatchResults([])
    setError(null)
    setSteps(INITIAL_STEPS)

    try {
      advanceStep('extract')
      await sleep(600)
      advanceStep('preprocess')
      await sleep(700)
      advanceStep('classify')

      const data = await classifyEmail(payload)

      advanceStep('reply')
      await sleep(400)
      completeSteps()
      await sleep(300)

      setResult(data)
      addToHistory(preview, data)
    } catch (err) {
      const detail = (err as any)?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Erro ao processar o email. Verifique a conexão com o servidor.')
      setSteps(INITIAL_STEPS)
    } finally {
      setLoading(false)
    }
  }, [])

  const classifyBatch = useCallback(async (files: File[]) => {
    setLoading(true)
    setResult(null)
    setError(null)
    setSteps(INITIAL_STEPS)
    setBatchResults(files.map(f => ({
      filename: f.name,
      result: null,
      error: null,
      status: 'pending',
    })))

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      setBatchResults(prev =>
        prev.map((item, idx) => idx === i ? { ...item, status: 'processing' } : item)
      )

      try {
        const data = await classifyEmail({ file })
        setBatchResults(prev =>
          prev.map((item, idx) => idx === i ? { ...item, result: data, status: 'done' } : item)
        )
        addToHistory(file.name, data)
      } catch (err) {
        const detail = (err as any)?.response?.data?.detail
        setBatchResults(prev =>
          prev.map((item, idx) => idx === i ? { ...item, error: typeof detail === 'string' ? detail : 'Erro ao processar arquivo.', status: 'error' } : item)
        )
      }
    }

    setLoading(false)
  }, [])

  return { loading, result, batchResults, error, steps, history, classify, classifyBatch }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
