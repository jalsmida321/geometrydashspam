import { 
  debounce, 
  throttle, 
  memoize, 
  lazyLoad,
  measurePerformance,
  optimizeImages 
} from '../performanceUtils';

describe('Performance Utils', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('debounce', () => {
    it('delays function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('cancels previous calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('passes arguments correctly', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn('arg1', 'arg2');
      jest.advanceTimersByTime(100);
      
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('throttle', () => {
    it('limits function execution rate', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);
      
      throttledFn();
      throttledFn();
      throttledFn();
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      jest.advanceTimersByTime(100);
      throttledFn();
      
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('executes immediately on first call', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);
      
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('memoize', () => {
    it('caches function results', () => {
      const expensiveFn = jest.fn((x: number) => x * 2);
      const memoizedFn = memoize(expensiveFn);
      
      const result1 = memoizedFn(5);
      const result2 = memoizedFn(5);
      
      expect(result1).toBe(10);
      expect(result2).toBe(10);
      expect(expensiveFn).toHaveBeenCalledTimes(1);
    });

    it('handles different arguments', () => {
      const expensiveFn = jest.fn((x: number) => x * 2);
      const memoizedFn = memoize(expensiveFn);
      
      memoizedFn(5);
      memoizedFn(10);
      memoizedFn(5);
      
      expect(expensiveFn).toHaveBeenCalledTimes(2);
    });

    it('works with complex arguments', () => {
      const expensiveFn = jest.fn((obj: { x: number }) => obj.x * 2);
      const memoizedFn = memoize(expensiveFn, (obj) => JSON.stringify(obj));
      
      memoizedFn({ x: 5 });
      memoizedFn({ x: 5 });
      
      expect(expensiveFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('lazyLoad', () => {
    it('creates lazy loading observer', () => {
      const mockIntersectionObserver = jest.fn();
      mockIntersectionObserver.mockReturnValue({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      });
      
      (window as any).IntersectionObserver = mockIntersectionObserver;
      
      const element = document.createElement('img');
      const callback = jest.fn();
      
      lazyLoad(element, callback);
      
      expect(mockIntersectionObserver).toHaveBeenCalled();
    });

    it('handles elements without IntersectionObserver support', () => {
      const originalIntersectionObserver = (window as any).IntersectionObserver;
      (window as any).IntersectionObserver = undefined;
      
      const element = document.createElement('img');
      const callback = jest.fn();
      
      lazyLoad(element, callback);
      
      // Should call callback immediately as fallback
      expect(callback).toHaveBeenCalled();
      
      (window as any).IntersectionObserver = originalIntersectionObserver;
    });
  });

  describe('measurePerformance', () => {
    it('measures function execution time', async () => {
      const testFn = () => new Promise(resolve => setTimeout(resolve, 100));
      
      const result = await measurePerformance('test', testFn);
      
      expect(result.name).toBe('test');
      expect(result.duration).toBeGreaterThan(0);
      expect(result.result).toBeUndefined();
    });

    it('returns function result', async () => {
      const testFn = () => 'test result';
      
      const result = await measurePerformance('test', testFn);
      
      expect(result.result).toBe('test result');
    });

    it('handles function errors', async () => {
      const testFn = () => {
        throw new Error('Test error');
      };
      
      await expect(measurePerformance('test', testFn)).rejects.toThrow('Test error');
    });
  });

  describe('optimizeImages', () => {
    it('generates optimized image URLs', () => {
      const originalUrl = 'https://example.com/image.jpg';
      const optimized = optimizeImages(originalUrl, { width: 300, height: 200 });
      
      expect(optimized).toContain('w_300');
      expect(optimized).toContain('h_200');
    });

    it('handles different formats', () => {
      const originalUrl = 'https://example.com/image.png';
      const optimized = optimizeImages(originalUrl, { format: 'webp' });
      
      expect(optimized).toContain('f_webp');
    });

    it('applies quality settings', () => {
      const originalUrl = 'https://example.com/image.jpg';
      const optimized = optimizeImages(originalUrl, { quality: 80 });
      
      expect(optimized).toContain('q_80');
    });

    it('returns original URL for unsupported domains', () => {
      const originalUrl = 'https://unsupported.com/image.jpg';
      const optimized = optimizeImages(originalUrl, { width: 300 });
      
      expect(optimized).toBe(originalUrl);
    });
  });
});