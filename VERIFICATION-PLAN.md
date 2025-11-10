# ES6 Module Conversion Verification Plan

## Problem
Shot.js was found to have a completely wrong implementation - different constants, different functions, wrong geometry type. This raises concerns about all previous conversions.

## Verification Process
For each converted module, we will:
1. Read original `js/ModuleName.js`
2. Read converted `js/modules/ModuleName.js`
3. Compare and verify:
   - All constants (names AND values)
   - All functions (names, signatures, complete logic)
   - All exported items in default export
   - No functionality dropped or changed
   - **Check placeholders: Only Player, State, clock, and scene should be stubbed**
   - All other modules should be properly imported (not placeholders)
4. Report any discrepancies found
5. Fix any issues
6. User tests manually
7. Commit fix (if needed) before moving to next module

## Modules to Verify (in conversion order)

### Batch 1 - Foundation (Modules 1-9)
- [x] 1. UTIL.js ✅ VERIFIED
- [x] 2. C64.js ✅ VERIFIED
- [x] 3. Timer.js ✅ VERIFIED
- [x] 4. Sound.js ✅ VERIFIED
- [x] 5. Level.js ✅ VERIFIED & FIXED (removed Enemy placeholder, added proper imports)
- [x] 6. Keys.js ✅ VERIFIED & FIXED (removed 5 improper placeholders, added proper imports)
- [x] 7. Display.js ✅ VERIFIED (getHorizonDiv() added for encapsulation, Level functions used correctly)
- [x] 8. Indicators.js ✅ VERIFIED (WIDTH/X_SEPARATION correctly mutable, getter functions added for encapsulation)
- [x] 9. Encounter.js ✅ VERIFIED (initialization calls correctly commented out)

### Batch 2 - Core Systems (Modules 10-15)
- [x] 10. Obelisk.js ✅ VERIFIED
- [x] 11. SimpleControls.js ✅ VERIFIED
- [x] 12. Physics.js ✅ VERIFIED & FIXED (removed Grid placeholder with wrong SPACING value 200, added proper import for correct value 1000)
- [x] 13. MY3.js ✅ VERIFIED & FIXED (replaced mock panic with proper UTIL import, added missing setupRStats() and Pointer() functions)
- [x] 14. Asteroid.js ✅ VERIFIED & FIXED (replaced mock log function with proper UTIL import)
- [x] 15. Shot.js ✅ FIXED

### Batch 3 - Game Objects (Modules 16-19)
- [x] 16. ShotSpawner.js ✅ VERIFIED & FIXED (restored original update() logic, removed refactored spawnShotIfNeeded() method, fixed variable names, replaced Radar placeholder with import)
- [x] 17. Explode.js ✅ VERIFIED & FIXED (replaced mock log with UTIL import, replaced Radar placeholder with import, restored Gib.MATERIAL reference, fixed Explode object reference, replaced Actor/Enemy placeholders with imports)
- [x] 18. Actors.js ✅ VERIFIED & FIXED (replaced mock panic with UTIL import, replaced mock scene with MY3.getScene() calls)
- [x] 19. Attract.js ✅ VERIFIED & FIXED (replaced Grid/Radar placeholders with imports, fixed MY3.threeDiv to use getThreeDiv())

### Batch 4 - Controls & Camera (Modules 20-23)
- [x] 20. Camera.js ✅ VERIFIED & FIXED (replaced Grid/scene placeholders with imports, added MY3.setCamera() for camera switching, removed extra getter/setter functions)
- [x] 21. GUI.js ✅ VERIFIED & FIXED (replaced Keys/Camera/clock placeholders with imports, removed extra getter/setter functions, exported gui property)
- [x] 22. Controls.js ✅ VERIFIED & FIXED (removed extra getter/setter functions, exported current/shootingAllowed as simple properties, fixed UTIL import)
- [x] 23. Touch.js ✅ VERIFIED & FIXED (exported constants and state variables, removed extra getter functions, fixed Controls.current import)

### Batch 5 - World & Grid (Modules 24-25)
- [x] 24. Grid.js ✅ VERIFIED & FIXED (replaced scene/camera placeholders with MY3 imports, fixed panic() call, fixed Level.current, removed extra getter functions)
- [x] 25. Ground.js ✅ VERIFIED & FIXED (replaced Grid placeholder with proper imports, removed extra getter functions)

### Batch 6 - Portals (Modules 26-28)
- [x] 26. Portal.js ✅ VERIFIED & FIXED (restored panic(), used window.TWEEN, exported state variables, kept getActorUpdateFunction() for derived classes)
- [x] 27. BlackPortal.js ✅ VERIFIED & FIXED (used Portal state directly, removed state sync, restored panic(), imported Radar/Grid properly)
- [x] 28. WhitePortal.js ✅ VERIFIED & FIXED (used Portal state directly, removed state sync, restored panic(), imported Radar/Grid properly)

### Batch 7 - Support Systems (Modules 29-31)
- [x] 29. Radar.js ✅ VERIFIED & FIXED (added getters/setters for showObelisks/showShots, already well-converted with good encapsulation)
- [x] 30. Missile.js ✅ VERIFIED & FIXED (restored MOVEMENT_SPEED name, fixed tween setup with proxy object, fixed spawn() return value, added strafeTweenLoop to exports)
- [ ] 31. Warp.js

### Batch 8 - Enemy System (Modules 32-38)
- [ ] 32. Enemy.js
- [ ] 33. Saucer.js
- [ ] 34. SaucerSingle.js
- [ ] 35. SaucerTriple.js
- [ ] 36. SaucerChaingun.js
- [ ] 37. SaucerShotgun.js
- [ ] 38. SaucerAutoShotgun.js

## Notes
- We will work through these systematically, one at a time
- Each module will be compared line-by-line for constants and function logic
- User will test after each verification/fix
- No moving to next module until current one is verified and tested
- Priority: Earlier modules are more critical as later modules depend on them
