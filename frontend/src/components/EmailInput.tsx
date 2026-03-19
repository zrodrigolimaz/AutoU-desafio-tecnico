import { useCallback, useRef, useState } from 'react'
import { Upload, FileText, X, ArrowRight } from 'lucide-react'
import type { InputMode } from '../types'

interface Props {
  onSubmit: (payload: { file?: File; text?: string }, preview: string) => void
  disabled: boolean
}

export function EmailInput({ onSubmit, disabled }: Props) {
  const [mode, setMode] = useState<InputMode>('text')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    const allowed = ['text/plain', 'application/pdf']
    if (!allowed.includes(f.type)) {
      alert('Formato inválido. Use .txt ou .pdf')
      return
    }
    setFile(f)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [])

  const handleSubmit = () => {
    if (mode === 'text' && text.trim()) {
      onSubmit({ text: text.trim() }, text.trim())
    } else if (mode === 'upload' && file) {
      onSubmit({ file }, file.name)
    }
  }

  const canSubmit =
    !disabled && (mode === 'text' ? text.trim().length > 10 : file !== null)

  return (
    <div className="flex flex-col gap-5">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-bg-surface rounded-lg border border-border-subtle w-fit">
        {(['text', 'upload'] as InputMode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              mode === m
                ? 'bg-bg-elevated text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {m === 'text' ? (
              <>
                <FileText size={14} />
                Colar texto
              </>
            ) : (
              <>
                <Upload size={14} />
                Upload de arquivo
              </>
            )}
          </button>
        ))}
      </div>

      {/* Input area */}
      {mode === 'text' ? (
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={disabled}
          placeholder="Cole o conteúdo do email aqui..."
          rows={9}
          className="w-full bg-bg-surface border border-border-subtle rounded-xl p-4 text-sm font-sans text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-accent-blue transition-colors duration-200 disabled:opacity-50"
        />
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 h-52 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
            dragOver
              ? 'border-accent-blue bg-accent-blue/5'
              : file
              ? 'border-border-default bg-bg-surface cursor-default'
              : 'border-border-subtle bg-bg-surface hover:border-border-default hover:bg-bg-elevated'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
          {file ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3 bg-bg-elevated rounded-lg border border-border-default">
                <FileText size={18} className="text-accent-blue" />
                <span className="text-sm text-text-primary font-medium truncate max-w-[200px]">{file.name}</span>
                <button
                  onClick={e => { e.stopPropagation(); setFile(null) }}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-xs text-text-muted">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-bg-elevated border border-border-default flex items-center justify-center">
                <Upload size={20} className="text-text-muted" />
              </div>
              <div className="text-center">
                <p className="text-sm text-text-secondary">
                  Arraste um arquivo ou{' '}
                  <span className="text-accent-blue">clique para selecionar</span>
                </p>
                <p className="text-xs text-text-muted mt-1">.txt ou .pdf — até 5 MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
          canSubmit
            ? 'bg-accent-blue text-white hover:bg-blue-500 shadow-lg shadow-accent-blue/20 hover:shadow-accent-blue/30'
            : 'bg-bg-elevated text-text-muted cursor-not-allowed'
        }`}
      >
        {disabled ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analisando...
          </span>
        ) : (
          <>
            Analisar Email
            <ArrowRight size={15} />
          </>
        )}
      </button>
    </div>
  )
}
