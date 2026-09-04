import React, { useState, useEffect } from 'react'
import {
  ShieldCheck,
  Save,
  CheckCircle2,
  User,
  Building,
  Lock,
  Moon,
  Sun,
  Globe,
  Bell,
  Sliders,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { PrivacyBadge } from '../components/ui/PrivacyBadge'
import { PermanentStorageBanner } from '../components/reports/PermanentStorageBanner'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useNotifications } from '../contexts/NotificationContext'
import { settingsService, TeacherSettings } from '../services/settingsService'

export const SettingsPage: React.FC = () => {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { addNotification } = useNotifications()

  const [settings, setSettings] = useState<TeacherSettings>({
    theme: theme,
    language: 'English',
    emailNotifications: true,
    flaggedPaperAlerts: true,
    systemAnnouncements: false,
    confidenceThreshold: 75,
    manualReviewThreshold: 80,
    autoFinalizeHighConfidence: true,
    demoMode: true,
  })

  const [evaluatorName, setEvaluatorName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [institution, setInstitution] = useState(user.institution)
  const [department, setDepartment] = useState(user.department)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      const stored = await settingsService.getSettings()
      setSettings(stored)
    }
    fetchSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await settingsService.saveSettings(settings)

    setTimeout(() => {
      setIsSubmitting(false)
      addNotification({
        type: 'success',
        title: 'Settings Saved',
        message: 'Your institutional preferences and AI thresholds have been updated.',
      })
    }, 400)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Institutional & Evaluator Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage evaluator credentials, confidence thresholds, notification preferences, and DPDP 2023 privacy alignment rules.
        </p>
      </div>

      {/* Permanent Storage UX Banner */}
      <PermanentStorageBanner />

      {/* Privacy DPDP 2023 Badge */}
      <PrivacyBadge variant="banner" />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Evaluator Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <CardTitle>Evaluator Profile</CardTitle>
            </div>
            <CardDescription>
              Your personal information as recorded on student evaluation audit trails.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={evaluatorName}
                onChange={(e) => setEvaluatorName(e.target.value)}
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Institutional Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <CardTitle>Institutional Details</CardTitle>
            </div>
            <CardDescription>
              University and department configuration for institutional analytics.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="University / Institution"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              />
              <Input
                label="Academic Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance & Language */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <CardTitle>Appearance & Localization</CardTitle>
            </div>
            <CardDescription>
              Interface dark mode, theme, and language preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 text-xs">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 block text-sm">
                  Dark Mode Theme
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  Switch between high-contrast dark mode and clean light mode.
                </span>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold transition-colors"
              >
                {theme === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <span>{theme === 'dark' ? 'Dark Mode Active' : 'Light Mode Active'}</span>
              </button>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>Interface Language</span>
              </label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value as any })}
                className="app-select w-full md:w-64"
              >
                <option value="English">English (United States)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="French">French (Français)</option>
                <option value="German">German (Deutsch)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* AI Confidence & Threshold Controls */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <CardTitle>AI Thresholds & Automation Rules</CardTitle>
            </div>
            <CardDescription>
              Configure default confidence levels for flagging papers and auto-finalizing scores.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-xs">
            {/* Confidence Threshold Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-900 dark:text-slate-100">
                  Default AI Confidence Threshold ({settings.confidenceThreshold}%)
                </label>
                <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                  {settings.confidenceThreshold}% Minimum
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={settings.confidenceThreshold}
                onChange={(e) => setSettings({ ...settings, confidenceThreshold: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Student papers with evaluation confidence below {settings.confidenceThreshold}% are automatically routed to Manual Review.
              </p>
            </div>

            {/* Manual Review Threshold Slider */}
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-900 dark:text-slate-100">
                  Manual Review Trigger Threshold ({settings.manualReviewThreshold}%)
                </label>
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                  {settings.manualReviewThreshold}% Flag Point
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="95"
                step="5"
                value={settings.manualReviewThreshold}
                onChange={(e) => setSettings({ ...settings, manualReviewThreshold: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">
                    Auto-Finalize High Confidence Evaluations
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Automatically approve evaluations with confidence &gt;95% without manual intervention.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSettings({ ...settings, autoFinalizeHighConfidence: !settings.autoFinalizeHighConfidence })
                  }
                  className="text-blue-600 dark:text-blue-400"
                >
                  {settings.autoFinalizeHighConfidence ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">
                    Enterprise Demo Mode Switch
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Pre-populate realistic mock evaluations, reports, and analytics without a backend.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, demoMode: !settings.demoMode })}
                  className="text-blue-600 dark:text-blue-400"
                >
                  {settings.demoMode ? (
                    <ToggleRight className="w-8 h-8 text-blue-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <CardTitle>Notification Preferences</CardTitle>
            </div>
            <CardDescription>
              Configure alert preferences for completed evaluations and flagged papers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email summaries when evaluations finish processing.' },
              { key: 'flaggedPaperAlerts', label: 'Flagged Paper Alerts', desc: 'Get notified immediately when papers require manual review.' },
              { key: 'systemAnnouncements', label: 'System Announcements', desc: 'Updates on AI model enhancements and DPDP 2023 alignment standards.' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-1">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">{item.label}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">{item.desc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={(settings as any)[item.key]}
                  onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Save Actions Required by Prompt */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  )
}
