export interface TeacherSettings {
  theme: 'light' | 'dark' | 'system'
  language: 'English' | 'Spanish' | 'French' | 'German'
  emailNotifications: boolean
  flaggedPaperAlerts: boolean
  systemAnnouncements: boolean
  confidenceThreshold: number // percentage e.g. 75
  manualReviewThreshold: number // percentage e.g. 80
  autoFinalizeHighConfidence: boolean
  demoMode: boolean
}

export const DEFAULT_SETTINGS: TeacherSettings = {
  theme: 'dark',
  language: 'English',
  emailNotifications: true,
  flaggedPaperAlerts: true,
  systemAnnouncements: false,
  confidenceThreshold: 75,
  manualReviewThreshold: 80,
  autoFinalizeHighConfidence: true,
  demoMode: false,
}

export const settingsService = {
  async getSettings(): Promise<TeacherSettings> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const stored = localStorage.getItem('teacher_settings')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return DEFAULT_SETTINGS
      }
    }
    return DEFAULT_SETTINGS
  },

  async saveSettings(settings: TeacherSettings): Promise<TeacherSettings> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    localStorage.setItem('teacher_settings', JSON.stringify(settings))
    return settings
  },
}
