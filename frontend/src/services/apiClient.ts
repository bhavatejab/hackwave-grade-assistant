import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { env } from '../utils/env'

export interface ApiErrorResponse {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: string
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: env.API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client-Version': '1.0.0-enterprise',
  },
})

// Request Interceptor: Attach Auth Bearer token if present
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token') || 'mock-enterprise-jwt-token'
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Centralized Error Normalizer
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status

    if (status === 401) {
      console.warn('[ApiClient] 401 Unauthorized - Token expired or invalid')
    } else if (status === 403) {
      console.warn('[ApiClient] 403 Forbidden - Insufficient permissions')
    } else if (status === 404) {
      console.warn('[ApiClient] 404 Not Found')
    } else if (status && status >= 500) {
      console.error('[ApiClient] 500 Server Error - Internal server failure')
    } else if (error.code === 'ECONNABORTED') {
      console.error('[ApiClient] Network Request Timeout')
    }

    return Promise.reject(error)
  }
)
