# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a WebGL recreation of the classic 1983 Commodore 64 game "Encounter" using Three.js. The game features a first-person 3D perspective where the player navigates an infinite grid of obelisks while fighting alien saucers and homing missiles across 8 levels.

## What we are working on

This game was written many years ago and uses an ancient version of three.js, and does not use ES6 modules. Our goal is to update the game to have better encapsulation with modules - probably doing this first before attempting a three.js upgrade - and then once that's done tackle the tricky work of upgrading to three.js latest.

## Development Commands

### Testing
```bash
npm test          # Run Mocha tests
```

### Linting
```bash
npm run lint      # Run JSHint via Gulp
gulp lint         # Alternative way to run linting
```

### Local Development
- Open `index.html` in a web browser to run the game
- No build process required - all dependencies are included via CDN or lib/ directory

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
- Draw distance and performance settings configurable

### State Management
- Game uses a centralized State object for mode switching
- Actors system manages all active game objects
- Collision detection optimized with fast/detailed checks

### Mobile Support
- Custom touch controls in Touch.js with smooth d-pad transitions
- Responsive UI overlay system

### Dependencies
- Three.js r58 (legacy version)
- dat.gui for debug controls
- jsfxr for procedural audio
- Tween.js for animations
- All dependencies vendored in lib/ directory

## Testing
- Mocha test framework with Chai assertions
- Tests located in test/ directory
- Focus on core systems: MY3.js, Physics.js
- Uses mocha.opts configuration for test reporter settings
