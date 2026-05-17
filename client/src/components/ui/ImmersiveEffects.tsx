import { useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { usePerformance } from '../../context/PerformanceContext';

export const AuroraBackground = () => {
  return (
    <div className="aurora-bg">
      <div 
        className="aurora-sphere w-[800px] h-[800px] bg-luxury-violet top-[-20%] left-[-10%]" 
        style={{ animationDuration: '25s' }} 
      />
      <div 
        className="aurora-sphere w-[600px] h-[600px] bg-luxury-cyan bottom-[-10%] right-[-5%]" 
        style={{ animationDuration: '30s', animationDirection: 'reverse' }} 
      />
      <div 
        className="aurora-sphere w-[500px] h-[500px] bg-indigo-500 top-[40%] right-[20%]" 
        style={{ animationDuration: '20s' }} 
      />
    </div>
  );
};

export const AmbientGlow = () => {
  const { isLowEnd } = usePerformance();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (isLowEnd) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, isLowEnd]);

  if (isLowEnd) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-[1000px] h-[1000px] pointer-events-none z-[1] opacity-[0.07]"
      style={{
        x: x,
        y: y,
        translateX: '-50%',
        translateY: '-50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
      }}
    />
  );
};

export const FloatingParticles = () => {
  const { isLowEnd } = usePerformance();

  if (isLowEnd) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0, 
            x: Math.random() * 2000, 
            y: Math.random() * 2000 
          }}
          animate={{ 
            opacity: [0, 0.3, 0],
            y: [null, Math.random() * -500],
            rotate: [0, 360]
          }}
          transition={{ 
            duration: 10 + Math.random() * 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute w-1 h-1 bg-orange-500 rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
};

