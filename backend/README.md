# Thmanyah Backend API

NestJS backend service for the Thmanyah podcast search application.

## Features

- **iTunes API Integration**: Search for podcasts and episodes using iTunes Search API
- **Database Storage**: Store search results in PostgreSQL using TypeORM
- **Recent Searches**: Retrieve the most recent search results
- **Health Checks**: API health monitoring
- **Error Handling**: Comprehensive error handling and logging

## Tech Stack

- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **TypeORM** - Database ORM
- **PostgreSQL** - Database
- **Axios** - HTTP client for iTunes API

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   ```bash
   cp env.example .env
   ```

3. **Configure environment variables**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=thmanyahdb
   NODE_ENV=development
   ```

4. **Start development server**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3001`

## API Endpoints

### Search
- `GET /search?q={term}` - Search for podcasts and episodes

### Recent Searches
- `GET /search/recent` - Get most recent search results

### Health Check
- `GET /search/health` - API health status

## Database Schema

### Podcasts Table
- `id` - Primary key
- `trackId` - iTunes track ID
- `trackName` - Podcast name
- `artistName` - Artist/creator name
- `searchTerm` - Search term used
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Episodes Table
- `id` - Primary key
- `trackId` - iTunes track ID
- `trackName` - Episode name
- `artistName` - Artist/creator name
- `searchTerm` - Search term used
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Development

### Available Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm run start:prod` - Start production server
- `npm run test` - Run tests
- `npm run test:e2e` - Run end-to-end tests

### Database Migrations

The database tables are created automatically by TypeORM on application startup.

## Deployment

### AWS App Runner

1. Configure your `apprunner.yaml` with the correct database credentials
2. Deploy to AWS App Runner
3. Set environment variables in the App Runner console

### Environment Variables for Production

```env
DB_HOST=your-rds-endpoint
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=thmanyahdb
NODE_ENV=production
```

## License

This project is licensed under the MIT License. 