# AI Agent Instructions for Custom Homepage Project

## Project Overview
This is a customizable browser homepage featuring a modern, interactive UI with various widgets and functionality. The project uses vanilla JavaScript, HTML, and CSS with the tsParticles library for background effects.

## Key Architecture Components

### Core Files
- `index.html`: Entry point containing the page structure and widget containers
- `script.js`: Main JavaScript logic for widgets and interactions
- `style.css`: Styling with CSS custom properties (variables) for theming
- `particles.js`: Background particle animation configuration

### Major Features
1. Interactive UI Elements:
   - Clock display
   - Music player with controls
   - Google search with URL detection
   - Quick links section
   - Calendar widget
   - Weather display
   - Quote system
   - Particle background

## Development Patterns

### Styling Conventions
- Theme colors are defined as CSS variables in `:root` (see `style.css`)
- Widget containers use fixed positioning with z-index layering
- Consistent use of `rgba` for transparency effects
- Mobile-responsive design with adaptive particle counts

### JavaScript Patterns
- Event listeners are attached on `DOMContentLoaded`
- Widget initialization follows modular pattern (one function per feature)
- Adaptive features based on screen size (e.g., particle count)
- Direct DOM manipulation without frameworks

## Common Development Tasks

### Adding New Widgets
1. Add container HTML to `index.html`
2. Create initialization function in `script.js`
3. Add corresponding styles in `style.css` with z-index consideration
4. Register initialization in `DOMContentLoaded` event

### Modifying Particle Background
- Edit particle configuration in the `initParticles()` function
- Parameters like count, size, and speed affect performance
- Consider screen size adaptations

## Integration Points
- tsParticles CDN for background effects
- External APIs for weather and quotes (implementation pending)
- Music player expects `music.mp3` in root directory

## Performance Considerations
- Particle count scales with viewport size
- Widget positions use fixed positioning for performance
- Background transitions use hardware acceleration
- Mobile optimizations reduce particle count on small screens

## Known Patterns
- Widget containers follow the pattern: `<div id="widget-name">...</div>`
- Style classes use hyphen-case: `.widget-class`
- JavaScript functions use camelCase: `functionName()`
- Z-index layers: UI elements > particles background