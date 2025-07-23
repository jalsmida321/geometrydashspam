import React from 'react';
import { useRouteMetadata } from '../hooks/useRouteMetadata';

/**
 * RouteMetadataProvider component that handles SEO metadata for all routes
 */
const RouteMetadataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // This hook will automatically update metadata based on the current route
  useRouteMetadata();
  
  return <>{children}</>;
};

export default RouteMetadataProvider;