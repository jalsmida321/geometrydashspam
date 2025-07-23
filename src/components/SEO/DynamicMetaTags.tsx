import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface DynamicMetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'game' | 'search';
  url?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * DynamicMetaTags component for managing dynamic meta tags
 * This component can be used on any page to dynamically update meta tags
 */
const DynamicMetaTags: React.FC<DynamicMetaTagsProps> = ({
  title,
  description,
  keywords = [],
  image,
  type = 'website',
  url,
  author = 'Geometry Dash Spam Games',
  publishedTime,
  modifiedTime
}) => {
  const location = useLocation();
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  
  // Default values
  const defaultTitle = 'Geometry Dash Spam Games - Play Online for Free';
  const defaultDescription = 'Play Geometry Dash and other exciting online games for free. No downloads required!';
  const defaultImage = `${window.location.origin}/favicon-512x512.png`;
  
  // Final values
  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalImage = image || defaultImage;

  useEffect(() => {
    // Update document title
    document.title = finalTitle;
    
    // Helper function to update or create meta tag
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update basic meta tags
    updateMetaTag('description', finalDescription);
    if (keywords.length > 0) {
      updateMetaTag('keywords', keywords.join(', '));
    }
    
    // Update Open Graph tags
    updateMetaTag('og:title', finalTitle, true);
    updateMetaTag('og:description', finalDescription, true);
    updateMetaTag('og:image', finalImage, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'Geometry Dash Spam Games', true);
    
    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', finalTitle);
    updateMetaTag('twitter:description', finalDescription);
    updateMetaTag('twitter:image', finalImage);
    
    // Update article specific tags if type is article
    if (type === 'article' && author) {
      updateMetaTag('article:author', author, true);
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, true);
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, true);
      }
    }
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);
    
  }, [finalTitle, finalDescription, finalImage, currentUrl, type, keywords, author, publishedTime, modifiedTime]);

  // This component doesn't render anything visible
  return null;
};

export default DynamicMetaTags;