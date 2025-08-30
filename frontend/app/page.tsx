import SearchForm from './components/SearchForm';
import { searchPodcasts, getRecentSearches } from './lib/api';

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const searchTerm = searchParams.search?.trim() || '';
  let searchResults = { podcasts: [], episodes: [] };
  let recentSearches = { podcasts: [], episodes: [] };
  let apiError = null;
  let apiHealth = null;

  // Check API health
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const healthResponse = await fetch(`${baseUrl}/search/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    
    if (healthResponse.ok) {
      apiHealth = await healthResponse.json();
    }
  } catch (error) {
    apiHealth = { status: 'error', database: 'disconnected' };
  }

  // Perform search if search term is provided and valid
  if (searchTerm && searchTerm.length >= 2) {
    try {
      searchResults = await searchPodcasts(searchTerm);
    } catch (error) {
      apiError = error instanceof Error ? error.message : 'Search failed';
    }
  } else if (!searchTerm) {
    // Get recent searches only if no search term is provided
    try {
      recentSearches = await getRecentSearches();
    } catch (error) {
      apiError = error instanceof Error ? error.message : 'Failed to load recent searches';
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="glass-effect border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3 space-x-reverse">
              <div className="flex items-center gap-2">
                <img src="/logo-black.png" alt="Logo" className="h-8 w-auto" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchForm initialSearchTerm={searchTerm} />
        </div>

        {apiError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold mb-2">خطأ في الاتصال بالخادم</p>
            <p className="text-red-700 text-sm mb-2">Search failed: {apiError}</p>
            <div className="mt-3 text-sm text-red-600">
              <p>• تأكد من أن الخادم يعمل بشكل صحيح</p>
              <p>• تحقق من إعدادات الشبكة</p>
              <p>• جرب تحديث الصفحة</p>
            </div>
          </div>
        )}

        {!searchTerm && recentSearches.podcasts.length === 0 && recentSearches.episodes.length === 0 && !apiError && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <img
                src="/placeholder-podcast.svg"
                alt="Search for podcasts"
                className="w-32 h-32 mx-auto mb-6 opacity-50"
              />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                ابحث عن البودكاست المفضل لديك
              </h2>
              <p className="text-gray-500">
                ابدأ بالبحث عن البودكاست أو الحلقة التي تريد الاستماع إليها
              </p>
            </div>
          </div>
        )}

        {searchTerm && searchTerm.length < 2 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                اكتب حرفين على الأقل للبحث
              </h2>
              <p className="text-gray-500">
                جرب البحث بكلمات أكثر
              </p>
            </div>
          </div>
        )}

        {searchTerm && searchTerm.length >= 2 && searchResults.podcasts.length === 0 && searchResults.episodes.length === 0 && !apiError && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                لم يتم العثور على نتائج
              </h2>
              <p className="text-gray-500">
                جرب البحث بكلمات مختلفة أو تحقق من الإملاء
              </p>
            </div>
          </div>
        )}

        {searchResults.podcasts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">البودكاست</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.podcasts.map((podcast: any) => (
                <div key={podcast._id || podcast.trackId} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={podcast.artworkUrl600 || podcast.artworkUrl100 || '/placeholder-podcast.svg'}
                    alt={podcast.trackName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{podcast.trackName}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{podcast.artistName}</p>
                    {podcast.description && (
                      <p className="text-sm text-gray-600 line-clamp-3">{podcast.description}</p>
                    )}
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs text-gray-500">{podcast.primaryGenreName}</span>
                      {podcast.trackViewUrl && (
                        <a
                          href={podcast.trackViewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          عرض في iTunes
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchResults.episodes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">الحلقات</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.episodes.map((episode: any) => (
                <div key={episode._id || episode.trackId} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={episode.artworkUrl600 || episode.artworkUrl100 || '/placeholder-podcast.svg'}
                    alt={episode.trackName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{episode.trackName}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{episode.artistName}</p>
                    {episode.description && (
                      <p className="text-sm text-gray-600 line-clamp-3">{episode.description}</p>
                    )}
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs text-gray-500">{episode.primaryGenreName}</span>
                      {episode.trackViewUrl && (
                        <a
                          href={episode.trackViewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          عرض في iTunes
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!searchTerm && (recentSearches.podcasts.length > 0 || recentSearches.episodes.length > 0) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">البحث الأخير</h2>
            {recentSearches.podcasts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">البودكاست</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recentSearches.podcasts.slice(0, 8).map((podcast: any) => (
                    <div key={podcast._id || podcast.trackId} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <img
                        src={podcast.artworkUrl600 || podcast.artworkUrl100 || '/placeholder-podcast.svg'}
                        alt={podcast.trackName}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{podcast.trackName}</h3>
                        <p className="text-muted-foreground text-sm mb-3">{podcast.artistName}</p>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-xs text-gray-500">{podcast.primaryGenreName}</span>
                          {podcast.trackViewUrl && (
                            <a
                              href={podcast.trackViewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm"
                            >
                              عرض في iTunes
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recentSearches.episodes.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">الحلقات</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recentSearches.episodes.slice(0, 8).map((episode: any) => (
                    <div key={episode._id || episode.trackId} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <img
                        src={episode.artworkUrl600 || episode.artworkUrl100 || '/placeholder-podcast.svg'}
                        alt={episode.trackName}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{episode.trackName}</h3>
                        <p className="text-muted-foreground text-sm mb-3">{episode.artistName}</p>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-xs text-gray-500">{episode.primaryGenreName}</span>
                          {episode.trackViewUrl && (
                            <a
                              href={episode.trackViewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm"
                            >
                              عرض في iTunes
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
} 