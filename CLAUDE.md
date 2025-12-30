# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a WebGL recreation of the classic 1983 Commodore 64 game "Encounter" using Three.js. The game features a first-person 3D perspective where the player navigates an infinite grid of obelisks while fighting alien saucers and homing missiles across 8 levels.

## File Locations
- **Active codebase**: `js/modules/` directory with ES6 imports/exports
- **Entry point**: `js/main.js` loaded by `index.html`

## Key Patterns Established
- Named exports for functions and constants
- Default exports for backward compatibility where needed
- Getter/setter patterns for mutable module state
- ES6 classes for Portal/WhitePortal/BlackPortal inheritance, and Saucer variants
- Careful module initialization order to handle dependencies

## Git Commit Workflow
- **IMPORTANT**: Do NOT make git commits until the user has tested and validated the code changes
- **IMPORTANT**: Do NOT attempt `git push` - the user will handle pushing to GitHub
- After completing conversions or fixes, the workflow is:
  1. Make the code changes
  2. **STOP and WAIT** for the user to confirm via manual testing
  3. **Only after user confirms "ok" or "looks good"**, then stage files with `git add` and commit with `git commit`
  4. User will handle `git push` separately

## Development Commands

### Testing
```bash
npm test          # Run Mocha tests
```

## Architecture Overview

### Core Game Structure
- **Encounter.js**: Main game constants and initialization
- **State.js**: Game state management (attract mode, playing, paused, etc.)
- **MY3.js**: Custom Three.js wrapper handling rendering loop and 3D setup
- **Level.js**: Level configuration data (colors, enemy types, spawn tables)

### Game Systems
- **Physics.js**: Collision detection for obelisks and game objects
- **Grid.js**: Manages the infinite grid of obelisks
- **Camera.js**: First-person camera controls and movement
- **Controls.js**: Input handling (keyboard, touch, gamepad support)
- **Display.js**: UI overlay management
- **Sound.js**: Audio system using jsfxr for C64-style sound effects

### Game Objects
- **Player.js**: Player ship with movement, shooting, and collision
- **Enemy.js**: Base enemy class with various saucer types (Single, Triple, Chaingun, Shotgun, AutoShotgun)
- **Missile.js**: Homing missile enemy implementation
- **Shot.js**: Projectile system for both player and enemy shots
- **Portal.js**: Level transition gates (BlackPortal.js, WhitePortal.js)

### Rendering & Effects
- **C64.js**: Commodore 64 color palette constants
- **UTIL.js**: Utility functions for logging and common operations
- **Explode.js**: Explosion particle effects

## Key Technical Details

### Coordinate System
- Uses Three.js standard coordinate system
- Infinite obelisk grid with player starting at Grid.playerStartLocation()
- Camera height set to half obelisk height (Obelisk.HEIGHT / 2)

### Game Constants
- All timing and gameplay values defined in Encounter.js
- Movement speed, turn speed, shot intervals carefully tuned to match C64 original

### State Management
- Game uses a centralized State object for mode switching
- Actors system manages all active game objects
- Collision detection optimized with fast/detailed checks

### Mobile Support
- Custom touch controls in Touch.js with smooth d-pad transitions
- Responsive UI overlay system

### Dependencies
- **Three.js r182** - Loaded via CDN using import maps (see index.html and test.html)
- dat.gui for debug controls
- jsfxr for procedural audio
- Tween.js for animations
- Legacy dependencies in lib/ directory (FirstPersonControls, etc.)

## Testing

### Mocha Tests (Limited Coverage)
- **IMPORTANT**: The mocha tests (`npm test`) only cover 2 files: **MY3.js** and **Physics.js**
- Tests validate:
  - MY3.FlickeringBasicMaterial constructor
  - MY3.vectorToRotation() function
  - Physics.moveCircleOutOfStaticCircle() function
  - Physics.bounceObjectOutOfIntersectingCircle() function
- **Only run `npm test` if you modified MY3.js or Physics.js**
- For all other modules, manual browser testing is the only validation

### Manual Browser Testing (Required for Everything)
- **Manual browser testing at http://localhost:8000/index.html is REQUIRED for validating all other modules**

## Code Writing Guidelines

- When leaving comments in the code for something to do later, always prefix it with CLAUDE-TODO: so we know it's a comment for Claude, not for the developer