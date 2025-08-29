import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search/search.controller';
import { SearchService } from './search/search.service';
import { Podcast } from './entities/podcast.entity';
import { Episode } from './entities/episode.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'thmanyahdb',
      entities: [Podcast, Episode],
      synchronize: process.env.NODE_ENV !== 'production', // Only for development
      logging: process.env.NODE_ENV === 'development',
      retryAttempts: 10,
      retryDelay: 3000,
      keepConnectionAlive: true,
      extra: {
        connectionTimeoutMillis: 30000,
        query_timeout: 30000,
        statement_timeout: 30000,
      },
    }),
    TypeOrmModule.forFeature([Podcast, Episode]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class AppModule {} 