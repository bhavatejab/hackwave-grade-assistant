import React, { useState } from 'react'
import { ErrorState, ErrorStateType } from '../components/ui/ErrorState'
import { Button } from '../components/ui/Button'

export const ErrorStatesPage: React.FC = () => {
  const [activeError, setActiveError] = useState<ErrorStateType>('network')
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = () => {
    setIsRetrying(true)
    setTimeout(() => {
      setIsRetrying(false)
    }, 1200)
  }

  const errors: { label: string; type: ErrorStateType }[] = [
    { label: 'Network Error', type: 'network' },
    { label: 'No Internet Connection', type: 'no-internet' },
    { label: 'Backend API Failure', type: 'api-failure' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Error State Component Showcase
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Resilient system error handling and reconnect UI states.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {errors.map((err) => (
          <Button
            key={err.type}
            variant={activeError === err.type ? 'danger' : 'outline'}
            size="sm"
            onClick={() => setActiveError(err.type)}
          >
            {err.label}
          </Button>
        ))}
      </div>

      <div className="pt-4">
        <ErrorState
          type={activeError}
          onRetry={handleRetry}
          isRetrying={isRetrying}
        />
      </div>
    </div>
  )
}
