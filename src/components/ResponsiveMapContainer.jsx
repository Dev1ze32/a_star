import React, { useRef, useState, useEffect } from 'react';

/**
 * A wrapper that forces its children (the map) to scale down/up 
 * to fit the available parent space while maintaining aspect ratio.
 */
export const ResponsiveMapContainer = ({ children, originalWidth, originalHeight }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Get the size of the parent container (the available space on screen)
        const parent = containerRef.current.parentElement;
        const availableWidth = parent.clientWidth;
        const availableHeight = parent.clientHeight;

        // Calculate ratios
        const scaleX = availableWidth / originalWidth;
        const scaleY = availableHeight / originalHeight;
        
        // Choose the smaller scale to ensure it fits entirely
        // 0.95 adds a small margin so it doesn't touch the edges
        const newScale = Math.min(scaleX, scaleY) * 0.95; 
        
        setScale(newScale);
      }
    };

    // Listen for window resize
    window.addEventListener('resize', handleResize);
    // Initial calculation
    handleResize(); 
    // Recalculate slightly later to handle layout shifts
    setTimeout(handleResize, 100);

    return () => window.removeEventListener('resize', handleResize);
  }, [originalWidth, originalHeight]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex items-center justify-center overflow-hidden"
    >
      <div 
        style={{ 
          width: originalWidth, 
          height: originalHeight, 
          transform: `scale(${scale})`, 
          transformOrigin: 'center center',
          transition: 'transform 0.3s ease-out' // Smooth scaling animation
        }}
        className="relative shadow-2xl" // Added shadow for better separation
      >
        {children}
      </div>
    </div>
  );
};