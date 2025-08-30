# Thmanyah Frontend

Next.js frontend application for the Thmanyah podcast search platform.

## Features

- **Modern UI**: Beautiful, responsive design with Arabic RTL support
- **Podcast Search**: Search for podcasts and episodes using iTunes API
- **Recent Searches**: View your most recent search results
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Arabic Support**: Full Arabic language support with proper RTL layout
- **Type Safety**: Built with TypeScript for better development experience

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Arabic Fonts** - IBM Plex Sans Arabic for better Arabic typography

## Quick Start

### Prerequisites

- Node.js 18+
- Backend API running (see backend README)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   ```bash
   cp env.example .env.local
   ```

3. **Configure environment variables**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## Project Structure

```
app/
├── components/          # React components
│   ├── SearchForm.tsx   # Search form component
│   ├── PodcastCard.tsx  # Podcast card component
│   └── ...
├── lib/                 # Utility functions
│   └── api.ts          # API integration
├── types/               # TypeScript type definitions
│   └── podcast.ts      # Podcast-related types
├── page.tsx            # Main page component
├── layout.tsx          # Root layout
└── globals.css         # Global styles
```

## Components

### SearchForm
- Handles search input and form submission
- Debounced search to prevent excessive API calls
- Responsive design with proper Arabic RTL support

### Podcast/Episode Cards
- Display podcast and episode information
- Show artwork, title, artist, and description
- Link to iTunes for more details

## API Integration

The frontend communicates with the backend API for:
- Searching podcasts and episodes
- Retrieving recent search results
- Health checks

### API Endpoints Used
- `GET /search?q={term}` - Search for content
- `GET /search/recent` - Get recent searches
- `GET /search/health` - Health check

## Styling

### Tailwind CSS
- Utility-first approach for rapid development
- Custom color scheme and typography
- Responsive design utilities

### Arabic Support
- RTL layout support
- IBM Plex Sans Arabic font family
- Proper text alignment and spacing

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Quality

- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Prettier** - Code formatting

## Deployment

### AWS Amplify

1. Connect your repository to AWS Amplify
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```
3. Set environment variables in Amplify console

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License. 