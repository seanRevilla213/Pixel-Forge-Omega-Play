import { useState, useEffect, useMemo } from 'react';

// Production-grade breakpoints
export const BREAKPOINTS = {
  xs: 320,
  sm: 375,
  md: 425,
  tablet: 768,
  tabletL: 834,
  laptop: 1024,
  desktop: 1280,
  desktopL: 1440,
  ultrawide: 1920,
  superwide: 2560,
};

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'ultrawide';

interface DeviceCapabilities {
  isTouch: boolean;
  isHighRefreshRate: boolean;
  reducedMotion: boolean;
  orientation: 'portrait' | 'landscape';
}

export const useResponsive = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isTouch: false,
    isHighRefreshRate: false,
    reducedMotion: false,
    orientation: 'portrait',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setWidth(window.innerWidth);
    
    // Debounced resize for performance
    let timeoutId: number;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    
    // Initial capability check
    const checkCapabilities = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const orientation = window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape';
      
      // Simple HRR detection (can be expanded)
      const isHighRefreshRate = window.matchMedia('(min-resolution: 2dppx)').matches;

      setCapabilities({ isTouch, isHighRefreshRate, reducedMotion, orientation });
    };

    checkCapabilities();

    // Orientation change listener
    const orientationQuery = window.matchMedia('(orientation: portrait)');
    const handleOrientation = (e: MediaQueryListEvent) => {
      setCapabilities(prev => ({ ...prev, orientation: e.matches ? 'portrait' : 'landscape' }));
    };
    orientationQuery.addEventListener('change', handleOrientation);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      orientationQuery.removeEventListener('change', handleOrientation);
    };
  }, []);

  const device = useMemo((): DeviceType => {
    if (width < BREAKPOINTS.tablet) return 'mobile';
    if (width < BREAKPOINTS.desktop) return 'tablet';
    if (width < BREAKPOINTS.ultrawide) return 'desktop';
    return 'ultrawide';
  }, [width]);

  return {
    width,
    device,
    isMobile: device === 'mobile',
    isTablet: device === 'tablet',
    isDesktop: device === 'desktop',
    isUltrawide: device === 'ultrawide',
    ...capabilities,
    // Helper to pick values based on device
    val: <T>(map: Partial<Record<DeviceType | 'default', T>>): T => {
      return map[device] ?? map.default ?? (Object.values(map)[0] as T);
    }
  };
};

/**
 * Hook for complex animation settings based on device capabilities
 */
export const useAnimationSettings = () => {
  const { isTouch, reducedMotion, isMobile, isHighRefreshRate } = useResponsive();

  return useMemo(() => ({
    // Disable heavy effects on mobile or if user prefers reduced motion
    intensity: reducedMotion ? 0 : isMobile ? 0.5 : 1,
    use3D: !isMobile && !reducedMotion,
    hoverEnabled: !isTouch,
    transitionType: reducedMotion ? 'fade' : 'spring',
    fpsLimit: isHighRefreshRate ? 120 : 60,
    // Spring configs per device
    spring: {
      stiffness: isMobile ? 300 : 100,
      damping: isMobile ? 30 : 20,
    }
  }), [isTouch, reducedMotion, isMobile, isHighRefreshRate]);
};
