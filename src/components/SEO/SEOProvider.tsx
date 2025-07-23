import React from 'react';

interface SEOProviderProps {
  children: React.ReactNode;
}

/**
 * SEOProvider component - simplified version without external dependencies
 */
const SEOProvider: React.FC<SEOProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export default SEOProvider;