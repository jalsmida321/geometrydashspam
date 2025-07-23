import { Game, GameCategory } from '../types/game';

/**
 * SEO utility functions for generating sitemaps, meta descriptions, etc.
 */

/**
 * Generate sitemap XML content
 */
export const generateSitemap = (games: Game[], categories: GameCategory[]): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://geometrydashspam.com';
  const currentDate = new Date().toISOString().split('T')[0];

  const urls = [
    // Homepage
    {
      loc: baseUrl,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    },
    // All games page
    {
      loc: `${baseUrl}/games`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    },
    // Favorites page
    {
      loc: `${baseUrl}/favorites`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    // Search page
    {
      loc: `${baseUrl}/search`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.6'
    },
    // Category pages
    ...categories.map(category => ({
      loc: `${baseUrl}/games/category/${category.slug}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    })),
    // Individual game pages
    ...games.map(game => ({
      loc: `${baseUrl}/game/${encodeURIComponent(game.name)}`,
      lastmod: game.dateAdded.toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: game.featured ? '0.9' : '0.7'
    })),
    // Legacy pages
    {
      loc: `${baseUrl}/popular`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/trending`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8'
    }
  ];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xmlContent;
};

/**
 * Generate robots.txt content
 */
export const generateRobotsTxt = (): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://geometrydashspam.com';
  
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Allow all major search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

# Block AI training bots (optional)
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /`;
};

/**
 * Generate optimized meta description based on content
 */
export const generateMetaDescription = (
  type: 'game' | 'category' | 'homepage' | 'search',
  data?: {
    game?: Game;
    category?: GameCategory;
    searchQuery?: string;
    gameCount?: number;
  }
): string => {
  const maxLength = 160;
  
  switch (type) {
    case 'game':
      if (data?.game) {
        const description = `Play ${data.game.name} online for free! ${data.game.description} No download required - start playing instantly in your browser.`;
        return description.length > maxLength ? description.substring(0, maxLength - 3) + '...' : description;
      }
      break;
      
    case 'category':
      if (data?.category && data?.gameCount) {
        const description = `Discover ${data.gameCount} amazing ${data.category.name.toLowerCase()} games! ${data.category.description} Play for free online.`;
        return description.length > maxLength ? description.substring(0, maxLength - 3) + '...' : description;
      }
      break;
      
    case 'search':
      if (data?.searchQuery && data?.gameCount) {
        const description = `Found ${data.gameCount} games matching "${data.searchQuery}". Play your favorite games online for free!`;
        return description.length > maxLength ? description.substring(0, maxLength - 3) + '...' : description;
      }
      break;
      
    case 'homepage':
    default:
      return 'Play Geometry Dash Spam games and other exciting online games for free! Test your skills with challenging levels and compete with players worldwide.';
  }
  
  return 'Play amazing online games for free! Discover new challenges and test your skills.';
};

/**
 * Generate structured data for breadcrumbs
 */
export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{ name: string; url: string }>) => {
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

/**
 * Generate FAQ structured data for game pages
 */
export const generateGameFAQStructuredData = (game: Game) => {
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
 * Extract keywords from game content
 */
export const extractGameKeywords = (game: Game): string[] => {
  const keywords = new Set<string>();
  
  // Add game name variations
  keywords.add(game.name.toLowerCase());
  keywords.add(game.name.toLowerCase().replace(/\s+/g, ''));
  
  // Add category keywords
  keywords.add(game.category.name.toLowerCase());
  keywords.add(`${game.category.name.toLowerCase()} games`);
  
  // Add tags
  game.tags.forEach(tag => {
    keywords.add(tag.toLowerCase());
    keywords.add(`${tag.toLowerCase()} games`);
  });
  
  // Add common gaming keywords
  keywords.add('online game');
  keywords.add('free game');
  keywords.add('browser game');
  keywords.add('web game');
  keywords.add('html5 game');
  
  // Add developer if available
  if (game.metadata?.developer) {
    keywords.add(game.metadata.developer.toLowerCase());
  }
  
  return Array.from(keywords);
};

/**
 * Generate Open Graph image URL for games
 */
export const generateOGImageUrl = (game: Game): string => {
  // If game has a high-quality image, use it
  if (game.image && game.image.includes('http')) {
    return game.image;
  }
  
  // Fallback to a generated image or default
  return 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-spam-test.png';
};

/**
 * Validate and clean meta content
 */
export const cleanMetaContent = (content: string, maxLength: number = 160): string => {
  // Remove HTML tags
  const cleaned = content.replace(/<[^>]*>/g, '');
  
  // Remove extra whitespace
  const normalized = cleaned.replace(/\s+/g, ' ').trim();
  
  // Truncate if too long
  if (normalized.length > maxLength) {
    return normalized.substring(0, maxLength - 3) + '...';
  }
  
  return normalized;
};