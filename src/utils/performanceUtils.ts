/**
 * Performance optimization utilities for the game site
 */

/**
 * Debounce function to limit how often a function is called
 * @param func The function to debounce
 * @param wait Wait time in milliseconds
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit how often a function is called
 * @param func The function to throttle
 * @param limit Limit time in milliseconds
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Memoize function to cache results of expensive function calls
 * @param func The function to memoize
 */
export const memoize = <T extends (...args: any[]) => any>(
  func: T
): ((...args: Parameters<T>) => ReturnType<T>) => {
  const cache = new Map<string, ReturnType<T>>();
  
  return (...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Check if an element is in the viewport
 * @param element The element to check
 * @param offset Optional offset to trigger before element is fully visible
 */
export const isInViewport = (
  element: HTMLElement,
  offset = 0
): boolean => {
  const rect = element.getBoundingClientRect();
  
  return (
    rect.top - offset <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left - offset <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.bottom + offset >= 0 &&
    rect.right + offset >= 0
  );
};

/**
 * Create an intersection observer for lazy loading
 * @param callback Function to call when element is in view
 * @param options IntersectionObserver options
 */
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: '0px',
    threshold: 0,
    ...options
  });
};

/**
 * Cache object for storing data in memory
 */
export class MemoryCache {
  private cache: Map<string, { value: any; expiry: number | null }> = new Map();
  
  /**
   * Set a value in the cache
   * @param key Cache key
   * @param value Value to store
   * @param ttl Time to live in milliseconds (optional)
   */
  set(key: string, value: any, ttl?: number): void {
    const expiry = ttl ? Date.now() + ttl : null;
    this.cache.set(key, { value, expiry });
  }
  
  /**
   * Get a value from the cache
   * @param key Cache key
   */
  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    
    // Return undefined if item doesn't exist
    if (!item) return undefined;
    
    // Return undefined if item has expired
    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }
    
    return item.value as T;
  }
  
  /**
   * Check if a key exists in the cache
   * @param key Cache key
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) return false;
    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
  
  /**
   * Delete a key from the cache
   * @param key Cache key
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Get all keys in the cache
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }
  
  /**
   * Get the number of items in the cache
   */
  size(): number {
    return this.cache.size;
  }
}

// Create a global cache instance
export const gameCache = new MemoryCache();

/**
 * Optimize image loading by creating a low-quality placeholder
 * @param src Image source URL
 * @param callback Callback function when image is loaded
 */
export const loadImageWithPlaceholder = (
  src: string,
  callback: (image: HTMLImageElement, placeholder: string) => void
): void => {
  // Check if image is already cached
  if (gameCache.has(`img_${src}`)) {
    const cachedImage = gameCache.get<HTMLImageElement>(`img_${src}`);
    const cachedPlaceholder = gameCache.get<string>(`placeholder_${src}`);
    if (cachedImage && cachedPlaceholder) {
      callback(cachedImage, cachedPlaceholder);
      return;
    }
  }
  
  // Create a tiny placeholder (10px wide)
  const placeholderImg = new Image();
  placeholderImg.crossOrigin = 'anonymous';
  placeholderImg.src = src;
  placeholderImg.onload = () => {
    // Create a canvas to resize the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to 10px wide (maintain aspect ratio)
    const aspectRatio = placeholderImg.height / placeholderImg.width;
    canvas.width = 10;
    canvas.height = 10 * aspectRatio;
    
    // Draw the image at the smaller size
    if (ctx) {
      ctx.drawImage(placeholderImg, 0, 0, canvas.width, canvas.height);
      
      // Get the data URL of the small image
      const placeholder = canvas.toDataURL('image/jpeg', 0.1);
      
      // Load the full image
      const fullImg = new Image();
      fullImg.src = src;
      fullImg.onload = () => {
        // Cache the image and placeholder
        gameCache.set(`img_${src}`, fullImg);
        gameCache.set(`placeholder_${src}`, placeholder);
        
        // Call the callback with the full image and placeholder
        callback(fullImg, placeholder);
      };
    }
  };
};

/**
 * Preload critical resources
 * @param resources Array of URLs to preload
 */
export const preloadResources = (resources: string[]): void => {
  resources.forEach(url => {
    if (url.endsWith('.js')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = url;
      document.head.appendChild(link);
    } else if (url.endsWith('.css')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = url;
      document.head.appendChild(link);
    } else if (url.match(/\.(jpe?g|png|gif|svg|webp)$/i)) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    }
  });
};

/**
 * Measure component render time
 * @param componentName Name of the component
 * @param callback Function to measure
 */
export const measureRenderTime = (
  componentName: string,
  callback: () => void
): void => {
  const startTime = performance.now();
  callback();
  const endTime = performance.now();
  console.log(`[Performance] ${componentName} rendered in ${endTime - startTime}ms`);
};

/**
 * Create a virtual list for efficient rendering of large lists
 * @param totalItems Total number of items
 * @param itemHeight Height of each item in pixels
 * @param visibleItems Number of items visible at once
 * @param renderItem Function to render an item
 */
export const createVirtualList = (
  totalItems: number,
  itemHeight: number,
  visibleItems: number,
  renderItem: (index: number) => JSX.Element
): {
  containerStyle: React.CSSProperties;
  visibleItemsStyle: React.CSSProperties;
  visibleItemIndices: number[];
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
} => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  // Calculate which items should be visible
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 3);
  const endIndex = Math.min(totalItems - 1, startIndex + visibleItems + 6);
  const visibleItemIndices = Array.from(
    { length: endIndex - startIndex + 1 },
    (_, i) => startIndex + i
  );
  
  // Calculate container style
  const containerStyle: React.CSSProperties = {
    height: `${visibleItems * itemHeight}px`,
    overflowY: 'auto',
    position: 'relative'
  };
  
  // Calculate visible items style
  const visibleItemsStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    transform: `translateY(${startIndex * itemHeight}px)`,
    height: `${totalItems * itemHeight}px`
  };
  
  // Handle scroll event
  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  };
  
  return {
    containerStyle,
    visibleItemsStyle,
    visibleItemIndices,
    onScroll
  };
};