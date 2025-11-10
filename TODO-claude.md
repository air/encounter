# ES6 Module Conversion Plan

## Project Goal
Convert the classic WebGL Encounter game from global script loading to ES6 modules for better encapsulation, preparing for eventual Three.js upgrade.

## Current Status - 40 Modules Converted - COMPLETE! 🎉

### ✅ **All Modules Converted (40/40) - 100%!**
- [x] **Actors.js** - Game object management system with Actor and Actors collection classes
- [x] **Asteroid.js** - Space obstacles with collision detection for warp sequences  
- [x] **Attract.js** - Game mode controller for switching between demo and active gameplay
- [x] **C64.js** - Commodore 64 color palette and CSS color utilities
- [x] **Camera.js** - Multiple viewing modes (first-person, chase, orbit, top-down) with THREE.js camera management
- [x] **Controls.js** - Different control systems for various game modes (encounter, fly, warp)
- [x] **Display.js** - DOM-based UI overlay system with HUD elements
- [x] **Encounter.js** - Core game constants and configuration settings
- [x] **Enemy.js** - Base enemy class with spawn management and AI behaviors
- [x] **Explode.js** - Particle explosion system with flickering materials and animation phases
- [x] **Grid.js** - Infinite obelisk grid system with viewport management and geometry merging
- [x] **Ground.js** - Ground plane rendering with dual modes (THREE.js mesh or CSS background)  
- [x] **GUI.js** - Debug interface for dat.gui (currently disabled but ready for future use)
- [x] **Indicators.js** - Canvas-based UI indicators and status lights
- [x] **Keys.js** - Keyboard input handling with game state integration
- [x] **Level.js** - Game level data with enemy spawn configurations and level progression
- [x] **Missile.js** - Homing missile enemy implementation with tracking AI and strafing motion
- [x] **MY3.js** - Comprehensive THREE.js utility wrapper with math functions, materials, and rendering utilities
- [x] **Obelisk.js** - THREE.js geometry for cylindrical game obstacles
- [x] **Physics.js** - Collision detection and physics utilities for game objects
- [x] **Player.js** - Player ship with movement, shooting, collision, and lifecycle management
- [x] **Radar.js** - Mini-map radar display system with blip rendering and range detection
- [x] **Saucer.js** - Base flying saucer enemy type with AI states and movement patterns
- [x] **SaucerSingle.js** - Single-shot yellow saucer variant (first enemy type)
- [x] **SaucerTriple.js** - Triple-shot cyan/grey flickering saucer variant
- [x] **SaucerChaingun.js** - Rapid-fire yellow/grey chaingun saucer (10 shots, no windup)
- [x] **SaucerShotgun.js** - Lightgreen shotgun saucer with 3-shot spread
- [x] **SaucerAutoShotgun.js** - Lightgrey auto-shotgun with 3 consecutive spreads
- [x] **Shot.js** - Projectile system with movement and collision detection
- [x] **ShotSpawner.js** - Rotating generators that create projectiles with physics
- [x] **SimpleControls.js** - WASD/arrow key movement controls for player navigation
- [x] **Sound.js** - WebAudio and jsfxr sound system for C64-style effects
- [x] **Timer.js** - Simple countdown timer functionality for game events
- [x] **Touch.js** - Mobile touch controls with 8-directional d-pad and fire button
- [x] **UTIL.js** - Core utility functions (random, color conversion, logging, platform detection)
- [x] **Warp.js** - Warp sequence controller with asteroid field and three-phase progression (accelerate, cruise, decelerate)

#### **Portal System (3 modules)**
- [x] **Portal.js** - Base portal prototype class for dimensional travel effects with TWEEN animations
- [x] **BlackPortal.js** - Player entry portals (extends Portal) with warp initiation and proximity detection
- [x] **WhitePortal.js** - Enemy spawn portals (extends Portal) with enemy deployment and radar integration
- [x] **State.js** - Central game state orchestrator managing modes, actors, score, and level progression

### 🎉 **ES6 Module Conversion: COMPLETE!**

## Conversion Strategy

### ✅ **Completed: State System - THE FINAL MODULE!**
The State module has been successfully converted:
- **State.js** - Central game orchestrator with state machine and lifecycle management
- **Module Features** - Game mode constants (ATTRACT, COMBAT, WARP, etc.), actor system management, score/enemy tracking
- **Dependencies** - Integrates with ALL other modules (Attract, Grid, Ground, Sound, Display, Player, Enemy, Portal, Warp, etc.)
- **State Management** - Exported state variables (current, actors, isPaused, score) with getters/setters for module access
- **All 16 Dependent Modules Updated** - Player, ShotSpawner, Portal, BlackPortal, Enemy, Warp, Missile, Shot, Radar, Keys, Display, and all 5 Saucer variants now use real State imports

### ✅ **Completed: Player System**
The Player module has been successfully converted:
- **Player.js** - Player ship mesh with movement, shooting, collision detection, and lifecycle
- **Module Features** - THREE.Mesh subclass, position/rotation management, shield system, shot spawning
- **Dependencies** - Uses C64, Radar, Grid, Encounter, Physics, Obelisk, Sound, Shot, UTIL, MY3; placeholders for State and clock
- **State Management** - Exported state variables (isAlive, shieldsLeft, shotsInFlight, etc.) with getters/setters for module access
- **Grid Integration** - Added getIsActive() export to Grid.js for collision detection

### ✅ **Completed: Portal System**
The Portal system has been successfully converted with:
- **Portal.js** - Base class with opening/closing animations and TWEEN integration
- **BlackPortal.js** - Player warp entry with spawn timer and proximity detection  
- **WhitePortal.js** - Enemy spawn portals with type tracking and radar integration
- **Module Composition** - Converted Object.create inheritance to ES6 module composition
- **State Management** - Base portal state accessed via getters/setters for shared functionality

### ✅ **Completed: Radar System**
The Radar system has been successfully converted:
- **Radar.js** - Canvas-based mini-map display with blip rendering and range detection
- **Module Features** - 200x200 octagonal canvas, player-relative rotation, multiple blip types
- **Dependencies** - Uses Display, C64, Grid, UTIL; placeholders for Player and State

### ✅ **Completed: Missile System**
The Missile system has been successfully converted:
- **Missile.js** - Homing missile enemy with tracking AI and side-to-side strafing
- **Module Features** - TWEEN-based strafe animation, collision detection, player tracking
- **Dependencies** - Uses Radar, Encounter, C64, Grid, MY3, Physics, Obelisk, Sound, Indicators, UTIL, Actors; placeholders for Player and State

### ✅ **Completed: Warp System**
The Warp system has been successfully converted:
- **Warp.js** - Warp sequence with three-phase asteroid field navigation (accelerate, cruise, decelerate)
- **Module Features** - TWEEN-based speed transitions, runtime asteroid generation, collision detection, phase management
- **Dependencies** - Uses BlackPortal, Grid, Display, C64, Controls, Asteroid, Camera, Level, Keys, UTIL, Encounter; placeholders for State, Player, clock, scene

### ✅ **Completed: Enemy Base System**
The Enemy base class has been successfully converted:
- **Enemy.js** - Base enemy spawning and management system with type constants
- **Module Features** - Spawn timer, enemy type selection, spawn table integration, destruction handling
- **Dependencies** - Uses UTIL, Level, Missile, WhitePortal, Sound, Explode, Indicators, Encounter, and all Saucer variants; placeholders for State and clock

### ✅ **Completed: Saucer Enemy System**
The complete Saucer enemy system has been successfully converted (base + 5 variants):
- **Saucer.js** - Abstract base class with AI state machine (waiting, moving, shot windup, shooting)
- **SaucerSingle.js** - Yellow saucer, 1 shot with windup (first enemy type)
- **SaucerTriple.js** - Cyan/grey flickering saucer, 3 consecutive shots
- **SaucerChaingun.js** - Yellow/grey flickering, 10 rapid-fire shots, no windup
- **SaucerShotgun.js** - Lightgreen saucer, 3-shot spread pattern, no windup
- **SaucerAutoShotgun.js** - Lightgrey saucer, 3 consecutive 3-shot spreads, no windup
- **Module Features** - Prototype inheritance, FlickeringBasicMaterial support, collision detection, configurable AI behavior
- **Dependencies** - All saucers use UTIL, MY3, Physics, Obelisk, Sound, Indicators, Radar, Actors, Shot; placeholders for Player and State

### **Final Phase: Core Complex Systems**
- **State.js** - Central orchestrator requiring careful dependency injection (ONLY module remaining!)

## Technical Progress

### **Infrastructure Complete**
- ✅ **main.js** - ES6 module imports with comprehensive testing
- ✅ **index-modules.html** - Browser testing environment for ES6 modules
- ✅ **Dependency Management** - All converted modules use placeholder objects with CLAUDE-TODO comments
- ✅ **Testing Integration** - Each module tested individually and integrated systematically

### **Architectural Foundations**
- ✅ **Utility Layer** - UTIL, C64, Timer, Sound systems converted
- ✅ **Rendering Layer** - THREE.js wrappers (MY3, Obelisk, Physics) converted
- ✅ **Spatial Systems** - Grid, Ground, Camera, Controls converted
- ✅ **UI Systems** - Display, Keys, Indicators, GUI converted  
- ✅ **Game Objects** - Actors, Shot, Asteroid, Explode systems converted
- ✅ **Portal System** - Portal, BlackPortal, WhitePortal for level progression converted

## Conversion Requirements

### **Technical Standards**
- Use `window.THREE` for THREE.js access inside modules
- Convert `var ModuleName = {}` pattern to ES6 exports
- Import dependencies from converted modules  
- Use placeholder objects with CLAUDE-TODO for unconverted dependencies
- Maintain backward compatibility with default exports
- Test each module individually in main.js

### **Conversion Pattern**
```javascript
// Before (global)
var ModuleName = {};
ModuleName.someFunction = function() { ... };

// After (ES6 module)
import { dependency } from './UTIL.js';
export function someFunction() { ... }
export default { someFunction };
```

## Testing Strategy
- ✅ **Browser Testing** - index-modules.html for ES6 module testing
- ✅ **Comparison Testing** - index.html maintains original functionality  
- ✅ **Incremental Testing** - Each module tested before proceeding
- ✅ **Integration Testing** - main.js provides comprehensive module validation
- 🔄 **Game Loop Testing** - Future phase will test actual gameplay integration

## Notes
- **Progress**: 39/40 modules converted (97.5% complete!) 🎉🎉
- **Architecture**: All foundational systems, game objects, portal mechanics, radar display, missile tracking, warp sequences, complete enemy system, and player ship now use ES6 modules
- **Milestone**: Only 1 core module remains (State.js) - the final boss!
- **Dependencies**: Complex interdependencies resolved with placeholder pattern
- **Performance**: Original optimizations preserved during conversion
- **Compatibility**: Both ES6 modules and original globals supported during transition
- **Ready for Final Push**: State.js is the last remaining module to complete the ES6 conversion!