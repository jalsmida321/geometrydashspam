import React, { useState, useRef, useEffect, useCallback } from 'react';
import { throttle } from '../../utils/performanceUtils';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
  scrollingDelay?: number;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  style?: React.CSSProperties;
}

/**
 * VirtualList component for efficient rendering of large lists
 * Only renders items that are visible in the viewport
 */
function VirtualList<T>({
  items,
  itemHeight,
  renderItem,
  className = '',
  overscan = 5,
  scrollingDelay = 150,
  onEndReached,
  endReachedThreshold = 300,
  style = {}
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  // Calculate visible items
  const totalHeight = items.length * itemHeight;
  const visibleStartIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleEndIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  const visibleItems = items.slice(visibleStartIndex, visibleEndIndex + 1);
  const offsetY = visibleStartIndex * itemHeight;

  // Handle scroll event with throttling
  const handleScroll = useCallback(
    throttle(() => {
      if (containerRef.current) {
        const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
        setScrollTop(scrollTop);
        
        // Check if end is reached
        if (
          !hasReachedEnd &&
          onEndReached &&
          scrollHeight - scrollTop - clientHeight < endReachedThreshold
        ) {
          setHasReachedEnd(true);
          onEndReached();
        } else if (scrollHeight - scrollTop - clientHeight >= endReachedThreshold) {
          setHasReachedEnd(false);
        }
        
        // Set scrolling state
        setIsScrolling(true);
        const scrollingTimeout = setTimeout(() => {
          setIsScrolling(false);
        }, scrollingDelay);
        
        return () => clearTimeout(scrollingTimeout);
      }
    }, 16), // 60fps
    [hasReachedEnd, onEndReached, endReachedThreshold, scrollingDelay]
  );

  // Update container height on resize
  useEffect(() => {
    const updateContainerHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateContainerHeight();
    window.addEventListener('resize', updateContainerHeight);
    
    return () => {
      window.removeEventListener('resize', updateContainerHeight);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`virtual-list-container ${className}`}
      style={{
        overflowY: 'auto',
        position: 'relative',
        height: '100%',
        ...style
      }}
      onScroll={handleScroll}
    >
      <div
        className="virtual-list-inner"
        style={{
          height: totalHeight,
          position: 'relative'
        }}
      >
        <div
          className="virtual-list-items"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${offsetY}px)`
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={visibleStartIndex + index}
              className="virtual-list-item"
              style={{
                height: itemHeight,
                boxSizing: 'border-box'
              }}
            >
              {renderItem(item, visibleStartIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VirtualList;