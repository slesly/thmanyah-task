'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import SearchForm from './components/SearchForm'
import PodcastCard from './components/PodcastCard'
import { Podcast } from './types/podcast'

export default function Home() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recentSearches, setRecentSearches] = useState<Podcast[]>([])
  const [currentSearchTerm, setCurrentSearchTerm] = useState('')

  const API_BASE_URL = 'http://localhost:3001'

  useEffect(() => {
    loadRecentSearches()
  }, [])

  const loadRecentSearches = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/search/recent`)
      setRecentSearches(response.data)
    } catch (error) {
      console.error('Error loading recent searches:', error)
    }
  }

  const handleSearch = async (searchTerm: string) => {
    setLoading(true)
    setError('')
    setCurrentSearchTerm(searchTerm)

    try {
      const response = await axios.get(`${API_BASE_URL}/api/search`, {
        params: { q: searchTerm }
      })
      setPodcasts(response.data)
      loadRecentSearches() // Refresh recent searches
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to search podcasts')
      setPodcasts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Thmanyah" className="h-8 w-auto" />
              <p className="text-gray-600 hidden sm:block">iTunes Podcast Search</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="mb-8">
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Search Results */}
        {podcasts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Search Results for "{currentSearchTerm}" ({podcasts.length} podcasts)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {podcasts.map((podcast) => (
                <PodcastCard key={podcast.id} podcast={podcast} />
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && !podcasts.length && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Recent Searches
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentSearches.slice(0, 6).map((podcast) => (
                <PodcastCard key={podcast.id} podcast={podcast} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && podcasts.length === 0 && recentSearches.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No podcasts found</h3>
            <p className="text-gray-600">Try searching for a podcast to get started.</p>
          </div>
        )}
      </main>
    </div>
  )
} 