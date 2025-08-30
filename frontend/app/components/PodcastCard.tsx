'use client'

import { Podcast } from '../types/podcast'

interface PodcastCardProps {
  podcast: Podcast
  variant?: 'default' | 'compact'
}

function getAccentColor(name: string): string {
  const colors = [
    'text-accent-pink',
    'text-accent-purple', 
    'text-accent-blue',
    'text-accent-cyan',
    'text-accent-teal',
    'text-accent-green',
    'text-accent-yellow',
    'text-accent-orange',
    'text-accent-red'
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export default function PodcastCard({ podcast, variant = 'default' }: PodcastCardProps) {
  const accentColor = getAccentColor(podcast.trackName)
  const bgAccentColor = accentColor.replace('text-', 'bg-')
  
  const formatDate = (dateString?: string): string => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleCardClick = () => {
    if (podcast.trackViewUrl) {
      window.open(podcast.trackViewUrl, '_blank', 'noopener,noreferrer')
    }
  }

  if (variant === 'compact') {
    return (
      <div 
        className="group relative bg-card border border-border rounded-lg overflow-hidden card-hover shadow-sm cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Accent indicator */}
        <div className={`absolute top-0 left-0 w-1 h-full ${bgAccentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}></div>
        
        {/* Artwork */}
        <div className="relative aspect-square bg-light-100">
          {podcast.artworkUrl100 ? (
            <img
              src={podcast.artworkUrl100.replace('100x100', '600x600')}
              alt={podcast.trackName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-8 h-8 text-light-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
          )}
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-accent-blue" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Podcast title */}
          <h3 className="font-semibold text-card-foreground mb-1 line-clamp-2 group-hover:text-accent-blue transition-colors duration-200 text-sm" suppressHydrationWarning>
            {podcast.trackName}
          </h3>
          
          {/* Artist */}
          <p className="text-light-500 text-xs mb-2 line-clamp-1" suppressHydrationWarning>
            {podcast.artistName}
          </p>
          
          {/* Genre and track count */}
          <div className="flex items-center justify-between text-xs text-light-400">
            {podcast.primaryGenreName && (
              <span className="line-clamp-1" suppressHydrationWarning>{podcast.primaryGenreName}</span>
            )}
            {podcast.trackCount && (
              <span>{podcast.trackCount} حلقة</span>
            )}
          </div>
        </div>
        
        {/* Gradient bottom border on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      </div>
    )
  }

  return (
    <div className="group relative bg-card border border-border rounded-lg overflow-hidden card-hover shadow-sm">
      {/* Accent indicator */}
      <div className={`absolute top-0 left-0 w-1 h-full ${bgAccentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}></div>
      
      {/* Artwork */}
      <div 
        className="relative aspect-square bg-light-100 cursor-pointer"
        onClick={handleCardClick}
      >
        {podcast.artworkUrl100 ? (
          <img
            src={podcast.artworkUrl100.replace('100x100', '600x600')}
            alt={podcast.trackName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-light-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-accent-blue" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Podcast title */}
        <h3 
          className="font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-accent-blue transition-colors duration-200 cursor-pointer"
          onClick={handleCardClick}
          suppressHydrationWarning
        >
          {podcast.trackName}
        </h3>
        
        {/* Artist */}
        <p className="text-light-500 text-sm mb-3 line-clamp-1" suppressHydrationWarning>
          {podcast.artistName}
        </p>
        
        {/* Genre and track count */}
        <div className="flex items-center justify-between text-xs text-light-400 mb-3">
          {podcast.primaryGenreName && (
            <span suppressHydrationWarning>{podcast.primaryGenreName}</span>
          )}
          {podcast.trackCount && (
            <span>{podcast.trackCount} حلقة</span>
          )}
        </div>
        
        {/* Release date */}
        {podcast.releaseDate && (
          <p className="text-light-400 text-xs mb-3">
            {formatDate(podcast.releaseDate)}
          </p>
        )}
        
        {/* Description preview */}
        {podcast.description && (
          <p className="text-light-500 text-sm line-clamp-2 mb-4">
            {podcast.description.replace(/<[^>]*>/g, '')}
          </p>
        )}
        
        {/* Links */}
        <div className="flex items-center gap-2">
          {podcast.trackViewUrl && (
            <a
              href={podcast.trackViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue hover:text-accent-blue/80 text-sm font-medium transition-colors duration-200"
            >
              عرض البودكاست
            </a>
          )}
          {podcast.feedUrl && (
            <a
              href={podcast.feedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-light-500 hover:text-light-600 text-sm transition-colors duration-200"
            >
              RSS Feed
            </a>
          )}
        </div>
      </div>
      
      {/* Gradient bottom border on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    </div>
  )
} 