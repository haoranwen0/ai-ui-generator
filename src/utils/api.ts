import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// Define base URLs for different environments
const BASE_URLS: Record<string, string> = {
  development: 'http://127.0.0.1:5001/ai-ui-generator/us-central1/main',
  production: 'https://main-bswhekwola-uc.a.run.app'
}

// Determine the current environment
const environment: string = process.env.NODE_ENV || 'development'

// Create an axios instance with the base URL
const api: AxiosInstance = axios.create({
  baseURL: BASE_URLS[environment]
})

// Generic type for API responses
type ApiResponse<T> = Promise<AxiosResponse<T>>

// Helper function to make GET requests
export const get = <T>(
  path: string,
  config?: AxiosRequestConfig
): ApiResponse<T> => {
  return api.get<T>(path, config)
}

// Helper function to make PATCH requests
export const patch = <T>(
  path: string,
  data?: any,
  config?: AxiosRequestConfig
): ApiResponse<T> => {
  return api.patch<T>(path, data, config)
}

// Helper function to make POST requests
export const post = <T>(
  path: string,
  data?: any,
  config?: AxiosRequestConfig
): ApiResponse<T> => {
  return api.post<T>(path, data, config)
}

// Helper function to make PUT requests
export const put = <T>(
  path: string,
  data?: any,
  config?: AxiosRequestConfig
): ApiResponse<T> => {
  return api.put<T>(path, data, config)
}

// Helper function to make DELETE requests
export const del = <T>(
  path: string,
  config?: AxiosRequestConfig
): ApiResponse<T> => {
  return api.delete<T>(path, config)
}

export default api
