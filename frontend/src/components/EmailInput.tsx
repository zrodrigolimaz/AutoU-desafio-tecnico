import { useCallback, useRef, useState } from 'react'
import { Upload, FileText, X, ArrowRight, Files } from 'lucide-react'
import type { InputMode } from '../types'

interface Props {
  onSubmit: (payload: { file?: File; text?: string }, preview: string) => void
  onSubmitBatch: (files: File[]) => void
  disabled: boolean
}

export function EmailInput({ onSubmit, onSubmitBatch, disabled }: Props) {
  const [mode, setMode] = useState<InputMode>('text')
  const [text, setText] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addFiles = (incoming: File[]) => {
    const allowed = ['text/plain', 'application/pdf']
    const valid = incoming.filter(f => allowed.includes(f.type))
    if (valid.length < incoming.length) alert('Alguns arquivos ignorados. Use apenas .txt ou .pdf')
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.name))
      return [...prev, ...valid.filter(f => !existing.has(f.name))]
    })
  }

  const removeFile = (name: string) => {
    setFiles(prev => prev.filter(f => f.name !== name))
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    addFiles(Array.from(e.dataTransfer.files))
  }, [])

  const handleSubmit = () => {
    if (mode === 'text' && text.trim()) {
      onSubmit({ text: text.trim() }, text.trim())
    } else if (mode === 'upload' && files.length === 1) {
      onSubmit({ file: files[0] }, files[0].name)
    } else if (mode === 'upload' && files.length > 1) {
      onSubmitBatch(files)
    }
  }

  const canSubmit =
    !disabled && (mode === 'text' ? text.trim().length > 10 : files.length > 0)

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
        <div className="flex flex-col gap-3">
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-3 h-36 rounded border-2 border-dashed transition-all duration-150 cursor-pointer ${
              dragOver
                ? 'border-accent-lime bg-accent-lime/[0.03]'
                : 'border-border-subtle bg-bg-elevated hover:border-border-default'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf"
              multiple
              className="hidden"
              onChange={e => { if (e.target.files) addFiles(Array.from(e.target.files)) }}
            />
            <div className="w-9 h-9 bg-bg-surface border border-border-subtle rounded flex items-center justify-center">
              <Files size={15} className="text-text-muted" />
            </div>
            <div className="text-center">
              <p className="text-sm text-text-secondary">
                Arraste arquivos ou{' '}
                <span className="text-accent-lime">clique para selecionar</span>
              </p>
              <p className="text-xs font-mono text-text-muted mt-1">.txt ou .pdf — múltiplos permitidos</p>
            </div>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {files.map(f => (
                <div
                  key={f.name}
                  className="flex items-center gap-3 px-3 py-2 bg-bg-elevated border border-border-subtle rounded"
                >
                  <FileText size={13} className="text-accent-lime flex-shrink-0" />
                  <span className="text-xs text-text-primary font-medium truncate flex-1">{f.name}</span>
                  <span className="text-[10px] font-mono text-text-muted flex-shrink-0">
                    {(f.size / 1024).toFixed(1)} KB
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); removeFile(f.name) }}
                    className="text-text-muted hover:text-text-primary transition-colors flex-shrink-0"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`flex items-center justify-center gap-2 w-full py-3 rounded font-display font-bold text-sm tracking-wide transition-all duration-200 ${
          canSubmit
            ? 'bg-text-primary text-bg-base hover:bg-white transition-colors'
            : 'bg-bg-elevated text-text-muted cursor-not-allowed'
        }`}
      >
        {disabled ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-bg-base/30 border-t-bg-base rounded-full animate-spin" />
            Analisando...
          </span>
        ) : mode === 'upload' && files.length > 1 ? (
          <>
            <Files size={14} strokeWidth={2.5} />
            Analisar {files.length} emails
          </>
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
