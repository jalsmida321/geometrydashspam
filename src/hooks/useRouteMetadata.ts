import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getRouteMetadata, generateDynamicMetadata, getCanonicalUrl } from '../utils/routeConfig';
import { gameService } from '../services/GameService';
import { categoryService } from '../services/CategoryService';

/**
 * Hook for managing route metadata and SEO
 */
export const useRouteMetadata = () => {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    const updateMetadata = async () => {
      let metadata = getRouteMetadata(location.pathname);
      let dynamicData: Record<string, any> = {};

      // Get dynamic data for parameterized routes
      if (params.categorySlug) {
        const category = categoryService.getCategoryBySlug(params.categorySlug);
        if (category) {
          dynamicData.categoryName = category.name;
        }
      }

      if (params.gameName) {
        const games = gameService.getAllGames();
        const game = games.find(g => 
          g.name.toLowerCase().replace(/\s+/g, '-') === params.gameName?.toLowerCase() ||
          g.id === params.gameName
        );
        if (game) {
          dynamicData.gameName = game.name;
        }
      }

      // Generate dynamic metadata
      if (metadata && Object.keys(params).length > 0) {
        metadata = generateDynamicMetadata(location.pathname, params, dynamicData);
      }

      if (metadata) {
        // Update document title
        if (metadata.title) {
          document.title = metadata.title;
        }

        // Update meta description
        updateMetaTag('description', metadata.description);

        // Update meta keywords
        if (metadata.keywords) {
          updateMetaTag('keywords', metadata.keywords.join(', '));
        }

        // Update canonical URL
        const canonical = getCanonicalUrl(location.pathname);
        if (canonical) {
          updateCanonicalLink(canonical);
        }

        // Update Open Graph tags
        updateMetaTag('og:title', metadata.title, 'property');
        updateMetaTag('og:description', metadata.description, 'property');
        updateMetaTag('og:url', window.location.href, 'property');

        // Update Twitter Card tags
        updateMetaTag('twitter:title', metadata.title);
        updateMetaTag('twitter:description', metadata.description);
      }
    };

    updateMetadata();
  }, [location.pathname, params]);

  return {
    pathname: location.pathname,
    params
  };
};

/**
 * Update or create meta tag
 */
const updateMetaTag = (name: string, content?: string, attribute: string = 'name') => {
  if (!content) return;

  let metaTag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute(attribute, name);
    document.head.appendChild(metaTag);
  }
  
  metaTag.content = content;
};

/**
 * Update canonical link
 */
const updateCanonicalLink = (href: string) => {
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }
  
  canonicalLink.href = new URL(href, window.location.origin).href;
};