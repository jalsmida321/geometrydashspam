# Geometry Dash Spam - HTML5 + Tailwind CSS Version

A modern, responsive gaming website built with HTML5, Tailwind CSS, and vanilla JavaScript.

## Features

- 🎮 **8 Unique Spam Challenges** - From Classic to Extreme difficulty
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI/UX** - Beautiful gradients, animations, and hover effects
- ⚡ **Fast Loading** - Optimized for performance
- 🔧 **Easy to Extend** - Modular JavaScript structure for adding new games

## Project Structure

```
├── index.html          # Main page with all games
├── js/
│   └── app.js         # Main JavaScript with GameHub class
├── games/             # Individual game pages (to be created)
│   ├── classic-spam.html
│   ├── extreme-spam.html
│   └── ...
└── assets/            # Images and other assets
```

## Adding New Games

1. **Add game data to `js/app.js`:**
```javascript
{
    id: 'your-game-id',
    name: "Your Game Name",
    title: "Your Game Title",
    description: "Brief description of your game",
    image: "https://your-cdn.com/game-preview.png", // Preview image URL
    url: "https://your-cdn.com/game.html", // Game URL
    difficulty: 'Easy|Medium|Hard|Extreme',
    color: 'from-blue-500 to-purple-600', // Gradient colors
    plays: 0,
    rating: 0
}
```

2. **Link from the main page:**
   - Games are automatically linked through the GameHub class
   - Click events will open the game URL in a new tab
   - If no URL is provided, a modal with game details will be shown

## Customization

### Changing Colors
- Modify gradient colors in the game config
- Update CSS custom properties in the `<style>` section

### Adding New Sections
- Use the existing section structure as a template
- Follow the Tailwind CSS utility classes for consistency

### Integrating Analytics
- Google Analytics is already set up (G-5EPY7GNTJD)
- Add tracking events in the `handleGameClick()` method

## Development

To run locally:
1. Open `index.html` in your browser
2. No build process required - uses CDN for Tailwind CSS
3. For production, consider using a local build of Tailwind CSS

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

© 2024 Geometry Dash Spam. All rights reserved.