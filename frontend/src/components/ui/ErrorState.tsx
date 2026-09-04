import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, WifiOff, ServerCrash, RefreshCw } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Button } from './Button'

export type ErrorStateType = 'network' | 'no-internet' | 'api-failure' | 'generic'

export interface ErrorStateProps {
  type?: ErrorStateType
  title?: string
  message?: string
  onRetry?: () => void
  isRetrying?: boolean
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = 'api-failure',
  title,
  message,
  onRetry,
  isRetrying = false,
  className,
}) => {
  const configs = {
    network: {
      icon: AlertTriangle,
      defaultTitle: 'Network Connection Timeout',
      defaultMsg: 'Unable to reach the Smart Grade Assistant gateway. Please check your network connection.',
    },
    'no-internet': {
      icon: WifiOff,
      defaultTitle: 'No Internet Connection',
      defaultMsg: 'You appear to be offline. Please verify your Wi-Fi or Ethernet connection and try again.',
    },
    'api-failure': {
      icon: ServerCrash,
      defaultTitle: 'Backend API Unreachable',
      defaultMsg: 'The FastAPI backend server returned an unexpected error or HTTP 503 response.',
    },
    generic: {
      icon: AlertTriangle,
      defaultTitle: 'An Unexpected Error Occurred',
      defaultMsg: 'Something went wrong while executing your request.',
    },
  }

  const config = configs[type] || configs.generic
  const IconComponent = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-red-200/80 dark:border-red-900/40 bg-red-50/40 dark:bg-red-950/20 shadow-sm max-w-lg mx-auto my-6',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-4 border border-red-200 dark:border-red-800">
        <IconComponent className="w-7 h-7" />
      </div>

      <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        {title || config.defaultTitle}
      </h4>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 mb-6 max-w-sm">
        {message || config.defaultMsg}
      </p>

      {onRetry && (
        <Button
          variant="danger"
          size="md"
          isLoading={isRetrying}
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Retry Connection
        </Button>
      )}
    </motion.div>
  )
}
