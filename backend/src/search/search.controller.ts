import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { SearchService, SearchResponse } from './search.service';
import { Podcast } from '../entities/podcast.entity';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async searchPodcasts(@Query('q') searchTerm: string): Promise<SearchResponse> {
    if (!searchTerm || searchTerm.trim() === '') {
      throw new HttpException(
        'Search term is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.searchService.searchPodcasts(searchTerm.trim());
    } catch (error) {
      throw new HttpException(
        'Failed to search podcasts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('recent')
  async getRecentSearches(): Promise<SearchResponse> {
    try {
      return await this.searchService.getRecentSearches();
    } catch (error) {
      throw new HttpException(
        'Failed to get recent searches',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('by-term')
  async getPodcastsBySearchTerm(@Query('q') searchTerm: string): Promise<SearchResponse> {
    if (!searchTerm || searchTerm.trim() === '') {
      throw new HttpException(
        'Search term is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.searchService.getPodcastsBySearchTerm(searchTerm.trim());
    } catch (error) {
      throw new HttpException(
        'Failed to get podcasts by search term',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 