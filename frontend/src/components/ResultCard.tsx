import { useState, useEffect, useRef } from 'react'
import { Check, Copy, AlertCircle, Bookmark, MessageSquare, HelpCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ClassifyResult } from '../types'

interface Props {
  result: ClassifyResult
}

export function ResultCard({ result }: Props) {
  const [copied, setCopied] = useState(false)
  const [editableReply, setEditableReply] = useState(result.suggested_reply)
  const isProductive = result.category === 'Produtivo'
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null)
  const [replyHeight, setReplyHeight] = useState<number | null>(null)
  const resizeDragRef = useRef<{ startY: number; startHeight: number } | null>(null)

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (!replyTextareaRef.current) return
    e.preventDefault()
    resizeDragRef.current = {
      startY: e.clientY,
      startHeight: replyTextareaRef.current.getBoundingClientRect().height,
    }
  }

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!resizeDragRef.current) return
      const delta = e.clientY - resizeDragRef.current.startY
      setReplyHeight(Math.max(120, resizeDragRef.current.startHeight + delta))
    }
    const onMouseUp = () => { resizeDragRef.current = null }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  useEffect(() => {
    setEditableReply(result.suggested_reply)
  }, [result])

  const accentVar = isProductive ? '--accent-productive' : '--accent-improductive'
  const accentColor = `rgb(var(${accentVar}))`
  const accentBg     = `rgb(var(${accentVar}) / 0.08)`
  const accentBorder = `rgb(var(${accentVar}) / 0.19)`

  const urgencyVar = { Alta: '--urgency-alta', Média: '--urgency-media', Baixa: '--urgency-baixa' }[result.urgency as 'Alta' | 'Média' | 'Baixa'] ?? '--urgency-baixa'
  const urgencyColor  = `rgb(var(${urgencyVar}))`
  const urgencyBg     = `rgb(var(${urgencyVar}) / 0.08)`
  const urgencyBorder = `rgb(var(${urgencyVar}) / 0.19)`

  const copyReply = async () => {
    await navigator.clipboard.writeText(editableReply)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-bg-surface border border-border-subtle rounded p-6 flex flex-col gap-6"
    >
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{
              backgroundColor: accentBg,
              color: accentColor,
              border: `1px solid ${accentBorder}`,
            }}
          >
            {result.category}
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-elevated border border-border-subtle text-xs font-medium text-text-secondary">
            <Bookmark size={12} className="text-text-muted" />
            {result.topic}
          </div>

          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: urgencyBg,
              color: urgencyColor,
              border: `1px solid ${urgencyBorder}`,
            }}
          >
            <AlertCircle size={12} />
            Urgência {result.urgency}
          </div>
        </div>

      {/* Confidence Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <p className="text-[10px] font-mono text-text-muted tracking-[0.18em] uppercase">
            Confiança
          </p>
          <span className="text-[10px] font-mono font-bold" style={{ color: accentColor }}>
            {Math.round(result.confidence * 100)}%
          </span>
          <div className="relative group/tip">
            <HelpCircle size={11} className="text-text-muted/50 hover:text-text-muted cursor-default transition-colors" />
            <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-56 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 z-10">
              <div className="bg-bg-surface border border-border-subtle rounded p-3 shadow-lg text-[10px] font-mono text-text-muted space-y-2">
                <p className="text-text-secondary font-semibold uppercase tracking-widest mb-1">O que significa?</p>
                <div className="flex gap-2">
                  <span className="text-[#4ADE80] font-bold shrink-0">≥ 90%</span>
                  <span>Alta confiança — o modelo está muito seguro da classificação</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-400 font-bold shrink-0">70–89%</span>
                  <span>Moderada — classificação provável, mas pode haver ambiguidade</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#FF5555] font-bold shrink-0">&lt; 70%</span>
                  <span>Baixa — resultado incerto, vale revisar manualmente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-1.5 w-full bg-bg-elevated rounded-full overflow-hidden border border-border-subtle">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.confidence * 100}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      </div>
      </div>

      <div className="h-px bg-border-subtle" />

      {/* Suggested reply section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={14} className="text-accent-lime" />
            <p className="text-[10px] font-mono text-text-muted tracking-[0.18em] uppercase">
              Sugestão de Resposta
            </p>
          </div>
          
          <button
            onClick={copyReply}
            className="group flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary bg-bg-elevated hover:bg-bg-surface border border-border-subtle rounded transition-colors"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 text-accent-productive"
                >
                  <Check size={13} />
                  <span>Copiado!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5"
                >
                  <Copy size={13} />
                  <span>Copiar</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        <div className="relative">
          <textarea
            ref={replyTextareaRef}
            value={editableReply}
            onChange={(e) => setEditableReply(e.target.value)}
            style={replyHeight ? { height: replyHeight } : undefined}
            className="w-full min-h-[140px] bg-bg-elevated/50 text-sm text-text-secondary leading-relaxed p-4 pb-6 rounded border border-border-subtle focus:border-accent-lime/30 focus:ring-1 focus:ring-accent-lime/20 outline-none transition-colors resize-none overflow-y-auto shadow-inner [scrollbar-gutter:stable]"
            placeholder="A resposta sugerida aparecerá aqui..."
          />
          <div
            onMouseDown={handleResizeMouseDown}
            className="absolute bottom-0 left-0 right-0 h-7 cursor-ns-resize select-none group/handle rounded-b"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512" style={{ transform: 'rotate(90deg)' }} className="absolute bottom-2 right-2 text-border-subtle group-hover/handle:text-border-default transition-colors duration-150"><path fill="none" stroke="currentColor" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="32" d="M304 96h112v112m-10.23-101.8L111.98 400.02M208 416H96V304"/></svg>
          </div>
        </div>
      </div>

    </motion.div>
  )
}
