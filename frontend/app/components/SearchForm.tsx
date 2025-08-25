'use client'

import { useState } from 'react'

interface SearchFormProps {
  onSearch: (searchTerm: string) => void
  loading: boolean
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    onSearch(searchTerm.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="flex gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for podcasts (e.g., فنجان, Thmanyah, etc.)"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !searchTerm.trim()}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  )
} 