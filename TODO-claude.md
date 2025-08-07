# ES6 Module Conversion Plan

## Project Goal
Convert the classic WebGL Encounter game from global script loading to ES6 modules for better encapsulation, preparing for eventual Three.js upgrade.

## Current Status - 18 Modules Converted
- ✅ **Batch 1 Complete**: C64.js, UTIL.js, Timer.js, Sound.js, Level.js
- ✅ **Batch 2 Complete**: Keys.js, Display.js, Indicators.js  
- ✅ **Batch 3 Complete**: Encounter.js, Obelisk.js, SimpleControls.js
- ✅ **Batch 4 Complete**: Physics.js, MY3.js, Asteroid.js
- ✅ **Batch 5 Complete**: Shot.js, ShotSpawner.js, Explode.js, Actors.js
- ✅ **main.js** set up with all converted module imports and testing
- ✅ **index-modules.html** configured for ES6 modules
- ✅ All modules include placeholder dependencies with CLAUDE-TODO comments

## Next Conversion Batch (Immediate)

### Batch 6 - Remaining Modules:

**Current Targets** (dependency analysis needed):
- Ground.js (depends on C64✅, UTIL✅, Grid, THREE.js)
- Grid.js (depends on UTIL✅, Obelisk✅, Physics✅, THREE.js)  
- Camera.js (depends on SimpleControls✅, Encounter✅, THREE.js)
- Touch.js (self-contained, mobile controls)

**Complex Modules** (later phases):
- State.js (central orchestrator, touches everything)
- Player.js (game object, heavy dependencies)
- Enemy.js (game object, heavy dependencies)

## Conversion Requirements

### Key Technical Points:
- Use `window.THREE` for THREE.js access inside modules
- Convert `var ModuleName = {}` pattern to ES6 exports
- Import dependencies from other modules
- Maintain backward compatibility during transition

### Conversion Pattern:
```javascript
// Before (global)
var Timer = {};
Timer.countdown = function() { ... };

// After (module)
import { log } from './UTIL.js';
export function countdown() { ... }
export default { countdown };
```

## Implementation Steps

### Step 1: Convert Timer.js (COMPLETED)
- [x] Analyze dependencies (only needs UTIL.log)
- [x] Create `js/modules/Timer.js`
- [x] Convert to ES6 module syntax
- [x] Test import in main.js

### Step 2: Convert Sound.js (COMPLETED)
- [x] Analyze dependencies (self-contained)
- [x] Create `js/modules/Sound.js`
- [x] Convert to ES6 module syntax
- [x] Ensure jsfxr compatibility

### Step 3: Convert Level.js (COMPLETED)
- [x] Analyze dependencies (needs C64, Enemy refs)
- [x] Create `js/modules/Level.js`
- [x] Import C64 module
- [x] Handle Enemy references (temporary constants with CLAUDE-TODO)

### Step 4: Batch 1 Integration (COMPLETED)
- [x] Update main.js to import new modules
- [x] Initialize modules in correct order
- [x] Test functionality in index-modules.html
- [x] Verify game still works

### Step 5: Convert Batch 2 Modules (COMPLETED)
- [x] Convert Keys.js with placeholder dependencies
- [x] Convert Display.js with DOM manipulation functions
- [x] Convert Indicators.js with canvas-based UI
- [x] Update main.js to import and test Batch 2 modules

### Step 6: Next Phase - State.js and Game Loop (PENDING)
- [ ] Analyze State.js dependencies and circular references
- [ ] Design dependency injection pattern for State.js
- [ ] Convert State.js to ES6 module
- [ ] Test basic game state management

## Dependency Analysis Results

### Files by Conversion Complexity:

**Minimal Dependencies (Current Batch):**
- Timer.js → UTIL.log only
- Sound.js → No dependencies
- Level.js → C64, Enemy constants

**Medium Dependencies (Future Batches):**
- Keys.js → State, Controls, Enemy, Player, Warp
- Display.js → C64
- Indicators.js → UTIL, Display
- GUI.js → Various game objects

**Heavy Dependencies (Later):**
- State.js → Central orchestrator, touches everything
- Player.js → THREE, multiple game systems
- All rendering/3D files → THREE.js intensive

## Future Batch Planning

### Batch 2 (COMPLETED):
- ✅ Keys.js (input handling with placeholder dependencies)
- ✅ Display.js (UI overlay with DOM element creation)  
- ✅ Indicators.js (UI components with canvas-based indicators)

### Batch 3:
- State.js (requires careful dependency injection)
- Simple game objects with THREE.js usage

### Final Batches:
- Core rendering systems (MY3.js, Camera.js)
- Game objects (Player.js, Enemy.js, etc.)
- THREE.js intensive files

## Testing Strategy
- Use index-modules.html for module testing
- Keep index.html working for comparison
- Test each batch thoroughly before proceeding
- Run `npm test` after each conversion batch

## Notes
- THREE.js access: Use `window.THREE` in modules
- Maintain game functionality throughout conversion
- Document any behavioral changes
- Consider creating module loader/initializer pattern for complex dependencies