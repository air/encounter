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
- [ ] 1. UTIL.js
- [ ] 2. C64.js
- [ ] 3. Timer.js
- [ ] 4. Sound.js
- [ ] 5. Level.js
- [ ] 6. Keys.js
- [ ] 7. Display.js
- [ ] 8. Indicators.js
- [ ] 9. Encounter.js

### Batch 2 - Core Systems (Modules 10-15)
- [ ] 10. Obelisk.js
- [ ] 11. SimpleControls.js
- [ ] 12. Physics.js
- [ ] 13. MY3.js
- [ ] 14. Asteroid.js
- [x] 15. Shot.js ✅ FIXED

### Batch 3 - Game Objects (Modules 16-19)
- [ ] 16. ShotSpawner.js
- [ ] 17. Explode.js
- [ ] 18. Actors.js
- [ ] 19. Attract.js

### Batch 4 - Controls & Camera (Modules 20-23)
- [ ] 20. Camera.js
- [ ] 21. GUI.js
- [ ] 22. Controls.js
- [ ] 23. Touch.js

### Batch 5 - World & Grid (Modules 24-25)
- [ ] 24. Grid.js
- [ ] 25. Ground.js

### Batch 6 - Portals (Modules 26-28)
- [ ] 26. Portal.js
- [ ] 27. BlackPortal.js
- [ ] 28. WhitePortal.js

### Batch 7 - Support Systems (Modules 29-31)
- [ ] 29. Radar.js
- [ ] 30. Missile.js
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
