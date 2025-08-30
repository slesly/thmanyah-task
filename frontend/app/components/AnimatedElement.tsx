'use client'

import { ReactNode } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface AnimatedElementProps {
  children: ReactNode;
  className?: string;
  animationType?: 'fade-up' | 'fade-scale' | 'fade';
  threshold?: number;
  rootMargin?: string;
}

export default function AnimatedElement({
  children,
  className = '',
  animationType = 'fade-up',
  threshold = 0.1,
  rootMargin = '50px'
}: AnimatedElementProps) {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true
  });

  const getAnimationClass = () => {
    const baseClass = 'scroll-animate';
    const typeClass = animationType === 'fade-scale' ? 'scroll-animate-scale' : 
                     animationType === 'fade-up' ? 'scroll-animate-up' : '';
    const animateClass = isIntersecting ? 'animate-in' : '';
    
    return `${baseClass} ${typeClass} ${animateClass}`.trim();
  };

  return (
    <div
      ref={elementRef}
      className={`${getAnimationClass()} ${className}`}
    >
      {children}
    </div>
  );
}
