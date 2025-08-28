import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Podcast } from '../entities/podcast.entity';
import { Episode } from '../entities/episode.entity';

export interface iTunesSearchResult {
  resultCount: number;
  results: iTunesPodcast[];
}

export interface iTunesPodcast {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName?: string;
  artworkUrl100?: string;
  artworkUrl600?: string;
  description?: string;
  releaseDate?: string;
  trackCount?: number;
  primaryGenreName?: string;
  country?: string;
  feedUrl?: string;
  trackViewUrl?: string;
  collectionViewUrl?: string;
  artistViewUrl?: string;
  previewUrl?: string;
  trackPrice?: number;
  collectionPrice?: number;
  currency?: string;
  contentAdvisoryRating?: string;
  isExplicit?: boolean;
  wrapperType?: string;
  kind?: string;
  // Episode-specific fields
  episodeUrl?: string;
  episodeContentType?: string;
  episodeFileExtension?: string;
  episodeGuid?: string;
  episodeLength?: number;
  episodeNumber?: number;
  seasonNumber?: number;
  collectionId?: number;
  collectionCensoredName?: string;
  trackCensoredName?: string;
  artworkUrl30?: string;
  artworkUrl60?: string;
  collectionHdPrice?: number;
  collectionExplicitness?: string;
  trackExplicitness?: string;
  trackTimeMillis?: number;
  genreIds?: string[];
  genres?: string[];
}

export interface SearchResponse {
  podcasts: Podcast[];
  episodes: Episode[];
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Podcast)
    private podcastRepository: Repository<Podcast>,
    @InjectRepository(Episode)
    private episodeRepository: Repository<Episode>,
  ) {}

  async searchPodcasts(searchTerm: string): Promise<SearchResponse> {
    try {
      // Search for podcasts
      const podcastResponse = await axios.get<iTunesSearchResult>(
        'https://itunes.apple.com/search',
        {
          params: {
            term: searchTerm,
            media: 'podcast',
            entity: 'podcast', // Search for podcasts only
            limit: 25,
          },
        },
      );

      // Search for episodes
      const episodeResponse = await axios.get<iTunesSearchResult>(
        'https://itunes.apple.com/search',
        {
          params: {
            term: searchTerm,
            media: 'podcast',
            entity: 'podcastEpisode', // Search for episodes only
            limit: 25,
          },
        },
      );

      const podcasts = podcastResponse.data.results;
      const episodes = episodeResponse.data.results;

      // Save podcasts to database
      const savedPodcasts: Podcast[] = [];
      
      for (const podcast of podcasts) {
        // Skip podcasts without required fields
        if (!podcast.trackId || !podcast.trackName) {
          continue;
        }

        const existingPodcast = await this.podcastRepository.findOne({
          where: { trackId: podcast.trackId },
        });

        if (existingPodcast) {
          // Update existing podcast
          Object.assign(existingPodcast, {
            ...podcast,
            searchTerm,
            updatedAt: new Date(),
          });
          await this.podcastRepository.save(existingPodcast);
          savedPodcasts.push(existingPodcast);
        } else {
          // Create new podcast
          const newPodcast = this.podcastRepository.create({
            ...podcast,
            searchTerm,
          });
          const savedPodcast = await this.podcastRepository.save(newPodcast);
          savedPodcasts.push(savedPodcast);
        }
      }

      // Save episodes to database
      const savedEpisodes: Episode[] = [];

      for (const episode of episodes) {
        // Skip episodes without required fields
        if (!episode.trackId || !episode.trackName) {
          continue;
        }

        const existingEpisode = await this.episodeRepository.findOne({
          where: { trackId: episode.trackId },
        });

        if (existingEpisode) {
          // Update existing episode
          Object.assign(existingEpisode, {
            ...episode,
            searchTerm,
            updatedAt: new Date(),
          });
          await this.episodeRepository.save(existingEpisode);
          savedEpisodes.push(existingEpisode);
        } else {
          // Create new episode
          const newEpisode = this.episodeRepository.create({
            ...episode,
            searchTerm,
          });
          const savedEpisode = await this.episodeRepository.save(newEpisode);
          savedEpisodes.push(savedEpisode);
        }
      }

      // Transform data to match frontend expectations
      const transformedPodcasts = savedPodcasts.map(podcast => ({
        ...podcast,
        _id: podcast.id.toString(),
        kind: 'podcast',
        wrapperType: 'track'
      }));

      const transformedEpisodes = savedEpisodes.map(episode => ({
        ...episode,
        _id: episode.id.toString(),
        kind: 'episode',
        wrapperType: 'track'
      }));

      return {
        podcasts: transformedPodcasts,
        episodes: transformedEpisodes,
      };
    } catch (error) {
      console.error('Error searching podcasts:', error);
      throw new Error('Failed to search podcasts');
    }
  }

  async getRecentSearches(): Promise<SearchResponse> {
    const podcasts = await this.podcastRepository.find({
      order: { createdAt: 'DESC' },
      take: 20,
    });

    const episodes = await this.episodeRepository.find({
      order: { createdAt: 'DESC' },
      take: 20,
    });

    // Transform data to match frontend expectations
    const transformedPodcasts = podcasts.map(podcast => ({
      ...podcast,
      _id: podcast.id.toString(),
      kind: 'podcast',
      wrapperType: 'track'
    }));

    const transformedEpisodes = episodes.map(episode => ({
      ...episode,
      _id: episode.id.toString(),
      kind: 'episode',
      wrapperType: 'track'
    }));

    return {
      podcasts: transformedPodcasts,
      episodes: transformedEpisodes,
    };
  }

  async getPodcastsBySearchTerm(searchTerm: string): Promise<SearchResponse> {
    const podcasts = await this.podcastRepository.find({
      where: { searchTerm },
      order: { createdAt: 'DESC' },
    });

    const episodes = await this.episodeRepository.find({
      where: { searchTerm },
      order: { createdAt: 'DESC' },
    });

    // Transform data to match frontend expectations
    const transformedPodcasts = podcasts.map(podcast => ({
      ...podcast,
      _id: podcast.id.toString(),
      kind: 'podcast',
      wrapperType: 'track'
    }));

    const transformedEpisodes = episodes.map(episode => ({
      ...episode,
      _id: episode.id.toString(),
      kind: 'episode',
      wrapperType: 'track'
    }));

    return {
      podcasts: transformedPodcasts,
      episodes: transformedEpisodes,
    };
  }
} 