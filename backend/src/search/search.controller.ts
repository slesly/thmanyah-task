import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('q') query: string, @Res() res: Response) {
    try {
      if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
      }

      const result = await this.searchService.searchPodcasts(query);
      res.json(result);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  @Get('recent')
  async getRecentSearches(@Res() res: Response) {
    try {
      const result = await this.searchService.getRecentSearches();
      res.json(result);
    } catch (error) {
      console.error('Recent searches error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  @Get('health')
  async healthCheck(@Res() res: Response) {
    try {
      const isConnected = await this.searchService.testDatabaseConnection();
      res.json({
        status: 'ok',
        database: isConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Health check error:', error);
      res.status(500).json({
        status: 'error',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
} 