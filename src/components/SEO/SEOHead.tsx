import React, { useEffect } from 'react';
import { Game, GameCategory } from '../../types/game';
import { 
  generateCategoryStructuredData,
  generateGameStructuredData,
  generateGameCollectionStructuredData,
  generateSearchResultsStructuredData,
  generateWebsiteStructuredData,
  generateGameFAQStructuredData
} from '../../utils/structuredData';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'game' | 'search';
  structuredData?: object;
  game?: Game;
  category?: GameCategory;
  games?: Game[];
  searchQuery?: string;
}

/**
 * SEOHead component for managing dynamic meta tags and structured data
 */
const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  structuredData,
  game,
  category,
  games = []
}) => {
  // Default SEO values
  const defaultTitle = 'Geometry Dash Spam Games - Test Your Skills';
  const defaultDescription = 'Discover the thrilling world of Geometry Dash Spam Challenges! Test your skills with fast-paced levels that challenge your reflexes and precision.';
  const defaultKeywords = ['geometry dash', 'spam test', 'online games', 'browser games', 'skill games', 'reaction games'];
  const defaultImage = 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-spam-test.png';
  
  // Build final values
  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = [...defaultKeywords, ...keywords];
  const finalImage = image || defaultImage;
  const finalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  // Generate structured data based on context
  const generateStructuredData = () => {
    // If custom structured data is provided, use it
    if (structuredData) {
      return structuredData;
    }

    // Game page structured data
    if (game) {
      // Generate primary game structured data
      const gameData = generateGameStructuredData(game, finalUrl);
      
      // Generate FAQ structured data for the game
      const faqData = generateGameFAQStructuredData(game);
      
      // Return an array of structured data objects
      return [gameData, faqData];
    }

    // Category page structured data
    if (category) {
      return generateCategoryStructuredData(category, games, finalUrl);
    }

    // Search results structured data
    if (type === 'search' && searchQuery) {
      return generateSearchResultsStructuredData(searchQuery, games, finalUrl);
    }

    // Games collection structured data
    if (games.length > 0) {
      return generateGameCollectionStructuredData(
        games, 
        finalTitle, 
        finalDescription, 
        finalUrl
      );
    }

    // Default website structured data
    return generateWebsiteStructuredData(finalUrl);
  };

  const structuredDataJson = generateStructuredData();

  // Update document head using useEffect
  useEffect(() => {
    // Update title
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
    updateMetaTag('keywords', finalKeywords.join(', '));
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('author', 'Geometry Dash Spam Games');

    // Update Open Graph tags
    updateMetaTag('og:title', finalTitle, true);
    updateMetaTag('og:description', finalDescription, true);
    updateMetaTag('og:image', finalImage, true);
    updateMetaTag('og:url', finalUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'Geometry Dash Spam Games', true);

    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', finalTitle);
    updateMetaTag('twitter:description', finalDescription);
    updateMetaTag('twitter:image', finalImage);

    // Game-specific meta tags
    if (game) {
      updateMetaTag('game:name', game.name);
      updateMetaTag('game:category', game.category.name);
      updateMetaTag('game:tags', game.tags.join(', '));
      updateMetaTag('game:popularity', game.popularity.toString());
    }

    // Category-specific meta tags
    if (category) {
      updateMetaTag('category:name', category.name);
      updateMetaTag('category:description', category.description);
      updateMetaTag('category:games_count', games.filter(g => g.category.id === category.id).length.toString());
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', finalUrl);

    // Update structured data
    let structuredDataScript = document.querySelector('script[type="application/ld+json"]');
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredDataJson, null, 2);

  }, [finalTitle, finalDescription, finalKeywords, finalImage, finalUrl, type, game, category, games, structuredDataJson]);

  // This component doesn't render anything visible
  return null;
};

export default SEOHead;