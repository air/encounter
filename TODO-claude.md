# ES6 Module Conversion Plan

## Project Goal
Convert the classic WebGL Encounter game from global script loading to ES6 modules for better encapsulation, preparing for eventual Three.js upgrade.

## Current Status
- ✅ **C64.js** and **UTIL.js** converted to `js/modules/`
- ✅ **main.js** set up with basic module imports
- ✅ **index-modules.html** configured for ES6 modules
- ✅ Dependency analysis completed

## Next Conversion Batch (Immediate)

### Files to Convert (Priority Order):
1. **Timer.js** → `js/modules/Timer.js`
   - Dependencies: Only `log()` from UTIL
   - No THREE.js usage
   - Simple countdown timer functionality

2. **Sound.js** → `js/modules/Sound.js` 
   - Dependencies: None (uses jsfxr and WebAudio directly)
   - No THREE.js usage
   - Self-contained audio system

3. **Level.js** → `js/modules/Level.js`
   - Dependencies: C64 colors, Enemy constants
   - No THREE.js usage
   - Core game data structure

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

### Step 1: Convert Timer.js
- [x] Analyze dependencies (only needs UTIL.log)
- [x] Create `js/modules/Timer.js`
- [x] Convert to ES6 module syntax
- [x] Test import in main.js

### Step 2: Convert Sound.js  
- [x] Analyze dependencies (self-contained)
- [x] Create `js/modules/Sound.js`
- [x] Convert to ES6 module syntax
- [x] Ensure jsfxr compatibility

### Step 3: Convert Level.js
- [x] Analyze dependencies (needs C64, Enemy refs)
- [ ] Create `js/modules/Level.js`
- [ ] Import C64 module
- [ ] Handle Enemy references (may need to defer or inject)

### Step 4: Integration
- [ ] Update main.js to import new modules
- [ ] Initialize modules in correct order
- [ ] Test functionality in index-modules.html
- [ ] Verify game still works

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

### Batch 2 (After Current):
- Keys.js (input handling)
- Display.js (UI overlay)  
- Indicators.js (UI components)

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