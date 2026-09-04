import React, { useState } from 'react'
import {
  HelpCircle,
  ShieldCheck,
  Cpu,
  ChevronDown,
  Mail,
  MessageSquare,
  Lock,
  FileCheck,
  Sparkles,
  Send,
  BookOpen,
} from 'lucide-react'
import { PermanentStorageBanner } from '../components/reports/PermanentStorageBanner'
import { Button } from '../components/ui/Button'
import { useNotifications } from '../contexts/NotificationContext'
import { cn } from '../utils/cn'

export const HelpPage: React.FC = () => {
  const { addNotification } = useNotifications()
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [contactSubject, setContactSubject] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const faqs = [
    {
      q: 'How does Smart Grade Assistant evaluate student submissions?',
      a: 'The frontend uploads student scans and rubrics to our secure backend API. Our backend processes OCR, maps student derivations against rubric evidence points, and returns an explainable JSON score breakdown with confidence indicators. No grading logic or prompts execute directly in the browser.',
    },
    {
      q: 'Is student identity protected during AI grading (DPDP 2023 alignment)?',
      a: 'Yes! Student names and personally identifiable information (PII) are NEVER sent to AI models or backend evaluators. Submissions are anonymized using cryptographically secure UUIDs (e.g. STU-A91F23) in alignment with India\'s Digital Personal Data Protection (DPDP) Act, 2023.',
    },
    {
      q: 'What happens when AI confidence falls below the institutional threshold?',
      a: 'If model decision confidence falls below your configured threshold (e.g. <75%), the submission is automatically flagged for Manual Review. Teachers can inspect evidence, review handwritten scans, and apply overrides with recorded audit comments.',
    },
    {
      q: 'Can I override AI grades?',
      a: 'Absolutely. Smart Grade Assistant provides full teacher control. When a teacher overrides marks, the system preserves both the original AI score and the teacher score, attaches a "Teacher Overridden" audit badge, and updates total scores instantly across all summary cards.',
    },
    {
      q: 'What is the Featherless.ai Integration Boundary?',
      a: 'Smart Grade Assistant enforces a strict architectural boundary. The web frontend NEVER communicates directly with Featherless.ai or third-party AI APIs. All requests route through our backend API, preventing API key exposure and ensuring strict DPDP 2023 data governance.',
    },
  ]

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setContactSubject('')
      setContactMessage('')
      addNotification({
        type: 'success',
        title: 'Support Ticket Submitted',
        message: 'Our institutional support team will respond within 24 hours.',
      })
    }, 600)
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <span>Help & Support Center</span>
          <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Documentation, DPDP 2023 alignment guidelines, AI evaluation workflows, and institutional support.
        </p>
      </div>

      {/* Permanent Storage UX Banner */}
      <PermanentStorageBanner />

      {/* SECTION 1: How AI Evaluation Works (Step-by-step workflow) */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            How AI Evaluation Works (Enterprise Workflow)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {[
            {
              step: '01',
              title: 'Teacher Upload',
              desc: 'Upload Question Paper, Rubric, and Student Answer Scans securely via frontend API.',
              icon: FileCheck,
            },
            {
              step: '02',
              title: 'UUID Anonymization',
              desc: 'Student names are stripped. Scans are bound strictly to anonymous UUID STU-A91F23.',
              icon: Lock,
            },
            {
              step: '03',
              title: 'Backend AI Scoring',
              desc: 'Backend API runs OCR & evidence matching against rubric points with decision confidence.',
              icon: Sparkles,
            },
            {
              step: '04',
              title: 'Teacher Control',
              desc: 'Inspect reasoning, challenge AI scoring, or override marks with recorded audit notes.',
              icon: ShieldCheck,
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.step}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    STEP {item.step}
                  </span>
                  <Icon className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{item.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* SECTION 2: Frequently Asked Questions (Accordion) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={cn('w-4 h-4 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* SECTION 3: DPDP 2023 & Privacy Guarantee Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900/90 to-slate-900 text-white shadow-md space-y-3">
        <div className="flex items-center gap-2 font-bold text-emerald-400 uppercase tracking-wider text-xs">
          <ShieldCheck className="w-5 h-5" />
          <span>DPDP 2023 Aligned Data Protection</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-4xl">
          Student data is handled using a privacy-first approach aligned with the principles of India's Digital Personal Data Protection (DPDP) Act, 2023. Student identities are anonymized using UUIDs before AI evaluation to protect personal information.
        </p>
      </div>

      {/* SECTION 4: Support Contact Form & About */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Form */}
        <div className="md:col-span-2 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Institutional Support Desk
            </h3>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                placeholder="e.g. Question regarding Rubric Evidence Matching..."
                className="w-full px-3.5 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Message / Description
              </label>
              <textarea
                required
                rows={4}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Describe your issue or feature request..."
                className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Submit Support Ticket
            </Button>
          </form>
        </div>

        {/* About Card */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            About Smart Grade
          </h3>
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <p>
              <strong>Smart Grade Assistant</strong> is an enterprise AI grading platform designed for universities and higher education institutions.
            </p>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 font-mono text-[11px]">
              <div>Version: 1.0.0-enterprise</div>
              <div>Build: 2026.09.04-prod</div>
              <div>Frontend: React 19 + TypeScript + Tailwind v4</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
