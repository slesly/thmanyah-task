// Base interface for Podbay API response items
export interface PodbayItem {
  _id: string
  trackId?: number
  trackName: string
  artistName: string
  collectionName?: string
  artworkUrl100?: string
  artworkUrl600?: string
  description?: string
  releaseDate?: string
  trackCount?: number
  primaryGenreName?: string
  country?: string
  feedUrl?: string
  trackViewUrl?: string
  collectionViewUrl?: string
  artistViewUrl?: string
  previewUrl?: string
  trackPrice?: number
  collectionPrice?: number
  currency?: string
  contentAdvisoryRating?: string
  isExplicit?: boolean
  searchTerm?: string
  createdAt: string
  updatedAt: string
  // Episode-specific fields
  episodeUrl?: string
  episodeContentType?: string
  episodeFileExtension?: string
  episodeGuid?: string
  episodeLength?: number
  episodeNumber?: number
  seasonNumber?: number
}

export interface Podcast extends PodbayItem {
  kind: 'podcast'
  wrapperType: 'track'
  trackCount?: number
  feedUrl?: string
}

export interface Episode extends PodbayItem {
  kind: 'episode'
  wrapperType: 'track'
  collectionName: string // Episodes must have a collection name (podcast name)
  episodeUrl?: string
  episodeContentType?: string
  episodeFileExtension?: string
  episodeGuid?: string
  episodeLength?: number
  episodeNumber?: number
  seasonNumber?: number
}

export type SearchResult = Podcast | Episode

// Podbay API response structure
export interface PodbaySearchResponse {
  podcasts: Podcast[]
  episodes: Episode[]
} 