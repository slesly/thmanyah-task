import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios'

/**
 * API utility class for handling requests with cancellation support
 */
export class ApiClient {
  private static instance: ApiClient
  private cancelTokens: Map<string, CancelTokenSource> = new Map()

  private constructor() {}

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }
    return ApiClient.instance
  }

  /**
   * Cancel a pending request by key
   * @param key - Unique key for the request
   */
  cancelRequest(key: string): void {
    const cancelToken = this.cancelTokens.get(key)
    if (cancelToken) {
      cancelToken.cancel('Request cancelled')
      this.cancelTokens.delete(key)
    }
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests(): void {
    this.cancelTokens.forEach((cancelToken) => {
      cancelToken.cancel('All requests cancelled')
    })
    this.cancelTokens.clear()
  }

  /**
   * Make a GET request with cancellation support
   * @param url - Request URL
   * @param config - Axios config
   * @param key - Unique key for cancellation
   * @returns Promise with response data
   */
  async get<T = any>(
    url: string,
    config: AxiosRequestConfig = {},
    key?: string
  ): Promise<T> {
    // Cancel previous request if key is provided
    if (key) {
      this.cancelRequest(key)
    }

    // Create new cancel token
    const cancelTokenSource = axios.CancelToken.source()
    if (key) {
      this.cancelTokens.set(key, cancelTokenSource)
    }

    try {
      const response = await axios.get<T>(url, {
        ...config,
        cancelToken: cancelTokenSource.token,
      })

      // Remove cancel token after successful request
      if (key) {
        this.cancelTokens.delete(key)
      }

      return response.data
    } catch (error) {
      // Remove cancel token after error
      if (key) {
        this.cancelTokens.delete(key)
      }

      // Re-throw error if it's not a cancellation
      if (!axios.isCancel(error)) {
        throw error
      }
      
      // Return empty result for cancelled requests
      return {} as T
    }
  }

  /**
   * Make a POST request with cancellation support
   * @param url - Request URL
   * @param data - Request data
   * @param config - Axios config
   * @param key - Unique key for cancellation
   * @returns Promise with response data
   */
  async post<T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {},
    key?: string
  ): Promise<T> {
    // Cancel previous request if key is provided
    if (key) {
      this.cancelRequest(key)
    }

    // Create new cancel token
    const cancelTokenSource = axios.CancelToken.source()
    if (key) {
      this.cancelTokens.set(key, cancelTokenSource)
    }

    try {
      const response = await axios.post<T>(url, data, {
        ...config,
        cancelToken: cancelTokenSource.token,
      })

      // Remove cancel token after successful request
      if (key) {
        this.cancelTokens.delete(key)
      }

      return response.data
    } catch (error) {
      // Remove cancel token after error
      if (key) {
        this.cancelTokens.delete(key)
      }

      // Re-throw error if it's not a cancellation
      if (!axios.isCancel(error)) {
        throw error
      }
      
      // Return empty result for cancelled requests
      return {} as T
    }
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance()

/**
 * Hook for making API requests with automatic cancellation
 * @param baseURL - Base URL for API requests
 * @returns Object with request methods
 */
export function useApi(baseURL: string = 'http://localhost:3001') {
  const makeRequest = async <T>(
    endpoint: string,
    params?: Record<string, any>,
    key?: string
  ): Promise<T> => {
    const url = `${baseURL}${endpoint}`
    const config: AxiosRequestConfig = {}
    
    if (params) {
      config.params = params
    }

    return apiClient.get<T>(url, config, key)
  }

  return {
    get: makeRequest,
    search: (query: string, key?: string) => 
      makeRequest<Podcast[]>('/api/search', { q: query }, key),
    getRecent: (key?: string) => 
      makeRequest<Podcast[]>('/api/search/recent', undefined, key),
  }
}

// Type for podcast data
export interface Podcast {
  id: string
  trackName: string
  artistName: string
  description?: string
  artworkUrl100?: string
  trackViewUrl?: string
  feedUrl?: string
  releaseDate?: string
}
