import { Suspense } from 'react'
import SearchForm from './components/SearchForm'
import PodcastCard from './components/PodcastCard'
import EpisodeCard from './components/EpisodeCard'
import PodcastSlider from './components/PodcastSlider'
import { SearchResult, Podcast, Episode } from './types/podcast'
import { searchPodcasts, getRecentSearches, checkApiHealth } from './lib/api'

interface HomePageProps {
  searchParams: { search?: string }
}

// Helper function to separate podcasts and episodes
function separateResults(results: SearchResult[]): { podcasts: Podcast[], episodes: Episode[] } {
  const podcasts: Podcast[] = []
  const episodes: Episode[] = []
  
  results.forEach(result => {
    if (result.kind === 'podcast') {
      podcasts.push(result as Podcast)
    } else if (result.kind === 'episode') {
      episodes.push(result as Episode)
    }
  })
  
  return { podcasts, episodes }
}

export default async function Home({ searchParams }: HomePageProps) {
  const searchTerm = searchParams.search || ''
  
  // Check API health first
  let apiHealth = null
  let usingFallback = false
  try {
    apiHealth = await checkApiHealth()
    if (apiHealth.status === 'fallback') {
      usingFallback = true
    }
  } catch (error) {
    console.error('API Health check failed:', error)
  }
  
  // Fetch data based on search params
  let searchResults: SearchResult[] = []
  let recentSearches: SearchResult[] = []
  let error = ''
  let errorDetails = ''
  
  if (searchTerm) {
    try {
      searchResults = await searchPodcasts(searchTerm)
    } catch (err: any) {
      error = err.message || 'Failed to search podcasts'
      errorDetails = err.stack || ''
      console.error('Search error:', err)
    }
  } else {
    try {
      recentSearches = await getRecentSearches()
    } catch (err: any) {
      error = err.message || 'Failed to load recent searches'
      errorDetails = err.stack || ''
      console.error('Recent searches error:', err)
    }
  }

  // Separate results into categories
  const { podcasts, episodes } = separateResults(searchResults)
  const { podcasts: recentPodcasts, episodes: recentEpisodes } = separateResults(recentSearches)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
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
        {/* API Health Status */}
        {apiHealth && (
          <div className={`mb-4 p-3 border rounded-lg ${
            apiHealth.status === 'healthy' 
              ? 'bg-blue-50 border-blue-200' 
              : apiHealth.status === 'fallback'
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                apiHealth.status === 'healthy' 
                  ? 'bg-green-500' 
                  : apiHealth.status === 'fallback'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}></div>
              <span className={`text-sm ${
                apiHealth.status === 'healthy' 
                  ? 'text-blue-800' 
                  : apiHealth.status === 'fallback'
                  ? 'text-yellow-800'
                  : 'text-red-800'
              }`}>
                {apiHealth.status === 'healthy' 
                  ? 'حالة الخادم: يعمل بشكل طبيعي'
                  : apiHealth.status === 'fallback'
                  ? 'حالة الخادم: يستخدم iTunes API مباشرة'
                  : 'حالة الخادم: مشكلة في الاتصال'
                }
              </span>
              {process.env.NODE_ENV === 'development' && (
                <span className="text-xs text-gray-600">
                  ({apiHealth.environment || 'unknown'} - {apiHealth.database || 'unknown'})
                </span>
              )}
            </div>
          </div>
        )}

        {/* Fallback Notice */}
        {usingFallback && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm text-yellow-800">
                تحذير: يتم استخدام iTunes API مباشرة. بعض الميزات قد لا تعمل بشكل كامل.
              </span>
            </div>
          </div>
        )}

        {/* Search Form */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-12 bg-light-100 rounded-lg animate-pulse"></div>}>
            <SearchForm initialSearchTerm={searchTerm} />
          </Suspense>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold mb-2">خطأ في الاتصال بالخادم</p>
            <p className="text-red-700 text-sm mb-2">{error}</p>
            {process.env.NODE_ENV === 'development' && errorDetails && (
              <details className="text-red-600 text-xs">
                <summary className="cursor-pointer">تفاصيل الخطأ (للطور)</summary>
                <pre className="mt-2 whitespace-pre-wrap">{errorDetails}</pre>
              </details>
            )}
            <div className="mt-3 text-sm text-red-600">
              <p>• تأكد من أن الخادم يعمل بشكل صحيح</p>
              <p>• تحقق من إعدادات الشبكة</p>
              <p>• جرب تحديث الصفحة</p>
              <p>• إذا استمرت المشكلة، يرجى التواصل مع الدعم الفني</p>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
              <p><strong>معلومات التصحيح:</strong></p>
              <p>• البيئة: {process.env.NODE_ENV || 'غير محدد'}</p>
              <p>• الوقت: {new Date().toLocaleString('ar-SA')}</p>
              <p>• المتصفح: {typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side'}</p>
            </div>
          </div>
        )}

        {/* Search Results */}
        {(podcasts.length > 0 || episodes.length > 0) && (
          <div className="mb-12">
            <div className="border-b border-border pb-4 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    نتائج البحث عن "{searchTerm}"
                  </h2>
                  <p className="text-light-500">
                    {podcasts.length + episodes.length} نتيجة تم العثور عليها
                  </p>
                </div>
                <a
                  href="/"
                  className="text-sm text-light-500 hover:text-accent-blue transition-colors duration-200"
                >
                  مسح النتائج
                </a>
              </div>
            </div>

            {/* Podcasts Section - Slider */}
            {podcasts.length > 0 && (
              <PodcastSlider
                podcasts={podcasts}
                title="البودكاستات"
                subtitle="البودكاستات التي تطابق بحثك"
              />
            )}

            {/* Episodes Section - Medium Cards */}
            {episodes.length > 0 && (
              <div className="mb-12">
                <div className="border-b border-border pb-4 mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    الحلقات ({episodes.length})
                  </h3>
                  <p className="text-light-500">
                    الحلقات التي تطابق بحثك
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {episodes.map((episode) => (
                    <EpisodeCard key={episode._id} episode={episode} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {searchTerm && podcasts.length === 0 && episodes.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              لم يتم العثور على نتائج
            </h3>
            <p className="text-light-500 max-w-md mx-auto mb-6">
              لا توجد بودكاستات أو حلقات تطابق "{searchTerm}". جرب كلمات بحث مختلفة.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-2 bg-gradient-primary text-white rounded-lg hover:brightness-110 transition-all duration-200"
            >
              مسح البحث
            </a>
          </div>
        )}

        {/* Recent Searches */}
        {(recentPodcasts.length > 0 || recentEpisodes.length > 0) && !searchTerm && (
          <div>
            <div className="border-b border-border pb-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                البحثات الحديثة
              </h2>
              <p className="text-light-500">
                البودكاستات والحلقات التي بحثت عنها مؤخراً
              </p>
            </div>

            {/* Recent Podcasts - Slider */}
            {recentPodcasts.length > 0 && (
              <PodcastSlider
                podcasts={recentPodcasts}
                title="البودكاستات"
              />
            )}

            {/* Recent Episodes - Medium Cards */}
            {recentEpisodes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  الحلقات ({recentEpisodes.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentEpisodes.map((episode) => (
                    <EpisodeCard key={episode._id} episode={episode} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!searchTerm && recentPodcasts.length === 0 && recentEpisodes.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              ابدأ بالبحث عن البودكاستات والحلقات
            </h3>
            <p className="text-light-500 max-w-md mx-auto">
              ابحث عن البودكاستات والحلقات المفضلة لديك أو اكتشف محتوى جديد من خلال iTunes
            </p>
          </div>
        )}
      </main>
    </div>
  )
} 