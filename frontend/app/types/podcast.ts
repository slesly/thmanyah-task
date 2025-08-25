export interface Podcast {
  id: number
  trackId: number
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
} 