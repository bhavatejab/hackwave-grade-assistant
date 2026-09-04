import React, { useState } from 'react'
import { EmptyState, EmptyStateType } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'

export const EmptyStatesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EmptyStateType>('evaluations')

  const tabs: { label: string; type: EmptyStateType }[] = [
    { label: 'No Evaluations', type: 'evaluations' },
    { label: 'No Reports', type: 'reports' },
    { label: 'No Manual Reviews', type: 'reviews' },
    { label: 'No Analytics', type: 'analytics' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Empty State Illustrations Showcase
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Enterprise zero-data views designed for graceful user guidance.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {tabs.map((tab) => (
          <Button
            key={tab.type}
            variant={activeTab === tab.type ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab.type)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="pt-4">
        <EmptyState
          type={activeTab}
          onAction={() => alert(`Triggered primary action for ${activeTab}`)}
          secondaryActionLabel="Learn More"
          onSecondaryAction={() => alert('Viewing documentation')}
        />
      </div>
    </div>
  )
}
