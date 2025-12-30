# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a WebGL recreation of the classic 1983 Commodore 64 game "Encounter" using Three.js. The game features a first-person 3D perspective where the player navigates an infinite grid of obelisks while fighting alien saucers and homing missiles across 8 levels.

## What we are working on

### Three.js Migration Plan

**Goal**: Upgrade from Three.js r58 (0.58.10) to latest (0.182.0)

**Strategy**: Incremental upgrades in chunks of ~10 versions to manage API changes and deprecation warnings effectively.

**Current Status**: Phase 0 - Preparing to migrate from vendored lib/ to npm package

#### Migration Phases

**Phase 0: Switch to npm-managed Three.js** (CURRENT)
- Install three@0.58.10 from npm
- Update index.html to use npm package instead of lib/three.min.js
- Verify game works identically with npm version
- Test all functionality
- ✅ Commit when validated

**Phase 1: 0.58 → 0.66** (skipping 0.59-0.65, not published to npm)
- Update package.json to three@0.66.97 (latest in 0.66.x)
- Fix breaking changes (see migration guide lines 743-751 for r58→r59 changes)
- Key changes to watch:
  - Object3D.rotation now THREE.Euler (was Vector3)
  - Object3D.useQuaternion removed (quaternions now default)
  - Geometry → BoxGeometry (r65→r66)
- Test all functionality
- ✅ Commit when validated

**Phase 2: 0.66 → 0.77**
- Approximately 11 versions forward
- Focus on incremental API changes
- Test and commit when validated

**Phase 3: 0.77 → 0.87**
- 10 version jump
- Test and commit when validated

**Phase 4: 0.87 → 0.97**
- 10 version jump
- Test and commit when validated

**Phase 5: 0.97 → 0.107**
- 10 version jump
- Test and commit when validated

**Phase 6: 0.107 → 0.117**
- 10 version jump
- Major change: WebGL 2 by default (r117→r118)
- Test and commit when validated

**Phase 7: 0.117 → 0.127**
- 10 version jump
- Major change: ES6 classes for core components (r127→r128)
- Test and commit when validated

**Phase 8: 0.127 → 0.137**
- 10 version jump
- Major change: Color management updates
- Test and commit when validated

**Phase 9: 0.137 → 0.147**
- 10 version jump
- Test and commit when validated

**Phase 10: 0.147 → 0.152**
- 5 version jump (smaller due to major color space changes)
- Major change: outputEncoding → outputColorSpace (r151→r152)
- Test and commit when validated

**Phase 11: 0.152 → 0.162**
- 10 version jump
- Major change: WebGL 1 support removed (r162→r163)
- Test and commit when validated

**Phase 12: 0.162 → 0.172**
- 10 version jump
- Test and commit when validated

**Phase 13: 0.172 → 0.182**
- Final 10 version jump to latest
- Test and commit when validated

#### Testing Requirements Per Phase
- Manual browser testing at http://localhost:8000/index.html is **REQUIRED**
- Run `npm test` only if MY3.js or Physics.js were modified
- Verify:
  - Game loads without console errors
  - Attract mode renders correctly
  - Player movement works
  - Enemies spawn and move
  - Shooting works
  - Collisions work
  - Level transitions work
  - Sound effects play

#### Notes
- Each phase must be tested and validated by user before committing
- Breaking changes documented in `three-migration-guide.md`
- Focus on one phase at a time
- Don't proceed to next phase until current is working

See `three-migration-guide.md` for detailed API changes between versions.

### File Locations
- **Active codebase**: `js/modules/` directory with ES6 imports/exports
- **Entry point**: `js/main.js` loaded by `index.html`

### Key Patterns Established
- Named exports for functions and constants
- Default exports for backward compatibility where needed
- Getter/setter patterns for mutable module state
- ES6 classes for Portal/WhitePortal/BlackPortal inheritance, and Saucer variants
- Careful module initialization order to handle dependencies

### Git Commit Workflow
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
- Three.js r58 (legacy version)
- dat.gui for debug controls
- jsfxr for procedural audio
- Tween.js for animations
- All dependencies vendored in lib/ directory

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