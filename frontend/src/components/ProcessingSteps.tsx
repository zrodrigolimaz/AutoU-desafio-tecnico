import { Check, Loader2 } from 'lucide-react'
import type { ProcessingStep } from '../types'

interface Props {
  steps: ProcessingStep[]
}

export function ProcessingSteps({ steps }: Props) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded p-5">
      <p className="text-[10px] font-mono text-text-muted tracking-[0.18em] uppercase mb-5">
        — Processando
      </p>
      <div className="flex flex-col gap-0">
        {steps.map((step, index) => (
          <div key={step.id} className="flex gap-3">
            {/* Connector + Icon */}
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 border flex items-center justify-center flex-shrink-0 transition-all duration-400 rounded-sm ${
                  step.status === 'done'
                    ? 'bg-accent-productive border-accent-productive text-bg-base'
                    : step.status === 'active'
                    ? 'bg-bg-elevated border-accent-lime text-accent-lime'
                    : 'bg-bg-elevated border-border-subtle text-text-muted'
                }`}
              >
                {step.status === 'done' ? (
                  <Check size={11} strokeWidth={3} />
                ) : step.status === 'active' ? (
                  <Loader2 size={11} className="animate-spin" />
                ) : (
                  <span className="w-1 h-1 bg-current rounded-full" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-px flex-1 my-1 transition-all duration-500 min-h-[20px] ${
                    step.status === 'done' ? 'bg-accent-productive/20' : 'bg-border-subtle'
                  }`}
                />
              )}
            </div>

            {/* Label */}
            <div className="pb-5">
              <p
                className={`text-sm font-mono transition-all duration-300 ${
                  step.status === 'done'
                    ? 'text-text-muted line-through'
                    : step.status === 'active'
                    ? 'text-text-primary'
                    : 'text-text-muted'
                }`}
                style={{
                  animation: step.status === 'active' ? 'step-reveal 0.3s ease-out forwards' : undefined,
                }}
              >
                {step.label}
              </p>
              {step.status === 'active' && (
                <div className="flex gap-1 mt-2">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="w-1 h-1 bg-accent-lime animate-pulse-dot"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
