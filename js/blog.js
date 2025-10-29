// Blog Management System
class BlogManager {
    constructor() {
        this.articles = [];
        this.currentPage = 1;
        this.articlesPerPage = 9;
        this.currentCategory = 'all';
        this.featuredArticle = null;
        this.init();
    }

    init() {
        this.loadArticles();
        this.setupEventListeners();
        this.renderBlog();
    }

    // Load articles from data
    loadArticles() {
        // This would typically come from an API or database
        this.articles = this.getDefaultArticles();
        this.featuredArticle = this.articles.find(article => article.featured);
    }

    // Default articles data
    getDefaultArticles() {
        return [
            {
                id: 1,
                title: "Master Wave Control: Advanced Techniques for Geometry Dash",
                excerpt: "Learn the secrets of perfect wave control with our comprehensive guide covering advanced techniques, practice methods, and common mistakes to avoid.",
                content: "Full article content here...",
                author: {
                    name: "DashMaster Pro",
                    role: "Geometry Dash Expert",
                    avatar: "/images/author-dashmaster.jpg",
                    bio: "Professional Geometry Dash player with 5+ years of experience in wave control and spam techniques."
                },
                category: "tips",
                tags: ["wave control", "advanced", "techniques"],
                publishDate: "2024-10-28",
                readingTime: 8,
                views: 1250,
                featured: true,
                image: "/images/wave-control-guide.jpg",
                slug: "master-wave-control-advanced-techniques"
            },
            {
                id: 2,
                title: "Geometry Dash 2.2 Update: Everything You Need to Know",
                excerpt: "Complete breakdown of the latest Geometry Dash 2.2 update features, new levels, and gameplay mechanics that will change how you play.",
                content: "Full article content here...",
                author: {
                    name: "GDCorrespondent",
                    role: "Game News Reporter",
                    avatar: "/images/author-gdnews.jpg",
                    bio: "Dedicated Geometry Dash journalist bringing you the latest news and updates from the GD world."
                },
                category: "updates",
                tags: ["update", "2.2", "new features"],
                publishDate: "2024-10-25",
                readingTime: 6,
                views: 2100,
                featured: false,
                image: "/images/gd-22-update.jpg",
                slug: "geometry-dash-22-update-everything-you-need-to-know"
            },
            {
                id: 3,
                title: "Community Spotlight: Top 10 Fan-Made Levels This Month",
                excerpt: "Discover the most impressive and creative fan-made levels that have been trending in the Geometry Dash community this month.",
                content: "Full article content here...",
                author: {
                    name: "LevelExplorer",
                    role: "Community Curator",
                    avatar: "/images/author-community.jpg",
                    bio: "Passionate about discovering and showcasing the best creative content from the Geometry Dash community."
                },
                category: "community",
                tags: ["fan-made", "levels", "community"],
                publishDate: "2024-10-22",
                readingTime: 7,
                views: 890,
                featured: false,
                image: "/images/fan-levels-spotlight.jpg",
                slug: "community-spotlight-top-10-fan-made-levels"
            },
            {
                id: 4,
                title: "Complete Guide to CPS Training: From Beginner to Expert",
                excerpt: "Step-by-step guide to improving your clicks per second, with exercises, routines, and pro tips to reach expert level clicking speed.",
                content: "Full article content here...",
                author: {
                    name: "ClickExpert",
                    role: "CPS Training Specialist",
                    avatar: "/images/author-click.jpg",
                    bio: "Specialized in click training techniques and helping players achieve their maximum clicking potential."
                },
                category: "tutorials",
                tags: ["CPS", "training", "beginner guide"],
                publishDate: "2024-10-20",
                readingTime: 10,
                views: 1580,
                featured: false,
                image: "/images/cps-training-guide.jpg",
                slug: "complete-guide-to-cps-training-beginner-to-expert"
            },
            {
                id: 5,
                title: "Top 5 Mistakes Every Geometry Dash Player Makes",
                excerpt: "Learn about the common mistakes that hold back players of all skill levels and how to fix them to improve your gameplay significantly.",
                content: "Full article content here...",
                author: {
                    name: "CoachGD",
                    role: "Game Coach",
                    avatar: "/images/author-coach.jpg",
                    bio: "Experienced Geometry Dash coach helping players overcome common obstacles and reach their full potential."
                },
                category: "tips",
                tags: ["mistakes", "improvement", "tips"],
                publishDate: "2024-10-18",
                readingTime: 5,
                views: 980,
                featured: false,
                image: "/images/common-mistakes.jpg",
                slug: "top-5-mistakes-every-geometry-dash-player-makes"
            },
            {
                id: 6,
                title: "The Ultimate Spam Challenge Strategy Guide",
                excerpt: "Master the art of spam challenges with proven strategies, timing techniques, and practice methods used by top players.",
                content: "Full article content here...",
                author: {
                    name: "SpamKing",
                    role: "Spam Challenge Champion",
                    avatar: "/images/author-spam.jpg",
                    bio: "Multiple spam challenge winner and expert in high-frequency clicking techniques."
                },
                category: "tutorials",
                tags: ["spam", "strategy", "advanced"],
                publishDate: "2024-10-15",
                readingTime: 9,
                views: 1450,
                featured: false,
                image: "/images/spam-strategy.jpg",
                slug: "ultimate-spam-challenge-strategy-guide"
            },
            {
                id: 7,
                title: "Geometry Dash Speedrun Guide: Complete Beginner's Course",
                excerpt: "Everything you need to know to start speedrunning Geometry Dash, from basic concepts to advanced routing and optimization techniques.",
                content: "Full article content here...",
                author: {
                    name: "SpeedRunner",
                    role: "Speedrun Expert",
                    avatar: "/images/author-speedrun.jpg",
                    bio: "Professional speedrunner with multiple world records in various Geometry Dash categories."
                },
                category: "tutorials",
                tags: ["speedrun", "beginner", "routing"],
                publishDate: "2024-10-12",
                readingTime: 12,
                views: 720,
                featured: false,
                image: "/images/speedrun-guide.jpg",
                slug: "geometry-dash-speedrun-guide-complete-beginners-course"
            },
            {
                id: 8,
                title: "Community Event: Halloween Level Design Contest Results",
                excerpt: "Check out the amazing results from our Halloween level design contest, featuring the most creative and spooky levels from the community.",
                content: "Full article content here...",
                author: {
                    name: "EventHost",
                    role: "Community Manager",
                    avatar: "/images/author-event.jpg",
                    bio: "Organizing community events and contests to bring Geometry Dash players together."
                },
                category: "community",
                tags: ["contest", "halloween", "community"],
                publishDate: "2024-10-10",
                readingTime: 8,
                views: 650,
                featured: false,
                image: "/images/halloween-contest.jpg",
                slug: "community-event-halloween-level-design-contest-results"
            },
            {
                id: 9,
                title: "Understanding Geometry Dash Physics: The Science Behind Jumping",
                excerpt: "Deep dive into the mathematical and physical principles that govern Geometry Dash gameplay, helping you understand why certain techniques work.",
                content: "Full article content here...",
                author: {
                    name: "PhysicsExpert",
                    role: "Game Analyst",
                    avatar: "/images/author-physics.jpg",
                    bio: "Analyzing the science behind Geometry Dash mechanics to help players understand the game on a deeper level."
                },
                category: "tips",
                tags: ["physics", "mechanics", "advanced"],
                publishDate: "2024-10-08",
                readingTime: 11,
                views: 890,
                featured: false,
                image: "/images/physics-guide.jpg",
                slug: "understanding-geometry-dash-physics-science-behind-jumping"
            }
        ];
    }

    // Setup event listeners
    setupEventListeners() {
        // Category filters
        document.querySelectorAll('[data-category]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.filterByCategory(e.target.dataset.category);
                this.updateActiveFilter(e.target);
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreArticles();
            });
        }

        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmit(e.target);
            });
        }

        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    // Render blog content
    renderBlog() {
        this.renderFeaturedArticle();
        this.renderBlogGrid();
        this.renderRelatedArticles();
    }

    // Render featured article
    renderFeaturedArticle() {
        if (!this.featuredArticle) return;

        const featuredTitle = document.getElementById('featured-title');
        const featuredExcerpt = document.getElementById('featured-excerpt');
        const featuredDate = document.getElementById('featured-date');
        const featuredAuthorName = document.getElementById('featured-author-name');
        const featuredAuthorRole = document.getElementById('featured-author-role');
        const featuredAuthorAvatar = document.getElementById('featured-author-avatar');
        const featuredLink = document.getElementById('featured-link');

        if (featuredTitle) featuredTitle.textContent = this.featuredArticle.title;
        if (featuredExcerpt) featuredExcerpt.textContent = this.featuredArticle.excerpt;
        if (featuredDate) featuredDate.textContent = this.formatDate(this.featuredArticle.publishDate);
        if (featuredAuthorName) featuredAuthorName.textContent = this.featuredArticle.author.name;
        if (featuredAuthorRole) featuredAuthorRole.textContent = this.featuredArticle.author.role;
        if (featuredAuthorAvatar) featuredAuthorAvatar.src = this.featuredArticle.author.avatar;
        if (featuredLink) featuredLink.href = `/blog/${this.featuredArticle.slug}.html`;
    }

    // Render blog grid
    renderBlogGrid() {
        const blogGrid = document.getElementById('blog-grid');
        if (!blogGrid) return;

        const filteredArticles = this.getFilteredArticles();
        const articlesToShow = filteredArticles.slice(0, this.currentPage * this.articlesPerPage);

        blogGrid.innerHTML = articlesToShow.map(article => this.createArticleCard(article)).join('');

        // Update load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            if (articlesToShow.length >= filteredArticles.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'inline-block';
            }
        }
    }

    // Create article card HTML
    createArticleCard(article) {
        const categoryColors = {
            tips: 'bg-blue-500',
            updates: 'bg-green-500',
            community: 'bg-purple-500',
            tutorials: 'bg-orange-500'
        };

        return `
            <article class="blog-card rounded-xl overflow-hidden shadow-lg">
                <div class="relative">
                    <img src="${article.image}" alt="${article.title}" class="w-full h-48 object-cover">
                    <span class="absolute top-4 left-4 ${categoryColors[article.category]} text-white px-3 py-1 rounded-full text-xs font-semibold">
                        ${this.formatCategory(article.category)}
                    </span>
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-3 line-clamp-2">${article.title}</h3>
                    <p class="text-gray-300 mb-4 line-clamp-3">${article.excerpt}</p>
                    <div class="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <span><i class="fas fa-clock mr-1"></i>${article.readingTime} min read</span>
                        <span><i class="fas fa-eye mr-1"></i>${article.views}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <img src="${article.author.avatar}" alt="${article.author.name}" class="w-8 h-8 rounded-full mr-2">
                            <span class="text-sm">${article.author.name}</span>
                        </div>
                        <a href="/blog/${article.slug}.html" class="text-cyan-400 hover:text-cyan-300 transition">
                            Read More <i class="fas fa-arrow-right ml-1"></i>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }

    // Render related articles
    renderRelatedArticles() {
        const relatedContainer = document.getElementById('related-articles');
        if (!relatedContainer) return;

        const relatedArticles = this.getRandomArticles(3);

        relatedContainer.innerHTML = relatedArticles.map(article => `
            <article class="related-article rounded-xl overflow-hidden shadow-lg">
                <img src="${article.image}" alt="${article.title}" class="w-full h-32 object-cover">
                <div class="p-4">
                    <h4 class="font-bold mb-2 line-clamp-2">${article.title}</h4>
                    <p class="text-sm text-gray-300 mb-3 line-clamp-2">${article.excerpt}</p>
                    <a href="/blog/${article.slug}.html" class="text-cyan-400 hover:text-cyan-300 text-sm font-semibold">
                        Read More →
                    </a>
                </div>
            </article>
        `).join('');
    }

    // Filter articles by category
    filterByCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;
        this.renderBlogGrid();
    }

    // Get filtered articles
    getFilteredArticles() {
        if (this.currentCategory === 'all') {
            return this.articles.filter(article => !article.featured);
        }
        return this.articles.filter(article => article.category === this.currentCategory && !article.featured);
    }

    // Load more articles
    loadMoreArticles() {
        this.currentPage++;
        this.renderBlogGrid();
    }

    // Update active filter
    updateActiveFilter(activeButton) {
        document.querySelectorAll('[data-category]').forEach(button => {
            button.classList.remove('bg-cyan-500');
            button.classList.add('bg-gray-700');
        });
        activeButton.classList.remove('bg-gray-700');
        activeButton.classList.add('bg-cyan-500');
    }

    // Handle newsletter submission
    handleNewsletterSubmit(form) {
        const email = form.querySelector('input[type="email"]').value;
        const message = document.getElementById('newsletter-message');

        // Simulate newsletter subscription
        message.textContent = 'Thank you for subscribing! Check your email for confirmation.';
        message.className = 'mt-4 text-sm text-green-400';
        form.reset();

        // Reset message after 5 seconds
        setTimeout(() => {
            message.textContent = '';
        }, 5000);
    }

    // Get random articles
    getRandomArticles(count) {
        const shuffled = [...this.articles].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // Format date
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Format category
    formatCategory(category) {
        return category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1');
    }

    // Add new article (for admin use)
    addArticle(articleData) {
        const newArticle = {
            id: this.articles.length + 1,
            ...articleData,
            publishDate: new Date().toISOString().split('T')[0],
            views: 0
        };

        this.articles.unshift(newArticle);
        this.renderBlog();

        return newArticle;
    }

    // Update article (for admin use)
    updateArticle(articleId, updates) {
        const index = this.articles.findIndex(article => article.id === articleId);
        if (index !== -1) {
            this.articles[index] = { ...this.articles[index], ...updates };
            this.renderBlog();
            return true;
        }
        return false;
    }

    // Delete article (for admin use)
    deleteArticle(articleId) {
        const index = this.articles.findIndex(article => article.id === articleId);
        if (index !== -1) {
            this.articles.splice(index, 1);
            this.renderBlog();
            return true;
        }
        return false;
    }
}

// Initialize blog manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blogManager = new BlogManager();
});