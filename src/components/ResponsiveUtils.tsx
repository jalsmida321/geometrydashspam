import React, { useState, useEffect } from 'react';

/**
 * Hook for detecting screen size and breakpoints
 */
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < 640) {
        setBreakpoint('sm');
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width < 768) {
        setBreakpoint('md');
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else if (width < 1024) {
        setBreakpoint('lg');
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else if (width < 1280) {
        setBreakpoint('xl');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      } else {
        setBreakpoint('2xl');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    width: typeof window !== 'undefined' ? window.innerWidth : 0
  };
};

/**
 * Hook for touch device detection
 */
export const useTouch = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkTouch();
    window.addEventListener('touchstart', checkTouch, { once: true });
    
    return () => window.removeEventListener('touchstart', checkTouch);
  }, []);

  return isTouch;
};

/**
 * Responsive container component
 */
export const ResponsiveContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}> = ({ children, className = '', maxWidth = 'xl' }) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full'
  };

  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};

/**
 * Responsive grid component
 */
export const ResponsiveGrid: React.FC<{
  children: React.ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}> = ({ 
  children, 
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 6,
  className = ''
}) => {
  const getGridClasses = () => {
    const classes = ['grid'];
    
    if (columns.sm) classes.push(`grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
    
    classes.push(`gap-${gap}`);
    
    return classes.join(' ');
  };

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Mobile-optimized game iframe component
 */
export const ResponsiveGameFrame: React.FC<{
  src: string;
  title: string;
  className?: string;
}> = ({ src, title, className = '' }) => {
  const { isMobile, isTablet } = useBreakpoint();
  const isTouch = useTouch();

  const getFrameClasses = () => {
    if (isMobile) {
      return 'w-full h-[400px] sm:h-[500px]';
    } else if (isTablet) {
      return 'w-full h-[500px] md:h-[550px]';
    } else {
      return 'w-full h-[590px] max-w-[850px]';
    }
  };

  const getContainerClasses = () => {
    if (isMobile || isTablet) {
      return 'w-full';
    } else {
      return 'flex justify-center';
    }
  };

  return (
    <div className={getContainerClasses()}>
      <iframe
        src={src}
        title={title}
        className={`${getFrameClasses()} rounded-lg shadow-lg ${className}`}
        scrolling="no"
        frameBorder="0"
        allowFullScreen
        style={{ 
          boxSizing: 'border-box',
          touchAction: isTouch ? 'manipulation' : 'auto'
        }}
      />
    </div>
  );
};

/**
 * Touch-friendly button component
 */
export const TouchButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false
}) => {
  const isTouch = useTouch();
  
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500',
    outline: 'text-blue-700 bg-white border border-blue-300 hover:bg-blue-50 focus:ring-blue-500'
  };
  
  const sizeClasses = {
    sm: isTouch ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-2 text-sm',
    md: isTouch ? 'px-4 py-2 text-base min-h-[48px]' : 'px-4 py-2 text-base',
    lg: isTouch ? 'px-6 py-3 text-lg min-h-[52px]' : 'px-6 py-3 text-lg'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const touchClasses = isTouch ? 'active:scale-95' : 'hover:scale-105';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${touchClasses} ${className}`}
      style={{
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      {children}
    </button>
  );
};

/**
 * Mobile-optimized navigation component
 */
export const MobileNavigation: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Navigation panel */}
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};

/**
 * Responsive text component that adjusts size based on screen
 */
export const ResponsiveText: React.FC<{
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  size?: {
    sm?: string;
    md?: string;
    lg?: string;
  };
  className?: string;
}> = ({ 
  children, 
  as: Component = 'p',
  size = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' },
  className = ''
}) => {
  const responsiveClasses = `${size.sm} ${size.md ? `md:${size.md}` : ''} ${size.lg ? `lg:${size.lg}` : ''}`;
  
  return (
    <Component className={`${responsiveClasses} ${className}`}>
      {children}
    </Component>
  );
};

/**
 * Responsive spacing component
 */
export const ResponsiveSpacing: React.FC<{
  children: React.ReactNode;
  padding?: {
    sm?: string;
    md?: string;
    lg?: string;
  };
  margin?: {
    sm?: string;
    md?: string;
    lg?: string;
  };
  className?: string;
}> = ({ 
  children,
  padding = { sm: 'p-4', md: 'md:p-6', lg: 'lg:p-8' },
  margin,
  className = ''
}) => {
  const paddingClasses = `${padding.sm} ${padding.md || ''} ${padding.lg || ''}`;
  const marginClasses = margin ? `${margin.sm || ''} ${margin.md || ''} ${margin.lg || ''}` : '';
  
  return (
    <div className={`${paddingClasses} ${marginClasses} ${className}`}>
      {children}
    </div>
  );
};

export default {
  useBreakpoint,
  useTouch,
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveGameFrame,
  TouchButton,
  MobileNavigation,
  ResponsiveText,
  ResponsiveSpacing
};