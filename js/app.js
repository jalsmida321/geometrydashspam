// Game data configuration
const gamesConfig = {
    games: [
        {
            id: 'geometry-dash-spam-test',
            name: "Geometry Dash Spam Test",
            title: "Geometry Dash Spam Test",
            description: "Test your spamming skills in this exciting Geometry Dash challenge!",
            image: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-spam-test.png",
            url: "/games/geometry-dash-spam-test.html",
            difficulty: 'Easy',
            color: 'from-blue-500 to-cyan-600',
            plays: 15420,
            rating: 4.5
        },
        {
            id: 'geometry-dash-spam-challenge',
            name: "Geometry Dash Spam Challenge",
            title: "Geometry Dash Spam Challenge",
            description: "Push your limits in this intense Geometry Dash spam challenge!",
            image: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-spam-challenge.png",
            url: "/games/geometry-dash-spam-challenge.html",
            difficulty: 'Medium',
            color: 'from-purple-500 to-pink-600',
            plays: 12340,
            rating: 4.6
        },
        {
            id: 'geometry-dash-spam-master',
            name: "Geometry Dash Spam Master",
            title: "Geometry Dash Spam Master",
            description: "Become the ultimate spam master in this Geometry Dash game!",
            image: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-spam-master.png",
            url: "/games/geometry-dash-spam-master.html",
            difficulty: 'Hard',
            color: 'from-orange-500 to-red-600',
            plays: 9876,
            rating: 4.7
        },
        {
            id: 'geometry-dash-spam-wave',
            name: "Geometry Dash Spam Wave",
            title: "Geometry Dash Spam Wave",
            description: "Master the wave in this challenging Geometry Dash spam game!",
            image: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-spam-wave.png",
            url: "/games/geometry-dash-spam-wave.html",
            difficulty: 'Hard',
            color: 'from-cyan-500 to-blue-600',
            plays: 8765,
            rating: 4.8
        },
        {
            id: 'geometry-dash-spam-chall',
            name: "Geometry Dash Spam Challenge Chall",
            title: "Geometry Dash Spam Chall",
            description: "Take on the ultimate spam challenge in this Geometry Dash game!",
            image: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-spam-chall.png",
            url: "/games/geometry-dash-spam-chall.html",
            difficulty: 'Extreme',
            color: 'from-red-500 to-yellow-600',
            plays: 7654,
            rating: 4.9
        },
        {
            id: 'aka-geometry-dash-spam',
            name: "AKA Geometry Dash Spam",
            title: "AKA Geometry Dash Spam",
            description: "Experience a unique twist on Geometry Dash spam gameplay!",
            image: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/AKA-geometry-dash-spam.png",
            url: "/games/aka-geometry-dash-spam.html",
            difficulty: 'Medium',
            color: 'from-green-500 to-teal-600',
            plays: 6789,
            rating: 4.4
        },
        {
            id: 'geometry-dash-wave-spam',
            name: "Geometry Dash Wave Spam",
            title: "Geometry Dash Wave Spam",
            description: "This is geometry dash wave spam as much as you can and try to get through the impossible level",
            image: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-wave-spam.png",
            url: "/games/geometry-dash-wave-spam.html",
            difficulty: 'Extreme',
            color: 'from-indigo-500 to-purple-600',
            plays: 5432,
            rating: 4.6
        }
    ]
};

// Game management class
class GameHub {
    constructor() {
        this.games = gamesConfig.games;
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.renderGames();
        this.setupEventListeners();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
    }

    renderGames(filter = 'all') {
        const gamesGrid = document.getElementById('games-grid');
        const filteredGames = filter === 'all' 
            ? this.games 
            : this.games.filter(game => game.difficulty.toLowerCase() === filter);

        gamesGrid.innerHTML = filteredGames.map(game => this.createGameCard(game)).join('');
        
        // Add click listeners to game cards
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => this.handleGameClick(card.dataset.gameId));
        });
    }

    createGameCard(game) {
        const difficultyColor = {
            'Easy': 'text-green-400',
            'Medium': 'text-yellow-400',
            'Hard': 'text-orange-400',
            'Extreme': 'text-red-400'
        }[game.difficulty];

        return `
            <div class="game-card bg-gray-700 rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105" data-game-id="${game.id}">
                <div class="aspect-video bg-gray-600 relative overflow-hidden">
                    <img src="${game.image}" alt="${game.title}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div class="absolute bottom-2 left-2 right-2">
                        <div class="flex justify-between items-center">
                            <span class="${difficultyColor} text-xs font-semibold bg-black/50 px-2 py-1 rounded">
                                <i class="fas fa-signal mr-1"></i>${game.difficulty}
                            </span>
                            <div class="flex items-center text-yellow-400 text-xs">
                                <i class="fas fa-star mr-1"></i>
                                <span>${game.rating}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="text-lg font-bold mb-2 game-font">${game.title}</h3>
                    <p class="text-gray-400 text-sm mb-3 line-clamp-2">${game.description}</p>
                    <div class="flex justify-between items-center">
                        <div class="text-gray-500 text-xs">
                            <i class="fas fa-play mr-1"></i>
                            <span>${this.formatNumber(game.plays)} plays</span>
                        </div>
                        <div class="bg-gradient-to-r ${game.color} px-3 py-1 rounded-full text-xs font-semibold">
                            Play Now
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    handleGameClick(gameId) {
        const game = this.games.find(g => g.id === gameId);
        if (game) {
            // Track game play (you can integrate with analytics here)
            console.log(`Playing game: ${game.title}`);
            
            // Open game URL in the same tab
            if (game.url) {
                window.location.href = game.url;
            } else {
                // Fallback to modal if no URL
                this.showGameModal(game);
            }
        }
    }

    showGameModal(game) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-lg overflow-hidden max-w-md w-full">
                <div class="relative">
                    <img src="${game.image}" alt="${game.title}" class="w-full h-48 object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div class="absolute bottom-4 left-4 right-4">
                        <h2 class="text-2xl font-bold game-font text-white">${game.title}</h2>
                    </div>
                </div>
                <div class="p-6">
                    <p class="text-gray-300 mb-4">${game.description}</p>
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-gray-700 p-3 rounded text-center">
                            <div class="text-gray-400 text-sm">Difficulty</div>
                            <div class="font-bold">${game.difficulty}</div>
                        </div>
                        <div class="bg-gray-700 p-3 rounded text-center">
                            <div class="text-gray-400 text-sm">Rating</div>
                            <div class="font-bold text-yellow-400">${game.rating}/5</div>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        ${game.url ? 
                            `<button onclick="window.open('${game.url}', '_blank'); this.closest('.fixed').remove();" class="flex-1 bg-gradient-to-r ${game.color || 'from-blue-500 to-purple-600'} hover:opacity-90 py-3 rounded font-bold transition">
                                <i class="fas fa-external-link-alt mr-2"></i>Play Game
                            </button>` :
                            `<button onclick="gameHub.startGame('${game.id}')" class="flex-1 bg-gradient-to-r ${game.color || 'from-blue-500 to-purple-600'} hover:opacity-90 py-3 rounded font-bold transition">
                                <i class="fas fa-play mr-2"></i>Play Now
                            </button>`
                        }
                        <button onclick="this.closest('.fixed').remove()" class="px-6 bg-gray-700 hover:bg-gray-600 py-3 rounded font-bold transition">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Close modal on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    startGame(gameId) {
        // Remove modal
        document.querySelector('.fixed.inset-0')?.remove();
        
        // Here you would typically navigate to the game page or load the game
        console.log(`Starting game: ${gameId}`);
        alert(`Game ${gameId} would start here! This is where you'd integrate the actual game.`);
    }

    setupEventListeners() {
        // Filter buttons (if you add them later)
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentFilter = btn.dataset.filter;
                this.renderGames(this.currentFilter);
            });
        });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        // Add a check to ensure the button exists before adding an event listener
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
            
            // Close mobile menu when clicking a link
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            });
        }
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Method to add new games dynamically
    addGame(gameData) {
        this.games.push({
            id: gameData.id || Date.now().toString(),
            name: gameData.name || gameData.title,
            title: gameData.title,
            description: gameData.description,
            image: gameData.image,
            url: gameData.url,
            difficulty: gameData.difficulty || 'Medium',
            color: gameData.color || 'from-blue-500 to-purple-600',
            plays: gameData.plays || 0,
            rating: gameData.rating || 0
        });
        this.renderGames(this.currentFilter);
    }
}

// Initialize the game hub when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gameHub = new GameHub();
});

// Utility functions for game management
function createGamePage(gameId) {
    const game = gamesConfig.games.find(g => g.id === gameId);
    if (!game) return '';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${game.title} - Geometry Dash Spam</title>
    <meta name="description" content="${game.description}" />
    <meta name="keywords" content="Geometry Dash, ${game.title}, spam, challenge, game" />
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        .game-font { font-family: 'Orbitron', monospace; }
    </style>
</head>
<body class="bg-gray-900 text-white">
    <!-- Navigation (same as index) -->
    <nav class="bg-gray-800 shadow-lg sticky top-0 z-50">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center py-4">
                <div class="flex items-center space-x-2">
                    <i class="fas fa-cube text-2xl text-cyan-400"></i>
                    <h1 class="text-2xl font-bold game-font">
                        <a href="/" class="gradient-text">Geometry Dash Spam</a>
                    </h1>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/" class="hover:text-cyan-400 transition">
                        <i class="fas fa-arrow-left mr-2"></i>Back to Games
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Game Content -->
    <main class="container mx-auto px-4 py-8">
        <div class="text-center mb-8">
            <div class="bg-gradient-to-br ${game.color} p-8 rounded-lg inline-block mb-6">
                <i class="fas ${game.icon} text-8xl text-white"></i>
            </div>
            <h1 class="text-5xl font-bold game-font mb-4">${game.title}</h1>
            <p class="text-xl text-gray-300 mb-6">${game.description}</p>
            <div class="flex justify-center gap-4 mb-8">
                <span class="bg-gray-800 px-4 py-2 rounded-full">
                    <i class="fas fa-signal mr-2 text-yellow-400"></i>
                    ${game.difficulty}
                </span>
                <span class="bg-gray-800 px-4 py-2 rounded-full">
                    <i class="fas fa-star mr-2 text-yellow-400"></i>
                    ${game.rating}/5
                </span>
                <span class="bg-gray-800 px-4 py-2 rounded-full">
                    <i class="fas fa-play mr-2 text-green-400"></i>
                    ${game.plays} plays
                </span>
            </div>
        </div>

        <!-- Game Container -->
        <div class="max-w-4xl mx-auto">
            <div class="bg-gray-800 rounded-lg p-8">
                <div id="game-container" class="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-6">
                    <div class="text-center">
                        <i class="fas fa-play-circle text-6xl text-cyan-400 mb-4"></i>
                        <p class="text-xl">Game will load here</p>
                    </div>
                </div>
                
                <!-- Game Controls -->
                <div class="flex justify-center gap-4 mb-6">
                    <button onclick="startGame()" class="bg-green-600 hover:bg-green-700 px-8 py-3 rounded font-bold transition">
                        <i class="fas fa-play mr-2"></i>Start Game
                    </button>
                    <button onclick="pauseGame()" class="bg-yellow-600 hover:bg-yellow-700 px-8 py-3 rounded font-bold transition">
                        <i class="fas fa-pause mr-2"></i>Pause
                    </button>
                    <button onclick="resetGame()" class="bg-red-600 hover:bg-red-700 px-8 py-3 rounded font-bold transition">
                        <i class="fas fa-redo mr-2"></i>Reset
                    </button>
                </div>

                <!-- Game Instructions -->
                <div class="bg-gray-700 rounded-lg p-6">
                    <h3 class="text-2xl font-bold mb-4">How to Play</h3>
                    <ul class="space-y-2 text-gray-300">
                        <li><i class="fas fa-check text-green-400 mr-2"></i>Click or press Space to jump</li>
                        <li><i class="fas fa-check text-green-400 mr-2"></i>Avoid obstacles and stay on track</li>
                        <li><i class="fas fa-check text-green-400 mr-2"></i>Time your clicks perfectly</li>
                        <li><i class="fas fa-check text-green-400 mr-2"></i>Survive as long as possible</li>
                    </ul>
                </div>
            </div>
        </div>
    </main>

    <script>
        // Game-specific logic would go here
        function startGame() {
            alert('Game would start here! Implement your game logic in this section.');
        }
        function pauseGame() {
            alert('Pause functionality would be implemented here.');
        }
        function resetGame() {
            alert('Reset functionality would be implemented here.');
        }
    </script>
</body>
</html>
    `;
}