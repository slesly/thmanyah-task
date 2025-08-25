import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Podcast } from '../entities/podcast.entity';

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
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Podcast)
    private podcastRepository: Repository<Podcast>,
  ) {}

  async searchPodcasts(searchTerm: string): Promise<Podcast[]> {
    try {
      // Search in iTunes API
      const response = await axios.get<iTunesSearchResult>(
        'https://itunes.apple.com/search',
        {
          params: {
            term: searchTerm,
            media: 'podcast',
            limit: 50,
          },
        },
      );

      const podcasts = response.data.results;

      // Save podcasts to database
      const savedPodcasts: Podcast[] = [];
      
      for (const podcast of podcasts) {
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

      return savedPodcasts;
    } catch (error) {
      console.error('Error searching podcasts:', error);
      throw new Error('Failed to search podcasts');
    }
  }

  async getRecentSearches(): Promise<Podcast[]> {
    return this.podcastRepository.find({
      order: { createdAt: 'DESC' },
      take: 20,
    });
  }

  async getPodcastsBySearchTerm(searchTerm: string): Promise<Podcast[]> {
    return this.podcastRepository.find({
      where: { searchTerm },
      order: { createdAt: 'DESC' },
    });
  }
} 