import { SearchResult, PodbaySearchResponse } from '../types/podcast'

// Text sanitization function to prevent hydration issues
const sanitizeText = (text: string) => {
  if (!text) return '';
  return text
    .normalize('NFC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[\u2060-\u2064\u206A-\u206F]/g, '')
    .trim();
};

// API Configuration with fallbacks
const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: use relative URL for same-origin requests
    return '';
  }

  // Server-side: use environment variable or default
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

const checkApiHealth = async (): Promise<boolean> => {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/search/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.status === 'ok' && data.database === 'connected';
  } catch (error) {
    return false;
  }
};

const searchITunesDirectly = async (searchTerm: string) => {
  try {
    const [podcastResponse, episodeResponse] = await Promise.all([
      fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=podcast&entity=podcast&limit=25`, {
        signal: AbortSignal.timeout(15000),
      }),
      fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=podcast&entity=podcastEpisode&limit=25`, {
        signal: AbortSignal.timeout(15000),
      }),
    ]);

    if (!podcastResponse.ok || !episodeResponse.ok) {
      throw new Error('iTunes API request failed');
    }

    const [podcastData, episodeData] = await Promise.all([
      podcastResponse.json(),
      episodeResponse.json(),
    ]);

    return {
      podcasts: podcastData.results || [],
      episodes: episodeData.results || [],
    };
  } catch (error) {
    console.error('iTunes API fallback error:', error);
    throw new Error('Failed to fetch from iTunes API');
  }
};

export const searchPodcasts = async (searchTerm: string) => {
  try {
    const baseUrl = getApiBaseUrl();

    // First, check if our API is healthy
    const isApiHealthy = await checkApiHealth();

    if (!isApiHealthy) {
      // Fallback to direct iTunes API
      return await searchITunesDirectly(searchTerm);
    }

    // Use our API
    const response = await fetch(`${baseUrl}/search?q=${encodeURIComponent(searchTerm)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(20000), // 20 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Sanitize podcast and episode data
    const sanitizedData = {
      podcasts: data.podcasts?.map((podcast: any) => ({
        ...podcast,
        trackName: sanitizeText(podcast.trackName),
        artistName: sanitizeText(podcast.artistName),
        collectionName: sanitizeText(podcast.collectionName),
        primaryGenreName: sanitizeText(podcast.primaryGenreName),
        description: sanitizeText(podcast.description)
      })) || [],
      episodes: data.episodes?.map((episode: any) => ({
        ...episode,
        trackName: sanitizeText(episode.trackName),
        artistName: sanitizeText(episode.artistName),
        collectionName: sanitizeText(episode.collectionName),
        description: sanitizeText(episode.description)
      })) || []
    };

    return sanitizedData;
  } catch (error) {
    console.error('Search error:', error);

    // Fallback to direct iTunes API
    try {
      return await searchITunesDirectly(searchTerm);
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      throw new Error('Search failed: Unable to fetch data from any source');
    }
  }
};

export const getRecentSearches = async () => {
  try {
    const baseUrl = getApiBaseUrl();

    // Check if our API is healthy
    const isApiHealthy = await checkApiHealth();

    if (!isApiHealthy) {
      return { podcasts: [], episodes: [] };
    }

    const response = await fetch(`${baseUrl}/search/recent`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Sanitize podcast and episode data
    const sanitizedData = {
      podcasts: data.podcasts?.map((podcast: any) => ({
        ...podcast,
        trackName: sanitizeText(podcast.trackName),
        artistName: sanitizeText(podcast.artistName),
        collectionName: sanitizeText(podcast.collectionName),
        primaryGenreName: sanitizeText(podcast.primaryGenreName),
        description: sanitizeText(podcast.description)
      })) || [],
      episodes: data.episodes?.map((episode: any) => ({
        ...episode,
        trackName: sanitizeText(episode.trackName),
        artistName: sanitizeText(episode.artistName),
        collectionName: sanitizeText(episode.collectionName),
        description: sanitizeText(episode.description)
      })) || []
    };

    return sanitizedData;
  } catch (error) {
    console.error('Recent searches error:', error);
    return { podcasts: [], episodes: [] };
  }
};
