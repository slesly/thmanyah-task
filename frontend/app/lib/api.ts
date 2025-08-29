import { SearchResult, PodbaySearchResponse } from '../types/podcast'

// API Configuration with fallbacks
const getApiBaseUrl = () => {
  // Priority order: environment variable > production URL > localhost
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }

  // Check if we're in production (Amplify)
  if (typeof window !== 'undefined' && window.location.hostname.includes('amplifyapp.com')) {
    return 'https://agd9mkwapi.us-east-1.awsapprunner.com'
  }

  // Check if we're in production (Vercel or other hosting)
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    return 'https://agd9mkwapi.us-east-1.awsapprunner.com'
  }

  // Default to localhost for development
  return 'http://localhost:3001'
}

const API_BASE_URL = getApiBaseUrl()

// Simple in-memory cache
const searchCache = new Map<string, { data: SearchResult[], timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function checkApiHealth(): Promise<any> {
  try {
    console.log('Checking API health at:', `${API_BASE_URL}/health`)

    const response = await fetch(`${API_BASE_URL}/health`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('API Health:', data)
    return data
  } catch (error) {
    console.error('API Health Check Error:', error)
    throw new Error(`API health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function searchPodcasts(searchTerm: string): Promise<SearchResult[]> {
  const trimmedTerm = searchTerm.trim()
  
  // Check cache first
  const cached = searchCache.get(trimmedTerm)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  
  try {
    console.log('Searching with API URL:', `${API_BASE_URL}/search?q=${encodeURIComponent(trimmedTerm)}`)
    
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(trimmedTerm)}`, {
      next: { revalidate: 60 }, // Cache for 1 minute
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      console.error('API Response not OK:', response.status, response.statusText)
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }
    
    const rawData = await response.json()
    console.log('API Response:', rawData)
    
    // Expect backend to return the exact format we need
    // Backend should fetch from iTunes and return: { podcasts: [...], episodes: [...] }
    let data: SearchResult[] = []
    
    if (rawData && typeof rawData === 'object' && 'podcasts' in rawData && 'episodes' in rawData) {
      const podbayResponse = rawData as PodbaySearchResponse
      
      // Backend should have already processed and categorized the data
      // We just combine the arrays
      data = [...podbayResponse.podcasts, ...podbayResponse.episodes]
    } else if (Array.isArray(rawData)) {
      // Fallback: if backend returns array directly
      data = rawData
    } else {
      console.warn('Unexpected API response format:', rawData)
      throw new Error('Invalid API response format')
    }
    
    // Cache the result
    searchCache.set(trimmedTerm, {
      data,
      timestamp: Date.now()
    })
    
    return data
  } catch (error) {
    console.error('Search API Error:', error)
    throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getRecentSearches(): Promise<SearchResult[]> {
  try {
    console.log('Fetching recent searches from:', `${API_BASE_URL}/recent`)
    
    const response = await fetch(`${API_BASE_URL}/recent`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      console.error('Recent API Response not OK:', response.status, response.statusText)
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }
    
    const rawData = await response.json()
    console.log('Recent API Response:', rawData)
    
    let data: SearchResult[] = []
    
    // Expect backend to return the exact format we need
    if (rawData && typeof rawData === 'object' && 'podcasts' in rawData && 'episodes' in rawData) {
      const podbayResponse = rawData as PodbaySearchResponse
      
      // Backend should have already processed and categorized the data
      data = [...podbayResponse.podcasts, ...podbayResponse.episodes]
    } else if (Array.isArray(rawData)) {
      // Fallback: if backend returns array directly
      data = rawData
    } else {
      console.warn('Unexpected recent API response format:', rawData)
      throw new Error('Invalid API response format')
    }
    
    return data
  } catch (error) {
    console.error('Recent Searches API Error:', error)
    throw new Error(`Failed to load recent searches: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
