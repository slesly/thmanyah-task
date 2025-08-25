'use client'

import { Podcast } from '../types/podcast'

interface PodcastCardProps {
  podcast: Podcast
}

export default function PodcastCard({ podcast }: PodcastCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return ''
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <img
            src={podcast.artworkUrl100 || '/placeholder-podcast.svg'}
            alt={podcast.trackName}
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.src = '/placeholder-podcast.svg'
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {podcast.trackName}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {podcast.artistName}
            </p>
            {podcast.collectionName && (
              <p className="text-sm text-gray-500 mb-2">
                {podcast.collectionName}
              </p>
            )}
            {podcast.primaryGenreName && (
              <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mb-2">
                {podcast.primaryGenreName}
              </span>
            )}
            {podcast.description && (
              <p className="text-sm text-gray-600 line-clamp-3">
                {truncateText(podcast.description, 120)}
              </p>
            )}
            {podcast.releaseDate && (
              <p className="text-xs text-gray-500 mt-2">
                Released: {formatDate(podcast.releaseDate)}
              </p>
            )}
            {podcast.searchTerm && (
              <p className="text-xs text-gray-500">
                Searched for: "{podcast.searchTerm}"
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          {podcast.trackViewUrl && (
            <a
              href={podcast.trackViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View on iTunes
            </a>
          )}
          {podcast.feedUrl && (
            <a
              href={podcast.feedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              RSS Feed
            </a>
          )}
        </div>
      </div>
    </div>
  )
} 