# API Contract for Frontend

The frontend expects the backend to handle all data processing and return results in a specific format.

## Search Endpoint

**URL:** `GET /api/search?q={searchTerm}`

**Expected Response Format:**
```json
{
  "podcasts": [
    {
      "_id": "unique_string_id",
      "kind": "podcast",
      "wrapperType": "track",
      "trackName": "Podcast Name",
      "artistName": "Artist Name",
      "artworkUrl100": "https://...",
      "artworkUrl600": "https://...",
      "description": "Podcast description...",
      "trackCount": 150,
      "feedUrl": "https://...",
      "trackViewUrl": "https://...",
      "collectionViewUrl": "https://...",
      "primaryGenreName": "Technology",
      "country": "US",
      "releaseDate": "2023-01-01T00:00:00Z",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ],
  "episodes": [
    {
      "_id": "unique_string_id",
      "kind": "episode",
      "wrapperType": "track",
      "trackName": "Episode Title",
      "artistName": "Artist Name",
      "collectionName": "Podcast Name",
      "artworkUrl100": "https://...",
      "artworkUrl600": "https://...",
      "description": "Episode description...",
      "episodeUrl": "https://...",
      "episodeLength": 3600,
      "episodeNumber": 1,
      "seasonNumber": 1,
      "trackViewUrl": "https://...",
      "collectionViewUrl": "https://...",
      "releaseDate": "2023-01-01T00:00:00Z",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

## Recent Searches Endpoint

**URL:** `GET /api/search/recent`

**Expected Response Format:** Same as search endpoint

## Backend Responsibilities

1. **Fetch from iTunes API** - Get raw data from iTunes
2. **Categorize Results** - Separate podcasts from episodes
3. **Add Required Fields** - Ensure each item has:
   - `_id` (string)
   - `kind` ("podcast" or "episode")
   - `wrapperType` ("track")
4. **Return Structured Response** - Format as `{ podcasts: [...], episodes: [...] }`

## Frontend Responsibilities

1. **Consume API** - Make requests to backend
2. **Display Results** - Show podcasts and episodes in separate sections
3. **Cache Results** - Prevent redundant API calls
4. **Handle UI** - Search input, navigation, loading states

## Notes

- Frontend expects backend to handle all iTunes API integration
- Frontend expects backend to categorize items as podcasts vs episodes
- Frontend expects backend to add required `kind` and `wrapperType` fields
- Frontend is a pure consumer with no data processing logic
