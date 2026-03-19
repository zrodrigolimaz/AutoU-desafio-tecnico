import { Check, Loader2 } from 'lucide-react'
import type { ProcessingStep } from '../types'

interface Props {
  steps: ProcessingStep[]
}

export function ProcessingSteps({ steps }: Props) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
      <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-5">
        Processando
      </p>
      <div className="flex flex-col gap-0">
        {steps.map((step, index) => (
          <div key={step.id} className="flex gap-3">
            {/* Connector + Icon */}
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                  step.status === 'done'
                    ? 'bg-accent-productive border-accent-productive text-white'
                    : step.status === 'active'
                    ? 'bg-accent-blue/10 border-accent-blue text-accent-blue'
                    : 'bg-bg-elevated border-border-subtle text-text-muted'
                }`}
              >
                {step.status === 'done' ? (
                  <Check size={13} strokeWidth={2.5} />
                ) : step.status === 'active' ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-px flex-1 my-1 transition-all duration-500 min-h-[20px] ${
                    step.status === 'done' ? 'bg-accent-productive/30' : 'bg-border-subtle'
                  }`}
                />
              )}
            </div>

            {/* Label */}
            <div className="pb-5">
              <p
                className={`text-sm transition-all duration-300 ${
                  step.status === 'done'
                    ? 'text-text-secondary line-through'
                    : step.status === 'active'
                    ? 'text-text-primary font-medium'
                    : 'text-text-muted'
                }`}
                style={{
                  animation: step.status === 'active' ? 'step-reveal 0.4s ease-out forwards' : undefined,
                }}
              >
                {step.label}
              </p>
              {step.status === 'active' && (
                <div className="flex gap-1 mt-2">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="w-1 h-1 rounded-full bg-accent-blue animate-pulse-dot"
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
