import React from 'react';
import { useResponsive, type DeviceType } from '../../hooks/useResponsive';
import { motion, AnimatePresence } from 'framer-motion';

interface ResponsiveShowProps {
  children: React.ReactNode;
  is?: DeviceType | DeviceType[];
  isNot?: DeviceType | DeviceType[];
}

/**
 * Component to conditionally show elements based on device type
 */
export const ResponsiveShow: React.FC<ResponsiveShowProps> = ({ children, is, isNot }) => {
  const { device } = useResponsive();
  
  const isTarget = is ? (Array.isArray(is) ? is.includes(device) : is === device) : true;
  const isExcluded = isNot ? (Array.isArray(isNot) ? isNot.includes(device) : isNot === device) : false;

  if (isTarget && !isExcluded) return <>{children}</>;
  return null;
};

/**
 * Mobile Drawer / Sidebar component that automatically handles responsiveness
 */
export const AdaptivePanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}> = ({ isOpen, onClose, children, title }) => {
  const { isMobile } = useResponsive();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark-900/60 backdrop-blur-sm z-50"
          />
          
          {/* Panel */}
          <motion.div
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed z-[60] glass-strong ${
              isMobile 
                ? 'bottom-0 left-0 right-0 rounded-t-3xl max-h-[90vh]' 
                : 'top-0 right-0 bottom-0 w-96'
            } overflow-hidden flex flex-col`}
          >
            <div className="p-6 border-b border-glass-border flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-text-primary">{title}</h3>
              <button onClick={onClose} className="p-2 text-text-muted hover:text-neon-cyan">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 touch-scroll">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
