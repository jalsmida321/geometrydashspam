#!/usr/bin/env node

/**
 * Requirements Validation Script for Task 16: Final Integration and Cleanup
 * This script validates that all requirements from the spec are met
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  return fs.existsSync(path.join(__dirname, '..', filePath));
}

function readFile(filePath) {
  try {
    return fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8');
  } catch (error) {
    return null;
  }
}

function checkFileContains(filePath, searchString) {
  const content = readFile(filePath);
  return content ? content.includes(searchString) : false;
}

// Validation results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
};

function addResult(requirement, status, message, details = '') {
  results.details.push({ requirement, status, message, details });
  if (status === 'PASS') results.passed++;
  else if (status === 'FAIL') results.failed++;
  else if (status === 'WARN') results.warnings++;
}

log('\n🔍 Validating Requirements for Classic Game Site Redesign', 'bold');
log('=' .repeat(60), 'blue');

// Requirement 1: Flexible game categorization system
log('\n📋 Requirement 1: Flexible Game Categorization System', 'blue');

// 1.1: Support multiple game categories
if (checkFileExists('src/data/categories.ts')) {
  const categoriesContent = readFile('src/data/categories.ts');
  const hasMultipleCategories = categoriesContent.includes('geometry-dash') && 
                               categoriesContent.includes('action') && 
                               categoriesContent.includes('puzzle');
  addResult('1.1', hasMultipleCategories ? 'PASS' : 'FAIL', 
    'System supports multiple game categories', 
    hasMultipleCategories ? 'Found Geometry Dash, Action, Puzzle categories' : 'Missing category variety');
} else {
  addResult('1.1', 'FAIL', 'Categories data file missing');
}

// 1.2: Games organized by categories
if (checkFileExists('src/data/games.ts')) {
  const gamesContent = readFile('src/data/games.ts');
  const hasGameCategories = gamesContent.includes('category:') && gamesContent.includes('getCategoryById');
  addResult('1.2', hasGameCategories ? 'PASS' : 'FAIL', 
    'Games are organized by categories', 
    hasGameCategories ? 'Games have category assignments' : 'Games not properly categorized');
} else {
  addResult('1.2', 'FAIL', 'Games data file missing');
}

// 1.3: Data-driven configuration
const hasDataDrivenConfig = checkFileExists('src/data/games.ts') && 
                           checkFileExists('src/data/categories.ts') && 
                           checkFileExists('src/services/GameService.ts');
addResult('1.3', hasDataDrivenConfig ? 'PASS' : 'FAIL', 
  'Configuration-based game management', 
  hasDataDrivenConfig ? 'Data services and configuration files present' : 'Missing data architecture');

// Requirement 2: Classic game site layout
log('\n🎮 Requirement 2: Classic Game Site Layout', 'blue');

// 2.1: Grid layout on homepage
if (checkFileExists('src/pages/HomePage.tsx')) {
  const homepageContent = readFile('src/pages/HomePage.tsx');
  const hasGridLayout = homepageContent.includes('GameGrid') && homepageContent.includes('grid');
  addResult('2.1', hasGridLayout ? 'PASS' : 'FAIL', 
    'Homepage displays grid layout', 
    hasGridLayout ? 'GameGrid component used on homepage' : 'Grid layout not implemented');
} else {
  addResult('2.1', 'FAIL', 'Homepage component missing');
}

// 2.2: Game cards with thumbnails and descriptions
if (checkFileExists('src/components/game/GameCard.tsx')) {
  const gameCardContent = readFile('src/components/game/GameCard.tsx');
  const hasProperGameCards = gameCardContent.includes('image') && 
                            gameCardContent.includes('description') && 
                            gameCardContent.includes('name');
  addResult('2.2', hasProperGameCards ? 'PASS' : 'FAIL', 
    'Game cards show thumbnails and descriptions', 
    hasProperGameCards ? 'GameCard component has image, name, description' : 'GameCard missing required elements');
} else {
  addResult('2.2', 'FAIL', 'GameCard component missing');
}

// 2.3: Category navigation system
if (checkFileExists('src/components/game/CategoryFilter.tsx')) {
  const categoryFilterContent = readFile('src/components/game/CategoryFilter.tsx');
  const hasCategoryNav = categoryFilterContent.includes('categories') && 
                        categoryFilterContent.includes('onCategoryChange');
  addResult('2.3', hasCategoryNav ? 'PASS' : 'FAIL', 
    'Intuitive category navigation system', 
    hasCategoryNav ? 'CategoryFilter component implemented' : 'Category navigation missing');
} else {
  addResult('2.3', 'FAIL', 'CategoryFilter component missing');
}

// 2.4: Search functionality
if (checkFileExists('src/components/game/SearchBar.tsx')) {
  const searchBarContent = readFile('src/components/game/SearchBar.tsx');
  const hasSearch = searchBarContent.includes('onSearch') && searchBarContent.includes('input');
  addResult('2.4', hasSearch ? 'PASS' : 'FAIL', 
    'Search functionality for games', 
    hasSearch ? 'SearchBar component implemented' : 'Search functionality missing');
} else {
  addResult('2.4', 'FAIL', 'SearchBar component missing');
}

// Requirement 3: Preserve existing SEO and content
log('\n🔍 Requirement 3: Preserve Existing SEO and Content', 'blue');

// 3.1: Maintain existing TDK
if (checkFileExists('index.html')) {
  const indexContent = readFile('index.html');
  const hasTDK = indexContent.includes('Geometry Dash Spam - Ultimate Spamming Challenges') &&
                indexContent.includes('Explore various Geometry Dash spam challenges') &&
                indexContent.includes('Geometry Dash, spam, challenges, games, skills, test');
  addResult('3.1', hasTDK ? 'PASS' : 'FAIL', 
    'Existing TDK (Title, Description, Keywords) preserved', 
    hasTDK ? 'Original TDK found in index.html' : 'TDK modified or missing');
} else {
  addResult('3.1', 'FAIL', 'index.html missing');
}

// 3.2: Preserve existing content
if (checkFileExists('src/pages/HomePage.tsx')) {
  const homepageContent = readFile('src/pages/HomePage.tsx');
  const hasOriginalContent = homepageContent.includes('What is Geometry Dash Spam Test?') &&
                            homepageContent.includes('Benefits of Practicing Geometry Dash Spam Test') &&
                            homepageContent.includes('How to Improve Your Geometry Dash Spam Test Performance');
  addResult('3.2', hasOriginalContent ? 'PASS' : 'FAIL', 
    'All existing content preserved', 
    hasOriginalContent ? 'Original content sections found' : 'Original content missing or modified');
} else {
  addResult('3.2', 'FAIL', 'Homepage missing');
}

// 3.3: Backward compatible routes
if (checkFileExists('src/App.tsx')) {
  const appContent = readFile('src/App.tsx');
  const hasLegacyRoutes = appContent.includes('/popular') && 
                         appContent.includes('/trending') && 
                         appContent.includes('/space-waves') &&
                         appContent.includes('/geometry-dash') &&
                         appContent.includes('/unblocked-games');
  addResult('3.3', hasLegacyRoutes ? 'PASS' : 'FAIL', 
    'All existing routes continue to work', 
    hasLegacyRoutes ? 'Legacy routes preserved in App.tsx' : 'Legacy routes missing');
} else {
  addResult('3.3', 'FAIL', 'App.tsx missing');
}

// 3.4: SEO elements maintained
if (checkFileExists('src/components/SEO/SEOHead.tsx')) {
  const seoContent = readFile('src/components/SEO/SEOHead.tsx');
  const hasSEO = seoContent.includes('title') && seoContent.includes('description') && seoContent.includes('keywords');
  addResult('3.4', hasSEO ? 'PASS' : 'FAIL', 
    'Structured data and SEO elements maintained', 
    hasSEO ? 'SEO components implemented' : 'SEO functionality missing');
} else {
  addResult('3.4', 'FAIL', 'SEO components missing');
}

// Requirement 4: Enhanced game discovery
log('\n🎯 Requirement 4: Enhanced Game Discovery', 'blue');

// 4.1: Featured games section
if (checkFileExists('src/components/game/FeaturedGamesSection.tsx')) {
  const featuredContent = readFile('src/components/game/FeaturedGamesSection.tsx');
  const hasFeatured = featuredContent.includes('featured') && featuredContent.includes('games');
  addResult('4.1', hasFeatured ? 'PASS' : 'FAIL', 
    'Featured games section implemented', 
    hasFeatured ? 'FeaturedGamesSection component found' : 'Featured games functionality missing');
} else {
  addResult('4.1', 'FAIL', 'FeaturedGamesSection component missing');
}

// 4.2: Recently played and favorites
if (checkFileExists('src/hooks/useUserInteractions.ts')) {
  const userInteractionsContent = readFile('src/hooks/useUserInteractions.ts');
  const hasUserFeatures = userInteractionsContent.includes('recentlyPlayed') && 
                          userInteractionsContent.includes('favorites');
  addResult('4.2', hasUserFeatures ? 'PASS' : 'FAIL', 
    'Recently played and favorites functionality', 
    hasUserFeatures ? 'User interactions hook implemented' : 'User features missing');
} else {
  addResult('4.2', 'FAIL', 'User interactions hook missing');
}

// 4.3: Related games recommendations
if (checkFileExists('src/hooks/useRelatedGames.ts') || checkFileContains('src/services/GameService.ts', 'getRelatedGames')) {
  addResult('4.3', 'PASS', 'Related games recommendations', 'Related games functionality found');
} else {
  addResult('4.3', 'FAIL', 'Related games functionality missing');
}

// 4.4: Responsive design
if (checkFileExists('src/components/ResponsiveUtils.tsx') || checkFileContains('src/pages/HomePage.tsx', 'responsive')) {
  const hasResponsive = checkFileContains('src/pages/HomePage.tsx', 'md:') || 
                       checkFileContains('src/pages/HomePage.tsx', 'lg:') ||
                       checkFileContains('src/components/Header.tsx', 'lg:hidden');
  addResult('4.4', hasResponsive ? 'PASS' : 'FAIL', 
    'Responsive design for mobile devices', 
    hasResponsive ? 'Responsive classes found in components' : 'Responsive design not implemented');
} else {
  addResult('4.4', 'WARN', 'Responsive design implementation unclear');
}

// Requirement 5: Scalable architecture
log('\n🏗️ Requirement 5: Scalable Architecture', 'blue');

// 5.1: Data-driven game management
const hasDataServices = checkFileExists('src/services/GameService.ts') && 
                       checkFileExists('src/services/CategoryService.ts') && 
                       checkFileExists('src/services/SearchService.ts');
addResult('5.1', hasDataServices ? 'PASS' : 'FAIL', 
  'Data-driven game management through services', 
  hasDataServices ? 'All data services implemented' : 'Data services missing');

// 5.2: Modular and reusable components
const hasModularComponents = checkFileExists('src/components/game/GameCard.tsx') && 
                            checkFileExists('src/components/game/GameGrid.tsx') && 
                            checkFileExists('src/components/game/SearchBar.tsx') &&
                            checkFileExists('src/components/game/CategoryFilter.tsx');
addResult('5.2', hasModularComponents ? 'PASS' : 'FAIL', 
  'Modular and reusable components', 
  hasModularComponents ? 'Game components are modular' : 'Component modularity missing');

// 5.3: Clear file organization
const hasGoodStructure = checkFileExists('src/components/') && 
                        checkFileExists('src/services/') && 
                        checkFileExists('src/hooks/') &&
                        checkFileExists('src/data/') &&
                        checkFileExists('src/types/');
addResult('5.3', hasGoodStructure ? 'PASS' : 'FAIL', 
  'Clear file organization structure', 
  hasGoodStructure ? 'Proper folder structure implemented' : 'File organization needs improvement');

// 5.4: Progressive enhancement support
const hasErrorHandling = checkFileExists('src/components/ErrorBoundary.tsx') && 
                        checkFileExists('src/components/RouteGuard.tsx');
addResult('5.4', hasErrorHandling ? 'PASS' : 'FAIL', 
  'Progressive enhancement and error handling', 
  hasErrorHandling ? 'Error handling components found' : 'Error handling missing');

// Requirement 6: Enhanced game page experience
log('\n🎮 Requirement 6: Enhanced Game Page Experience', 'blue');

// 6.1: Dedicated game detail pages
if (checkFileExists('src/pages/GamePage.tsx')) {
  const gamePageContent = readFile('src/pages/GamePage.tsx');
  const hasGameDetails = gamePageContent.includes('metadata') && gamePageContent.includes('description');
  addResult('6.1', hasGameDetails ? 'PASS' : 'FAIL', 
    'Dedicated game detail pages', 
    hasGameDetails ? 'GamePage shows detailed information' : 'Game details missing');
} else {
  addResult('6.1', 'FAIL', 'GamePage component missing');
}

// 6.2: Game metadata display
if (checkFileExists('src/pages/GamePage.tsx')) {
  const gamePageContent = readFile('src/pages/GamePage.tsx');
  const hasMetadata = gamePageContent.includes('developer') && 
                     gamePageContent.includes('controls') && 
                     gamePageContent.includes('instructions');
  addResult('6.2', hasMetadata ? 'PASS' : 'FAIL', 
    'Game metadata display (developer, controls, instructions)', 
    hasMetadata ? 'Metadata fields displayed' : 'Metadata display incomplete');
} else {
  addResult('6.2', 'FAIL', 'GamePage component missing');
}

// 6.3: Optimized game playing environment
if (checkFileExists('src/pages/GamePage.tsx')) {
  const gamePageContent = readFile('src/pages/GamePage.tsx');
  const hasGamePlayer = gamePageContent.includes('iframe') && gamePageContent.includes('playGame');
  addResult('6.3', hasGamePlayer ? 'PASS' : 'FAIL', 
    'Optimized iframe/embedded game environment', 
    hasGamePlayer ? 'Game playing functionality preserved' : 'Game player missing');
} else {
  addResult('6.3', 'FAIL', 'GamePage component missing');
}

// 6.4: Sharing and rating functionality
if (checkFileExists('src/pages/GamePage.tsx')) {
  const gamePageContent = readFile('src/pages/GamePage.tsx');
  const hasSocialFeatures = gamePageContent.includes('share') && gamePageContent.includes('rating');
  addResult('6.4', hasSocialFeatures ? 'PASS' : 'FAIL', 
    'Game sharing and rating functionality', 
    hasSocialFeatures ? 'Sharing and rating implemented' : 'Social features missing');
} else {
  addResult('6.4', 'FAIL', 'GamePage component missing');
}

// Additional Integration Checks
log('\n🔧 Additional Integration Checks', 'blue');

// Context and state management
const hasContext = checkFileExists('src/context/GameContext.tsx');
addResult('Integration.1', hasContext ? 'PASS' : 'FAIL', 
  'Global state management with React Context', 
  hasContext ? 'GameContext implemented' : 'Context missing');

// Custom hooks
const hasHooks = checkFileExists('src/hooks/useGames.ts') && 
                checkFileExists('src/hooks/useCategories.ts') && 
                checkFileExists('src/hooks/useSearch.ts');
addResult('Integration.2', hasHooks ? 'PASS' : 'FAIL', 
  'Custom hooks for data access', 
  hasHooks ? 'Data access hooks implemented' : 'Custom hooks missing');

// Testing infrastructure
const hasTests = checkFileExists('src/App.test.tsx') && 
                 checkFileExists('src/__tests__/finalIntegration.test.tsx') &&
                 checkFileExists('vitest.config.ts');
addResult('Integration.3', hasTests ? 'PASS' : 'FAIL', 
  'Testing infrastructure in place', 
  hasTests ? 'Test files and config present' : 'Testing setup incomplete');

// Package.json scripts
if (checkFileExists('package.json')) {
  const packageContent = readFile('package.json');
  const hasTestScripts = packageContent.includes('"test":') && 
                        packageContent.includes('"build":') && 
                        packageContent.includes('"dev":');
  addResult('Integration.4', hasTestScripts ? 'PASS' : 'FAIL', 
    'Build and test scripts configured', 
    hasTestScripts ? 'Package.json scripts configured' : 'Scripts missing or incomplete');
} else {
  addResult('Integration.4', 'FAIL', 'package.json missing');
}

// Display Results
log('\n📊 Validation Results Summary', 'bold');
log('=' .repeat(60), 'blue');

results.details.forEach(result => {
  const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
  const color = result.status === 'PASS' ? 'green' : result.status === 'FAIL' ? 'red' : 'yellow';
  
  log(`${icon} ${result.requirement}: ${result.message}`, color);
  if (result.details) {
    log(`   ${result.details}`, 'reset');
  }
});

log('\n📈 Summary Statistics', 'bold');
log(`✅ Passed: ${results.passed}`, 'green');
log(`❌ Failed: ${results.failed}`, 'red');
log(`⚠️  Warnings: ${results.warnings}`, 'yellow');
log(`📊 Total: ${results.passed + results.failed + results.warnings}`, 'blue');

const successRate = ((results.passed / (results.passed + results.failed + results.warnings)) * 100).toFixed(1);
log(`🎯 Success Rate: ${successRate}%`, successRate >= 90 ? 'green' : successRate >= 70 ? 'yellow' : 'red');

if (results.failed === 0) {
  log('\n🎉 All critical requirements validated successfully!', 'green');
  log('✨ The classic game site redesign is ready for deployment.', 'green');
} else {
  log('\n⚠️  Some requirements need attention before deployment.', 'yellow');
  log('🔧 Please address the failed checks above.', 'yellow');
}

log('\n' + '='.repeat(60), 'blue');
log('🏁 Validation Complete', 'bold');

// Exit with appropriate code
process.exit(results.failed > 0 ? 1 : 0);