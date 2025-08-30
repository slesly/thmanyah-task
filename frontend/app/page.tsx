import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import RecentPodcastSlider from './components/RecentPodcastSlider';
import AnimatedElement from './components/AnimatedElement';
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
    <div className="min-h-screen text-foreground relative flex flex-col">
      <div className="glass-effect sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
            <div className="flex items-center gap-2 md:gap-3 space-x-reverse">
              <div className="flex items-center gap-1 md:gap-2">
                <img src="/logo.svg" alt="Logo" className="h-6 md:h-8 w-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative md:h-[212px] h-[180px] overflow-hidden">
        <div className="custom-background"></div>
      </div>

      <main className="container flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 pt-0 md:pb-8 md:pt-0 mt-[-46px]">
        <div className="mb-16 md:mb-20">
          <SearchForm initialSearchTerm={searchTerm} />
        </div>

        {/* Search Results with Loading State */}
        <SearchResults 
          searchTerm={searchTerm}
          searchResults={searchResults}
          apiError={apiError}
        />

        {/* Recent Searches - only show when no search term */}
        {!searchTerm && (recentSearches.podcasts.length > 0 || recentSearches.episodes.length > 0) && (
          <>
            {recentSearches.podcasts.length > 0 && (
              <div className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-foreground text-center">آخر البودكاست تم البحث عنهـا</h2>
                <RecentPodcastSlider podcasts={recentSearches.podcasts} />
              </div>
            )}

            {recentSearches.episodes.length > 0 && (
              <div className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-foreground">آخر الحلقــات تم البحث عنها</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {recentSearches.episodes.map((episode: any, index: number) => (
                    <AnimatedElement 
                      key={episode._id || episode.trackId} 
                      animationType="fade-scale" 
                      className="episode-card-thmanyah"
                    >
                      <div className="episode-card-image-container">
                        <a href={episode.trackViewUrl} target="_blank" rel="noopener noreferrer">
                          <img
                            src={episode.artworkUrl600 || episode.artworkUrl100 || '/placeholder-podcast.svg'}
                            alt={episode.trackName}
                            className="episode-thumbnail-thmanyah"
                            loading="lazy"
                          />
                        </a>
                      </div>
                      <div className="episode-card-content-thmanyah">
                        <a href={episode.trackViewUrl} target="_blank" rel="noopener noreferrer" className="episode-link-thmanyah">
                          <h3 className="episode-title-thmanyah" suppressHydrationWarning>{episode.trackName}</h3>
                          <div className="episode-description-thmanyah" suppressHydrationWarning>
                            {episode.description ? episode.description.substring(0, 100) + '...' : 'حلقة جديدة من البودكاست'}
                          </div>
                        </a>
                        <div className="episode-meta-thmanyah">
                          {Boolean(episode.artistName) && <div className="episode-author">
                            <span className="episode-author-name" suppressHydrationWarning>{episode.artistName}</span>
                          </div>}
                          <div className="episode-date-container">
                            <span className="episode-date-text" suppressHydrationWarning>
                              في بودكاست {episode.collectionName || episode.artistName}
                            </span>
                            <span className="episode-date" suppressHydrationWarning>
                              {episode.releaseDate ? new Date(episode.releaseDate).toLocaleDateString('ar-SA', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              }) : 'حلقة جديدة'}
                              <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="episode-date-icon">
                                <g clipPath="url(#clip0_6141_83613)">
                                  <path d="M3.77256 14.1251C3.1287 14.1251 2.65038 13.9688 2.33777 13.6564C2.02987 13.3486 1.87583 12.8729 1.87583 12.2292V10.7319C1.87583 10.6013 1.83157 10.4917 1.74288 10.4031L0.68604 9.33974C0.228617 8.88741 0 8.44205 0 8.00365C0 7.56525 0.228617 7.11744 0.685851 6.6604L1.74269 5.59706C1.83139 5.5084 1.87564 5.40111 1.87564 5.27518V3.77099C1.87564 3.12271 2.02968 2.64459 2.33758 2.33682C2.65019 2.02906 3.12851 1.87508 3.77237 1.87508H5.27025C5.40094 1.87508 5.51054 1.83085 5.59924 1.74219L6.66304 0.685812C7.12046 0.228777 7.56602 7.12149e-05 7.99991 7.12149e-05C8.4385 -0.00463467 8.88406 0.223883 9.33677 0.685624L10.4006 1.742C10.494 1.83066 10.6058 1.87489 10.7365 1.87489H12.2274C12.876 1.87489 13.3543 2.03113 13.6622 2.3436C13.9701 2.65607 14.1242 3.13193 14.1242 3.7708V5.27499C14.1242 5.40092 14.1709 5.50821 14.2641 5.59687L15.3209 6.66021C15.7735 7.11725 15.9998 7.56506 15.9998 8.00346C16.0045 8.44186 15.7782 8.88722 15.3209 9.33974L14.2641 10.4031C14.1707 10.4917 14.1242 10.6013 14.1242 10.7319V12.2292C14.1242 12.8774 13.9679 13.3556 13.6553 13.6633C13.3474 13.9711 12.8715 14.1251 12.2274 14.1251H10.7365C10.6058 14.1251 10.4938 14.1695 10.4006 14.258L9.33677 15.3213C8.88424 15.7736 8.43868 15.9999 7.99991 15.9999C7.56602 16.0046 7.12028 15.7783 6.66304 15.3213L5.59924 14.258C5.51054 14.1693 5.40094 14.1251 5.27025 14.1251H3.77237H3.77256Z" fill="#FFC00A"/>
                                  <path fillRule="evenodd" clipRule="evenodd" d="M11.5676 7.69257C11.4444 7.62989 11.2793 7.60447 11.1354 7.57323C10.7482 7.49172 10.3855 7.34546 10.0577 7.14763C10.1631 6.7209 10.3479 6.31054 10.6109 5.94104C10.6644 5.8584 10.7104 5.7784 10.7373 5.69821C10.8524 5.36014 10.6396 5.1497 10.3053 5.26113C10.1739 5.30386 10.0392 5.40268 9.9153 5.48212C9.58424 5.69784 9.22474 5.85087 8.85319 5.94273C8.6274 5.56909 8.46846 5.15139 8.39294 4.70716C8.37374 4.6168 8.35208 4.53247 8.31894 4.45925C8.25604 4.31807 8.14738 4.21323 8.03476 4.1976C7.88599 4.17953 7.77282 4.28306 7.69353 4.43308C7.63139 4.55468 7.60597 4.71789 7.57508 4.86019C7.49373 5.2489 7.34703 5.61313 7.14817 5.94236C6.72408 5.83789 6.31599 5.65454 5.9484 5.39403C5.871 5.34377 5.79586 5.29934 5.72072 5.27111C5.57647 5.21577 5.42544 5.2184 5.33486 5.28692C5.21697 5.37916 5.21001 5.53257 5.26029 5.69464C5.30228 5.82452 5.39983 5.95779 5.47873 6.08033C5.69605 6.41257 5.8501 6.7736 5.94218 7.14669C5.56837 7.37219 5.15069 7.53087 4.70663 7.60636C4.61794 7.62518 4.5347 7.64645 4.46239 7.67864C4.11908 7.82979 4.10383 8.14584 4.43979 8.30885C4.51474 8.34556 4.60268 8.36927 4.69722 8.3896C5.14673 8.46301 5.56687 8.62245 5.94162 8.85003C5.83691 9.27412 5.65368 9.68203 5.39286 10.0497C5.34352 10.1257 5.29964 10.1995 5.27121 10.2735C5.13543 10.623 5.34823 10.8572 5.70114 10.735C5.78023 10.7079 5.85895 10.6625 5.9403 10.6102C6.31016 10.3444 6.72031 10.1609 7.1461 10.057C7.38695 10.4536 7.55343 10.8993 7.6263 11.3729C7.67715 11.6427 7.92968 11.9574 8.19295 11.7216L8.19559 11.7191C8.35886 11.5704 8.38485 11.3165 8.43268 11.1036C8.51497 10.7284 8.65847 10.3768 8.85074 10.0581C9.30195 10.1682 9.73527 10.3659 10.1221 10.6494C10.3488 10.8041 10.7499 10.8481 10.7693 10.4954V10.4918C10.7797 10.2714 10.6185 10.0734 10.5015 9.8889C10.294 9.56494 10.1466 9.21426 10.0571 8.85247C10.4339 8.6249 10.8554 8.4649 11.3034 8.38941C11.3996 8.36871 11.4887 8.34461 11.5646 8.30697C11.8851 8.14923 11.8834 7.85012 11.5682 7.69257H11.5676Z" fill="black"/>
                                </g>
                                <defs>
                                  <clipPath id="clip0_6141_83613">
                                    <rect width="24" height="24" fill="white"/>
                                  </clipPath>
                                </defs>
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </AnimatedElement>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty state when no search term and no recent searches */}
        {!searchTerm && recentSearches.podcasts.length === 0 && recentSearches.episodes.length === 0 && !apiError && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <img
                src="/placeholder-podcast.svg"
                alt="Search for podcasts"
                className="w-32 h-32 mx-auto mb-6 opacity-50"
              />
              <h2 className="text-xl font-semibold text-muted-foreground mb-2">
                ابحث عن البودكاست المفضل لديك
              </h2>
              <p className="text-muted-foreground">
                ابدأ بالبحث عن البودكاست أو الحلقة التي تريد الاستماع إليها
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="relative mt-auto">
        <div className="absolute top-0 right-0 w-full h-px bg-white/10"></div>
        <div className="container mx-auto">
          <div className="flex max-sm:flex-col items-center justify-between gap-4 md:gap-6 lg:gap-0 py-8 md:py-12 pt-16 md:pt-24">
            <div>
              <button className="transition-all duration-300 hover:opacity-90 cursor-pointer group" aria-label="العودة إلى أعلى الصفحة">
                <img 
                  alt="شاشة ثمانية" 
                  loading="lazy" 
                  width="96" 
                  height="32" 
                  className="h-auto w-20 md:w-24 transition-transform duration-300 group-hover:translate-y-[-2px]" 
                  src="/logo.svg"
                />
              </button>
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              <div>
                <a target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-gray-300 transition-colors duration-200" aria-label="TikTok" href="https://www.tiktok.com/@thmanyah">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 md:h-5 md:w-5">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                  </svg>
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-gray-300 transition-colors duration-200" aria-label="Instagram" href="https://www.instagram.com/thmanyah">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 md:h-5 md:w-5">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-gray-300 transition-colors duration-200" aria-label="X" href="https://x.com/thmanyah">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 md:h-5 md:w-5">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                  </svg>
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-gray-300 transition-colors duration-200" aria-label="Youtube" href="https://www.youtube.com/@thmanyah">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 md:h-5 md:w-5">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                    <path d="m10 15 5-3-5-3z"></path>
                  </svg>
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-gray-300 transition-colors duration-200" aria-label="Facebook" href="https://www.facebook.com/thmanyah">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 md:h-5 md:w-5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-gray-300 transition-colors duration-200" aria-label="LinkedIn" href="https://www.linkedin.com/company/thmanyah">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 md:h-5 md:w-5">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M8 11v5"></path>
                    <path d="M8 8v.01"></path>
                    <path d="M12 16v-5"></path>
                    <path d="M16 16v-3a2 0 1 0 -4 0"></path>
                    <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-white/10"></div>
          <div className="flex justify-center items-center py-6 md:py-8 pb-10 md:pb-14 text-xs md:text-sm text-white/60">
            <p className="text-center">
              © 2025 ثمانية للنشر والتوزيع - جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 