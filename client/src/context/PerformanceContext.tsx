import { createContext, useContext, useState, useEffect, type FC, type ReactNode } from 'react';

export type PerformanceMode = 'premium' | 'performance' | 'auto';

interface PerformanceContextType {
  performanceMode: PerformanceMode;
  isLowEnd: boolean;
  setPerformanceMode: (mode: PerformanceMode) => void;
  togglePerformanceMode: () => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const PerformanceProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [performanceMode, setPerformanceModeState] = useState<PerformanceMode>(() => {
    const saved = localStorage.getItem('pixel-forge-performance-mode');
    const valid: PerformanceMode[] = ['premium', 'performance', 'auto'];
    return valid.includes(saved as PerformanceMode) ? (saved as PerformanceMode) : 'auto';
  });

  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    const detectDevice = () => {
      if (performanceMode === 'performance') {
        return true;
      }
      if (performanceMode === 'premium') {
        return false;
      }
      
      // Auto Detection Mode
      // 1. Weak CPU (4 cores or less)
      const cores = navigator.hardwareConcurrency;
      if (cores && cores <= 4) return true;

      // 2. Low RAM (4GB or less)
      const memory = (navigator as any).deviceMemory;
      if (memory && memory <= 4) return true;

      // 3. Weak mobile devices / budget Android phones
      const ua = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
      
      if (isMobileDevice) {
        // Mobile screens and budget mobile devices will benefit from performance mode automatically
        return true;
      }

      // 4. Slow Connection
      const connection = (navigator as any).connection;
      if (connection) {
        if (connection.saveData) return true;
        if (['slow-2g', '2g', '3g'].includes(connection.effectiveType)) return true;
      }

      return false;
    };

    const isLow = detectDevice();
    setIsLowEnd(isLow);

    // Apply global class to html element for optimized CSS styles
    const root = document.documentElement;
    if (isLow) {
      root.classList.add('performance-mode');
      root.classList.remove('premium-mode');
    } else {
      root.classList.add('premium-mode');
      root.classList.remove('performance-mode');
    }
  }, [performanceMode]);

  const setPerformanceMode = (mode: PerformanceMode) => {
    setPerformanceModeState(mode);
    localStorage.setItem('pixel-forge-performance-mode', mode);
  };

  const togglePerformanceMode = () => {
    setPerformanceMode(performanceMode === 'premium' ? 'performance' : 'premium');
  };

  return (
    <PerformanceContext.Provider
      value={{
        performanceMode,
        isLowEnd,
        setPerformanceMode,
        togglePerformanceMode,
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};
