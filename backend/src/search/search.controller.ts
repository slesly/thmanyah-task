import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('health')
  async healthCheck() {
    try {
      // Test database connection
      await this.searchService.testDatabaseConnection();
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        environment: process.env.NODE_ENV || 'development'
      };
    } catch (error) {
      throw new HttpException({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message
      }, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Get('search')
  async searchPodcasts(@Query('q') searchTerm: string) {
    if (!searchTerm || searchTerm.trim() === '') {
      throw new HttpException('Search term is required', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.searchService.searchPodcasts(searchTerm.trim());
    } catch (error) {
      throw new HttpException('Failed to search podcasts', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('recent')
  async getRecentSearches() {
    try {
      return await this.searchService.getRecentSearches();
    } catch (error) {
      throw new HttpException('Failed to get recent searches', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 