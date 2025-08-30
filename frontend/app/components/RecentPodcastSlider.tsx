'use client'

import { useRef, useState, useEffect } from 'react'
import AnimatedElement from './AnimatedElement'

export default function RecentPodcastSlider({ podcasts }: { podcasts: any[] }) {
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
      
      console.log('Scroll check:', { 
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
                <span className="podcast-card-badge text-xs md:text-sm">بودكاست</span>
                
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
