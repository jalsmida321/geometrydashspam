import { Game, GameCategory } from '../types/game';

/**
 * Generate structured data for game categories
 */
export const generateCategoryStructuredData = (
  category: GameCategory,
  games: Game[],
  url: string
): object => {
  const categoryGames = games.filter(g => g.category.id === category.id);
  const featuredGames = categoryGames.filter(g => g.featured);
  const avgPopularity = categoryGames.length > 0 
    ? Math.round(categoryGames.reduce((sum, g) => sum + g.popularity, 0) / categoryGames.length)
    : 0;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.name} Games`,
    "description": `Play ${category.name.toLowerCase()} games online for free. ${category.description}`,
    "url": url,
    "keywords": `${category.name.toLowerCase()}, games, online games, free games, browser games`,
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Geometry Dash Spam Games",
      "url": window.location.origin
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": category.name,
          "item": url
        }
      ]
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": `${category.name} Games Collection`,
      "description": `A curated collection of ${categoryGames.length} ${category.name.toLowerCase()} games`,
      "numberOfItems": categoryGames.length,
      "itemListElement": categoryGames.slice(0, 20).map((game, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "VideoGame",
          "name": game.name,
          "description": game.description,
          "image": game.image,
          "url": `${window.location.origin}/game/${encodeURIComponent(game.name)}`,
          "genre": game.category.name,
          "gamePlatform": "Web Browser",
          "operatingSystem": "Any",
          "applicationCategory": "Game",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": game.popularity >= 70 ? {
            "@type": "AggregateRating",
            "ratingValue": Math.round(game.popularity / 20),
            "bestRating": "5",
            "worstRating": "1",
            "ratingCount": Math.floor(game.popularity * 5)
          } : undefined,
          "datePublished": game.dateAdded.toISOString(),
          "keywords": game.tags.join(', ')
        }
      }))
    },
    "about": {
      "@type": "Thing",
      "name": category.name,
      "description": category.description
    },
    "significantLink": featuredGames.length > 0 ? featuredGames.slice(0, 5).map(game => 
      `${window.location.origin}/game/${encodeURIComponent(game.name)}`
    ) : undefined,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".category-description"]
    }
  };
};

/**
 * Generate structured data for game pages
 */
export const generateGameStructuredData = (
  game: Game,
  url: string
): object => {
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": game.name,
    "description": game.description,
    "image": game.image,
    "url": url,
    "genre": game.category.name,
    "gamePlatform": "Web Browser",
    "operatingSystem": "Any",
    "applicationCategory": "Game",
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "isFamilyFriendly": true,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": game.popularity >= 70 ? {
      "@type": "AggregateRating",
      "ratingValue": Math.round(game.popularity / 20),
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": Math.floor(game.popularity * 10)
    } : undefined,
    "datePublished": game.dateAdded.toISOString(),
    "dateModified": game.dateAdded.toISOString(),
    "keywords": game.tags.join(', '),
    "creator": game.metadata?.developer ? {
      "@type": "Organization",
      "name": game.metadata.developer
    } : {
      "@type": "Organization",
      "name": "Geometry Dash Spam Games"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Geometry Dash Spam Games",
      "url": window.location.origin
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": game.category.name,
          "item": `${window.location.origin}/games/category/${game.category.slug}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": game.name,
          "item": url
        }
      ]
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "potentialAction": [
      {
        "@type": "PlayAction",
        "target": url,
        "expectsAcceptanceOf": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "ShareAction",
        "target": url
      }
    ],
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/PlayAction",
      "userInteractionCount": Math.floor(game.popularity * 100)
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".game-description"]
    }
  };
};

/**
 * Generate structured data for game collection pages
 */
export const generateGameCollectionStructuredData = (
  games: Game[],
  title: string,
  description: string,
  url: string
): object => {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": url,
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Geometry Dash Spam Games",
      "url": window.location.origin
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": `${title} Collection`,
      "description": `A collection of ${games.length} games`,
      "numberOfItems": games.length,
      "itemListElement": games.slice(0, 20).map((game, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "VideoGame",
          "name": game.name,
          "description": game.description,
          "image": game.image,
          "url": `${window.location.origin}/game/${encodeURIComponent(game.name)}`,
          "genre": game.category.name
        }
      }))
    }
  };
};

/**
 * Generate structured data for search results
 */
export const generateSearchResultsStructuredData = (
  query: string,
  games: Game[],
  url: string
): object => {
  return {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "name": `Search Results for "${query}"`,
    "description": `Found ${games.length} games matching "${query}"`,
    "url": url,
    "mainEntity": {
      "@type": "ItemList",
      "name": `Search Results for "${query}"`,
      "numberOfItems": games.length,
      "itemListElement": games.slice(0, 20).map((game, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "VideoGame",
          "name": game.name,
          "description": game.description,
          "image": game.image,
          "url": `${window.location.origin}/game/${encodeURIComponent(game.name)}`
        }
      }))
    }
  };
};

/**
 * Generate structured data for website
 */
export const generateWebsiteStructuredData = (url: string): object => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Geometry Dash Spam Games",
    "description": "Play Geometry Dash and other exciting online games for free. No downloads required!",
    "url": url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${window.location.origin}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
};

/**
 * Generate FAQ structured data for game pages
 */
export const generateGameFAQStructuredData = (game: Game): object => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How do I play ${game.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${game.name} is a free online game that you can play directly in your browser. Simply click the play button to start. ${game.metadata?.controls ? `Controls: ${game.metadata.controls}` : ''}`
        }
      },
      {
        "@type": "Question",
        "name": `Is ${game.name} free to play?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes! ${game.name} is completely free to play online. No download or registration required.`
        }
      },
      {
        "@type": "Question",
        "name": `What category is ${game.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${game.name} belongs to the ${game.category.name} category. ${game.category.description}`
        }
      }
    ]
  };
};

/**
 * Generate organization structured data
 */
export const generateOrganizationStructuredData = (): object => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Geometry Dash Spam Games",
    "url": window.location.origin,
    "logo": `${window.location.origin}/favicon-512x512.png`,
    "sameAs": [
      "https://twitter.com/geometrydashspam",
      "https://www.facebook.com/geometrydashspam"
    ]
  };
};

/**
 * Generate breadcrumb structured data
 */
export const generateBreadcrumbStructuredData = (
  breadcrumbs: Array<{ name: string; url: string }>
): object => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};