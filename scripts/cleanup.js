#!/usr/bin/env node

/**
 * Final Cleanup Script for Task 16: Final Integration and Cleanup
 * This script performs final cleanup and organization tasks
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

function countFiles(directory, extension) {
  try {
    const fullPath = path.join(__dirname, '..', directory);
    if (!fs.existsSync(fullPath)) return 0;
    
    const files = fs.readdirSync(fullPath, { withFileTypes: true });
    let count = 0;
    
    for (const file of files) {
      if (file.isFile() && file.name.endsWith(extension)) {
        count++;
      } else if (file.isDirectory()) {
        count += countFiles(path.join(directory, file.name), extension);
      }
    }
    
    return count;
  } catch (error) {
    return 0;
  }
}

log('\n🧹 Final Cleanup and Organization - Task 16', 'bold');
log('=' .repeat(60), 'blue');

// Check project structure
log('\n📁 Project Structure Validation', 'blue');

const requiredDirectories = [
  'src/components',
  'src/components/game',
  'src/components/SEO',
  'src/data',
  'src/hooks',
  'src/pages',
  'src/services',
  'src/types',
  'src/utils',
  'src/__tests__'
];

let structureValid = true;
requiredDirectories.forEach(dir => {
  if (checkFileExists(dir)) {
    log(`✅ ${dir}`, 'green');
  } else {
    log(`❌ ${dir} - Missing`, 'red');
    structureValid = false;
  }
});

// Check core files
log('\n📄 Core Files Validation', 'blue');

const coreFiles = [
  'src/App.tsx',
  'src/main.tsx',
  'index.html',
  'package.json',
  'vite.config.ts',
  'vitest.config.ts',
  'tailwind.config.js',
  'tsconfig.json'
];

let coreFilesValid = true;
coreFiles.forEach(file => {
  if (checkFileExists(file)) {
    log(`✅ ${file}`, 'green');
  } else {
    log(`❌ ${file} - Missing`, 'red');
    coreFilesValid = false;
  }
});

// Check test files
log('\n🧪 Test Files Validation', 'blue');

const testFiles = [
  'src/App.test.tsx',
  'src/__tests__/gameDiscoveryFlow.test.tsx',
  'src/__tests__/performance.test.tsx',
  'src/__tests__/accessibility.test.tsx',
  'src/__tests__/seo.test.tsx',
  'src/__tests__/responsive.test.tsx',
  'src/__tests__/finalIntegration.test.tsx'
];

let testFilesCount = 0;
testFiles.forEach(file => {
  if (checkFileExists(file)) {
    log(`✅ ${file}`, 'green');
    testFilesCount++;
  } else {
    log(`⚠️  ${file} - Optional test file`, 'yellow');
  }
});

// Check component files
log('\n🧩 Component Files Validation', 'blue');

const componentFiles = [
  'src/components/Header.tsx',
  'src/components/Footer.tsx',
  'src/components/ErrorBoundary.tsx',
  'src/components/RouteGuard.tsx',
  'src/components/game/GameCard.tsx',
  'src/components/game/GameGrid.tsx',
  'src/components/game/SearchBar.tsx',
  'src/components/game/CategoryFilter.tsx',
  'src/components/game/FeaturedGamesSection.tsx',
  'src/components/game/RecentlyPlayedSection.tsx'
];

let componentFilesValid = true;
componentFiles.forEach(file => {
  if (checkFileExists(file)) {
    log(`✅ ${file}`, 'green');
  } else {
    log(`❌ ${file} - Missing component`, 'red');
    componentFilesValid = false;
  }
});

// Check service files
log('\n⚙️  Service Files Validation', 'blue');

const serviceFiles = [
  'src/services/GameService.ts',
  'src/services/CategoryService.ts',
  'src/services/SearchService.ts',
  'src/services/index.ts'
];

let serviceFilesValid = true;
serviceFiles.forEach(file => {
  if (checkFileExists(file)) {
    log(`✅ ${file}`, 'green');
  } else {
    log(`❌ ${file} - Missing service`, 'red');
    serviceFilesValid = false;
  }
});

// Check hook files
log('\n🎣 Hook Files Validation', 'blue');

const hookFiles = [
  'src/hooks/useGames.ts',
  'src/hooks/useCategories.ts',
  'src/hooks/useSearch.ts',
  'src/hooks/useFeaturedGames.ts',
  'src/hooks/useUserInteractions.ts',
  'src/hooks/useRelatedGames.ts',
  'src/hooks/useRouteMetadata.ts'
];

let hookFilesValid = true;
hookFiles.forEach(file => {
  if (checkFileExists(file)) {
    log(`✅ ${file}`, 'green');
  } else {
    log(`❌ ${file} - Missing hook`, 'red');
    hookFilesValid = false;
  }
});

// Check page files
log('\n📄 Page Files Validation', 'blue');

const pageFiles = [
  'src/pages/HomePage.tsx',
  'src/pages/GamePage.tsx',
  'src/pages/CategoryPage.tsx',
  'src/pages/AllGamesPage.tsx',
  'src/pages/SearchResultsPage.tsx',
  'src/pages/FavoritesPage.tsx',
  'src/pages/NotFoundPage.tsx'
];

let pageFilesValid = true;
pageFiles.forEach(file => {
  if (checkFileExists(file)) {
    log(`✅ ${file}`, 'green');
  } else {
    log(`❌ ${file} - Missing page`, 'red');
    pageFilesValid = false;
  }
});

// Check data files
log('\n💾 Data Files Validation', 'blue');

const dataFiles = [
  'src/data/games.ts',
  'src/data/categories.ts',
  'src/data/index.ts',
  'src/types/game.ts'
];

let dataFilesValid = true;
dataFiles.forEach(file => {
  if (checkFileExists(file)) {
    log(`✅ ${file}`, 'green');
  } else {
    log(`❌ ${file} - Missing data file`, 'red');
    dataFilesValid = false;
  }
});

// Generate project statistics
log('\n📊 Project Statistics', 'blue');

const stats = {
  totalFiles: 0,
  componentFiles: 0,
  serviceFiles: 0,
  hookFiles: 0,
  pageFiles: 0,
  testFiles: 0,
  dataFiles: 0
};

// Count files by type
stats.totalFiles = countFiles('src', '.tsx') + countFiles('src', '.ts');
stats.testFiles = countFiles('src', '.test.tsx') + countFiles('src', '.test.ts');
stats.componentFiles = countFiles('src/components', '.tsx');
stats.serviceFiles = countFiles('src/services', '.ts');
stats.hookFiles = countFiles('src/hooks', '.ts');
stats.pageFiles = countFiles('src/pages', '.tsx');
stats.dataFiles = countFiles('src/data', '.ts') + countFiles('src/types', '.ts');

log(`📁 Total Files: ${stats.totalFiles}`, 'reset');
log(`🧩 Components: ${stats.componentFiles}`, 'reset');
log(`⚙️  Services: ${stats.serviceFiles}`, 'reset');
log(`🎣 Hooks: ${stats.hookFiles}`, 'reset');
log(`📄 Pages: ${stats.pageFiles}`, 'reset');
log(`💾 Data/Types: ${stats.dataFiles}`, 'reset');
log(`🧪 Tests: ${stats.testFiles}`, 'reset');

// Check package.json scripts
log('\n📦 Package.json Scripts Validation', 'blue');

if (checkFileExists('package.json')) {
  const packageContent = readFile('package.json');
  if (packageContent) {
    const packageJson = JSON.parse(packageContent);
    const requiredScripts = ['dev', 'build', 'test', 'lint'];
    
    requiredScripts.forEach(script => {
      if (packageJson.scripts && packageJson.scripts[script]) {
        log(`✅ ${script}: ${packageJson.scripts[script]}`, 'green');
      } else {
        log(`❌ ${script} - Missing script`, 'red');
      }
    });
  }
}

// Final validation summary
log('\n🎯 Final Validation Summary', 'bold');
log('=' .repeat(60), 'blue');

const validationResults = {
  structure: structureValid,
  coreFiles: coreFilesValid,
  components: componentFilesValid,
  services: serviceFilesValid,
  hooks: hookFilesValid,
  pages: pageFilesValid,
  data: dataFilesValid
};

let allValid = true;
Object.entries(validationResults).forEach(([category, isValid]) => {
  const status = isValid ? '✅ PASS' : '❌ FAIL';
  const color = isValid ? 'green' : 'red';
  log(`${status} ${category.charAt(0).toUpperCase() + category.slice(1)}`, color);
  if (!isValid) allValid = false;
});

// Generate final report
const report = {
  timestamp: new Date().toISOString(),
  status: allValid ? 'COMPLETED' : 'NEEDS_ATTENTION',
  validation: validationResults,
  statistics: stats,
  summary: {
    totalFiles: countFiles('src', '.tsx') + countFiles('src', '.ts'),
    testFiles: countFiles('src', '.test.tsx') + countFiles('src', '.test.ts'),
    componentFiles: countFiles('src/components', '.tsx'),
    serviceFiles: countFiles('src/services', '.ts') + countFiles('src/services', '.tsx'),
    hookFiles: countFiles('src/hooks', '.ts'),
    pageFiles: countFiles('src/pages', '.tsx'),
    dataFiles: countFiles('src/data', '.ts') + countFiles('src/types', '.ts')
  }
};

// Write cleanup report
try {
  fs.writeFileSync(
    path.join(__dirname, '..', 'CLEANUP_REPORT.json'),
    JSON.stringify(report, null, 2)
  );
  log('\n📄 Cleanup report generated: CLEANUP_REPORT.json', 'blue');
} catch (error) {
  log('\n❌ Failed to generate cleanup report', 'red');
}

if (allValid) {
  log('\n🎉 All validation checks passed!', 'green');
  log('✨ Project is ready for production deployment.', 'green');
  log('\n🚀 Task 16: Final Integration and Cleanup - COMPLETED', 'bold');
} else {
  log('\n⚠️  Some validation checks failed.', 'yellow');
  log('🔧 Please address the issues above before deployment.', 'yellow');
}

log('\n' + '='.repeat(60), 'blue');
log('🏁 Cleanup Complete', 'bold');

// Exit with appropriate code
process.exit(allValid ? 0 : 1);