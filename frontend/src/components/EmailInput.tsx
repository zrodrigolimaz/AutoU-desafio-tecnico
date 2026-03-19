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
      <div className="flex gap-0 border border-border-subtle rounded w-fit overflow-hidden">
        {(['text', 'upload'] as InputMode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wide transition-all duration-150 ${
              mode === m
                ? 'bg-bg-elevated text-text-primary'
                : 'text-text-muted hover:text-text-secondary bg-transparent'
            }`}
          >
            {m === 'text' ? (
              <>
                <FileText size={12} />
                Colar texto
              </>
            ) : (
              <>
                <Upload size={12} />
                Upload
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
          className="w-full bg-bg-elevated border border-border-subtle rounded p-4 text-sm font-sans text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-border-default transition-colors duration-150 disabled:opacity-40"
        />
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 h-48 rounded border-2 border-dashed transition-all duration-150 cursor-pointer ${
            dragOver
              ? 'border-accent-lime bg-accent-lime/[0.03]'
              : file
              ? 'border-border-default bg-bg-elevated cursor-default'
              : 'border-border-subtle bg-bg-elevated hover:border-border-default'
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
              <div className="flex items-center gap-3 px-4 py-2.5 bg-bg-surface border border-border-subtle rounded">
                <FileText size={15} className="text-accent-lime" />
                <span className="text-sm text-text-primary font-medium truncate max-w-[200px]">{file.name}</span>
                <button
                  onClick={e => { e.stopPropagation(); setFile(null) }}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
              <p className="text-xs font-mono text-text-muted">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 bg-bg-surface border border-border-subtle rounded flex items-center justify-center">
                <Upload size={16} className="text-text-muted" />
              </div>
              <div className="text-center">
                <p className="text-sm text-text-secondary">
                  Arraste um arquivo ou{' '}
                  <span className="text-accent-lime">clique para selecionar</span>
                </p>
                <p className="text-xs font-mono text-text-muted mt-1">.txt ou .pdf — até 5 MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`flex items-center justify-center gap-2 w-full py-3 rounded font-display font-bold text-sm tracking-wide transition-all duration-200 ${
          canSubmit
            ? 'bg-accent-lime text-bg-base hover:brightness-90'
            : 'bg-bg-elevated text-text-muted cursor-not-allowed'
        }`}
      >
        {disabled ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-bg-base/30 border-t-bg-base rounded-full animate-spin" />
            Analisando...
          </span>
        ) : (
          <>
            Analisar Email
            <ArrowRight size={14} strokeWidth={2.5} />
          </>
        )}
      </button>
    </div>
  )
}
