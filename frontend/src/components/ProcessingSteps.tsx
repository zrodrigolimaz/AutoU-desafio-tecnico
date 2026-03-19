import { Check, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import type { ProcessingStep } from '../types'

interface Props {
  steps: ProcessingStep[]
}

export function ProcessingSteps({ steps }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Steps List */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 shadow-sm">
        <p className="text-[10px] font-mono text-text-muted tracking-[0.18em] uppercase mb-5">
          — Pipeline de Análise
        </p>
        <div className="flex flex-col gap-0">
          {steps.map((step, index) => (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 border flex items-center justify-center flex-shrink-0 transition-all duration-400 rounded-lg ${
                    step.status === 'done'
                      ? 'bg-accent-productive border-accent-productive text-bg-base'
                      : step.status === 'active'
                      ? 'bg-accent-lime/10 border-accent-lime text-accent-lime'
                      : 'bg-white/5 border-border-subtle text-text-muted'
                  }`}
                >
                  {step.status === 'done' ? (
                    <Check size={11} strokeWidth={3} />
                  ) : step.status === 'active' ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : (
                    <span className="w-1.5 h-1.5 bg-current rounded-full" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-px flex-1 my-1 transition-all duration-500 min-h-[22px] ${
                      step.status === 'done' ? 'bg-accent-productive/20' : 'bg-border-subtle'
                    }`}
                  />
                )}
              </div>

              <div className="pb-5">
                <p
                  className={`text-sm font-medium transition-all duration-300 ${
                    step.status === 'done'
                      ? 'text-text-muted'
                      : step.status === 'active'
                      ? 'text-text-primary'
                      : 'text-text-muted'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skeleton Result Loader */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass glass-border rounded-xl p-6 flex flex-col gap-6 animate-pulse"
      >
        <div className="flex items-center gap-3">
          <div className="w-24 h-6 bg-white/10 rounded-full" />
          <div className="w-32 h-6 bg-white/5 rounded-full" />
          <div className="w-20 h-6 bg-white/5 rounded-full" />
        </div>
        
        <div className="h-px bg-white/5" />
        
        <div className="flex flex-col gap-4">
          <div className="w-1/3 h-3 bg-white/5 rounded" />
          <div className="space-y-3">
            <div className="w-full h-4 bg-white/10 rounded" />
            <div className="w-full h-4 bg-white/10 rounded" />
            <div className="w-2/3 h-4 bg-white/10 rounded" />
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="w-24 h-4 bg-white/5 rounded" />
          <div className="w-16 h-8 bg-white/10 rounded-lg" />
        </div>
      </motion.div>
    </div>
  )
}
