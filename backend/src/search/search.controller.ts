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
        environment: process.env.NODE_ENV || 'development',
        apiUrl: process.env.API_URL || 'not set',
        allowedOrigins: process.env.ALLOWED_ORIGINS || 'not set'
      };
    } catch (error) {
      throw new HttpException({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message,
        environment: process.env.NODE_ENV || 'development',
        apiUrl: process.env.API_URL || 'not set',
        allowedOrigins: process.env.ALLOWED_ORIGINS || 'not set'
      }, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Get('search')
  async searchPodcasts(@Query('q') searchTerm: string) {
    if (!searchTerm || searchTerm.trim() === '') {
      throw new HttpException('Search term is required', HttpStatus.BAD_REQUEST);
    }

    try {
      console.log(`Searching for: "${searchTerm}"`);
      const result = await this.searchService.searchPodcasts(searchTerm.trim());
      console.log(`Found ${result.podcasts.length} podcasts and ${result.episodes.length} episodes`);
      return result;
    } catch (error) {
      console.error('Search error:', error);
      throw new HttpException(`Failed to search podcasts: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('recent')
  async getRecentSearches() {
    try {
      console.log('Fetching recent searches');
      const result = await this.searchService.getRecentSearches();
      console.log(`Found ${result.podcasts.length} recent podcasts and ${result.episodes.length} recent episodes`);
      return result;
    } catch (error) {
      console.error('Recent searches error:', error);
      throw new HttpException(`Failed to get recent searches: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 