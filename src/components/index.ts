// Main components
export { default as Header } from './Header';
export { default as Footer } from './Footer';
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as RetryHandler, useRetry } from './RetryHandler';

// Error states
export {
  ErrorState,
  SearchErrorState,
  FilterErrorState,
  NetworkErrorState,
  ServerErrorState,
  GameLoadErrorState
} from './ErrorStates';

// Loading components
export {
  GameCardSkeleton,
  GameGridSkeleton,
  CategoryFilterSkeleton,
  SearchBarSkeleton,
  PageHeaderSkeleton,
  GamePageSkeleton,
  CategoryPageSkeleton,
  SearchResultsSkeleton,
  LoadingSpinner,
  FullPageLoading,
  InlineLoading
} from './LoadingSkeletons';

// Responsive components
export {
  useBreakpoint,
  useTouch,
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveGameFrame,
  TouchButton,
  MobileNavigation,
  ResponsiveText,
  ResponsiveSpacing
} from './ResponsiveUtils';

export { MobileGamePlayer } from './MobileGamePlayer';

// Game components
export * from './game';