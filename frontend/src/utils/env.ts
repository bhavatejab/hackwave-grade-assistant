export interface EnvironmentConfig {
  API_BASE_URL: string
  FEATHERLESS_BOUNDARY_ENABLED: boolean
  DEMO_MODE_DEFAULT: boolean
  ENV_MODE: 'development' | 'production' | 'test'
  API_TIMEOUT_MS: number
}

export const env: EnvironmentConfig = {
  API_BASE_URL: (import.meta.env.VITE_API_BASE_URL as string) || 'http://127.0.0.1:8000',
  FEATHERLESS_BOUNDARY_ENABLED: true, // Frontend NEVER calls Featherless directly
  DEMO_MODE_DEFAULT: false,
  ENV_MODE: (import.meta.env.MODE as 'development' | 'production' | 'test') || 'development',
  API_TIMEOUT_MS: 45000,
}
