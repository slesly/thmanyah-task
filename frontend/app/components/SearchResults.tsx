'use client'

import { useEffect, useState, useRef } from 'react'
import AnimatedElement from './AnimatedElement'

// Logo Loader Component
function LogoLoader() {
  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <img
          src="/logo-loader.svg"
          alt="Loading..."
          className="w-16 h-16 mx-auto mb-6 logo-loader"
        />
        <h2 className="text-xl font-semibold text-muted-foreground mb-2" suppressHydrationWarning>
          جاري البحث...
        </h2>
        <p className="text-muted-foreground" suppressHydrationWarning>
          يرجى الانتظار بينما نبحث عن أفضل النتائج
        </p>
      </div>
    </div>
  );
}

// Podcast Slider Component
function PodcastSlider({ podcasts }: { podcasts: any[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollPosition = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      
      // For RTL layout, we need to check differently
      // When scrollLeft is 0, we're at the beginning (right side in RTL)
      // When scrollLeft is at max, we're at the end (left side in RTL)
      const isAtBeginning = Math.abs(scrollLeft) === 0;
      const maxScroll = scrollWidth - clientWidth;
      
      // Use Math.abs to handle negative scrollLeft values
      const isAtEnd = Math.abs(scrollLeft) >= maxScroll;
      
      // For RTL: Right arrow shows when we can scroll right (when not at beginning)
      // Left arrow shows when we can scroll left (when not at end)
      const canScrollRightValue = !isAtBeginning;
      const canScrollLeftValue = !isAtEnd;
      
      console.log('SearchResults Scroll check:', { 
        scrollLeft, 
        scrollWidth, 
        clientWidth, 
        maxScroll,
        isAtBeginning,
        isAtEnd,
        canScrollRightValue, 
        canScrollLeftValue
      });
      
      setCanScrollRight(canScrollRightValue);
      setCanScrollLeft(canScrollLeftValue);
    }
  };

  // Check scroll position when component mounts and when podcasts change
  useEffect(() => {
    const timer = setTimeout(() => {
      checkScrollPosition();
    }, 100);
    
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollPosition);
      return () => {
        clearTimeout(timer);
        slider.removeEventListener('scroll', checkScrollPosition);
      };
    }
    return () => clearTimeout(timer);
  }, [podcasts]);

  // Check on window resize
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => checkScrollPosition(), 100);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -400, behavior: 'smooth' });
      // Check position after scroll animation
      setTimeout(() => checkScrollPosition(), 500);
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 400, behavior: 'smooth' });
      // Check position after scroll animation
      setTimeout(() => checkScrollPosition(), 500);
    }
  };

  return (
    <div className="relative">
      {/* Left Arrow - Only show if can scroll left (to end) */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-1 md:left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Right Arrow - Only show if can scroll right (to beginning) */}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Slider */}
      <div ref={sliderRef} className="podcast-slider px-2 md:px-0">
        {podcasts.map((podcast: any, index: number) => {
          const handleCardClick = () => {
            if (podcast.trackViewUrl) {
              window.open(podcast.trackViewUrl, '_blank', 'noopener,noreferrer')
            }
          };

          return (
            <AnimatedElement 
              key={podcast._id || podcast.trackId} 
              animationType="fade-scale" 
              className="podcast-card cursor-pointer group hover:scale-105 transition-transform duration-200"
              onClick={handleCardClick}
            >
              <div className="relative">
                <img
                  src={podcast.artworkUrl600 || podcast.artworkUrl100 || '/placeholder-podcast.svg'}
                  alt={podcast.trackName}
                  className="podcast-card-image"
                  onLoad={() => setTimeout(() => checkScrollPosition(), 100)}
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white/90 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="podcast-card-content">
                <p className="podcast-card-subtitle" suppressHydrationWarning>
                  {podcast.primaryGenreName || 'بودكاست'}
                </p>
                <h3 className="podcast-card-title group-hover:text-green-500 transition-colors duration-200" suppressHydrationWarning>
                  {podcast.trackName}
                </h3>
                <p className="podcast-card-subtitle" suppressHydrationWarning>
                  {podcast.artistName}
                </p>
              </div>
            </AnimatedElement>
          );
        })}
      </div>
    </div>
  );
}

interface SearchResultsProps {
  searchTerm: string;
  searchResults: { podcasts: any[]; episodes: any[] };
  apiError: string | null;
}

export default function SearchResults({ searchTerm, searchResults, apiError }: SearchResultsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchTerm && searchTerm.length >= 2) {
      setIsLoading(true);
      setShowResults(false);
      
      // Simulate loading time
      const timer = setTimeout(() => {
        setIsLoading(false);
        setShowResults(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
      setShowResults(false);
    }
  }, [searchTerm]);

  // Show loading state
  if (isLoading) {
    return <LogoLoader />;
  }

  // Show error
  if (apiError) {
    return (
      <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p className="text-destructive font-semibold mb-2" suppressHydrationWarning>خطأ في الاتصال بالخادم</p>
        <p className="text-destructive/80 text-sm mb-2" suppressHydrationWarning>Search failed: {apiError}</p>
        <div className="mt-3 text-sm text-destructive/70">
          <p suppressHydrationWarning>• تأكد من أن الخادم يعمل بشكل صحيح</p>
          <p suppressHydrationWarning>• تحقق من إعدادات الشبكة</p>
          <p suppressHydrationWarning>• جرب تحديث الصفحة</p>
        </div>
      </div>
    );
  }

  // Show no results
  if (searchTerm && searchTerm.length >= 2 && searchResults.podcasts.length === 0 && searchResults.episodes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-muted-foreground mb-2" suppressHydrationWarning>
            لم يتم العثور على نتائج
          </h2>
          <p className="text-muted-foreground" suppressHydrationWarning>
            جرب البحث بكلمات مختلفة أو تحقق من الإملاء
          </p>
        </div>
      </div>
    );
  }

  // Show search term too short
  if (searchTerm && searchTerm.length < 2) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">
            اكتب حرفين على الأقل للبحث
          </h2>
          <p className="text-muted-foreground">
            جرب البحث بكلمات أكثر
          </p>
        </div>
      </div>
    );
  }

  // Show results
  return (
    <>
      {searchResults.podcasts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground text-center">البودكاست</h2>
          <PodcastSlider podcasts={searchResults.podcasts} />
        </div>
      )}

      {searchResults.episodes.length > 0 && (
         <div className="mb-8">
           <h2 className="text-2xl font-bold mb-6 text-foreground">الحلقات</h2>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {searchResults.episodes.map((episode: any, index: number) => (
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
  );
}
