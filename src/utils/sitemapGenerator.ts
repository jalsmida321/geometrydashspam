import { Game, GameCategory } from '../types/game';

/**
 * Generate a complete sitemap XML for the website
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
    },
    {
      loc: `${baseUrl}/space-waves`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/geometry-dash`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/unblocked-games`,
      lastmod: currentDate,
      changefreq: 'weekly',
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
 * Generate a sitemap index XML for multiple sitemaps
 */
export const generateSitemapIndex = (sitemapUrls: string[]): string => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

  return xmlContent;
};

/**
 * Generate robots.txt content
 */
export const generateRobotsTxt = (sitemapUrl: string): string => {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${sitemapUrl}

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
 * Generate a sitemap for a specific category
 */
export const generateCategorySitemap = (category: GameCategory, games: Game[]): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://geometrydashspam.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const categoryGames = games.filter(game => game.category.id === category.id);
  
  const urls = [
    // Category page
    {
      loc: `${baseUrl}/games/category/${category.slug}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    },
    // Games in this category
    ...categoryGames.map(game => ({
      loc: `${baseUrl}/game/${encodeURIComponent(game.name)}`,
      lastmod: game.dateAdded.toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: game.featured ? '0.9' : '0.7'
    }))
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
 * Write sitemap to file (for server-side use)
 */
export const writeSitemapToFile = async (sitemap: string, filePath: string): Promise<void> => {
  try {
    // This function would be implemented differently depending on the environment
    // For browser environments, you might use the File System Access API
    // For Node.js environments, you would use the fs module
    console.log('Writing sitemap to file:', filePath);
    // Implementation depends on environment
  } catch (error) {
    console.error('Error writing sitemap to file:', error);
  }
};

/**
 * Generate and update sitemap.xml and robots.txt files
 */
export const updateSitemapAndRobots = async (
  games: Game[], 
  categories: GameCategory[]
): Promise<void> => {
  try {
    const sitemap = generateSitemap(games, categories);
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://geometrydashspam.com';
    const robotsTxt = generateRobotsTxt(`${baseUrl}/sitemap.xml`);
    
    // Implementation for saving these files would depend on the environment
    console.log('Generated sitemap and robots.txt');
  } catch (error) {
    console.error('Error updating sitemap and robots.txt:', error);
  }
};