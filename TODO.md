# TODO

  - bug in grid after warp reset
  - automatically set grid size based on FAR draw distance
  - Radar: option to show obelisks (can all be done locally)
  - horizon is no longer a flat line
  - ground and obelisk colors
    - L2: black night with stars (no clouds), brown land (same as yellow indicator=off), green obelisks!
  - reverse encounter memory
    - look for writing to the SID locations
    - look for reads from the sound data locations
  - sound: C64 oscillator doesn't have SINE, must be sawtooth or triangle
  - see https://github.com/pstoica/web-audio-synth/blob/master/js/sid.js and http://www.igorski.nl/experiment/websid
  - edit title screen
  - title screen show readiness once all Inits() are called?
  - lightgrey crosshairs
  - MaterialsC64.js - then clone() all materials from the set
  - make saucers bigger
  - player lives. S overlay for spare Ships (you can play with S=0, last life)
  - saucers enter from white portal
  - don't spawn missiles too close to player
  - Saucer shots that don't depend on FPS
  - replace all newInstance with Object.create? Maybe don't need if no inheritance.
  - add original super-cool exit from warp effect
  - further original UFO types
  - clouds. Stars. Use CSS background image and scroll?
  - Radar colours, use C64 palette
  - L1 10 enemies on NOVICE. Seems to vary weirdly.
  - L2 saucer: yellow alternating with lightgrey, same as shots. NO WINDUP. Chaingun of 10 shots.
  - L2 saucer: lightgreen. NO WINDUP. Shotgun spray of 3 shots.
  - L2 also spawns YellowSaucer, BlueSaucer, CyanMissile
  - L3 same sky as L1, pink land. 19 enemies.
  - L3 saucer: pure cyan. Ticking beep, 16 pips then boom. No usual saucer move/wait sound. Burst of shots in all directions (just to your direction?).
  - L3 saucer: pure lightgrey. NO WINDUP. Auto-shotgun, sprays 3 as per L2 but rapid fire. 
  - Saucers despawn after a couple of minutes!
  - If Saucer is killed with shots in flight, the shots are coloured as gibs burning out. Not sure if they kill.
  - darkblue line on horizon for L1, L3.
  - 'Sticky' obelisks for extra missile terror
  - Attract mode has a demo of L1, which flips to L2 enemy set (overlay also updates to L2) once saucer appears. 
  - It's possible for a Missile to get 'caught' as you back away and match your retreating arc (effectively no strafe) 
  - dashboard is midgrey, white text overlay, black highlights
  - record/synth sound effects: player move, warp, enemy ticking, missile
  - improve mobile FPS. e.g. merge geometry; shorter draw distance; fog. Measure 'best' FPS with nothing going on.
  - better saucer model. Original is simplified to a diamond from afar.
  - better missile model.
  - work on Timer.js to use everywhere rather than 'startedAt' checks
  - Use a THREE.ArrowHelper for the Pointer class together with a child object
  - rationalise the notion of State.actors (affected by pause) and pause-immune State.actors
  - fade sound based on proximity
  - see if we can improve timestep, e.g. http://gafferongames.com/game-physics/fix-your-timestep/
  - replace direct use of rotation.n.set with rotateOnAxis()
  - Try http://www.createjs.com/#!/SoundJS
  - shader for the 'snow' effect once destroyed
  - shader for scanlines

# FIXME

  - shots in play show up in warp
  - shot pointers are incorrect in fly mode. Seem ok in normal mode
  - Y rotation breaks when the camera flips from Simple to FirstPerson.

# Interesting things

  - How I measured the Encounter constants
  - How we figured out the colour cycle per frame. Holding up a palette image against the paused emulator. From the old review of Dragon Breed, 'that colour doesn't exist on the C64, swapping at 60 fps'. Sort of mentioned in http://www.c64.com/interviews/routledge.html. Looking at youtube they achieved a six-segment dragon tail by showing alternating segments on odd frames. Much flickering.
  - Edge of world
    - Translate must just be SPACING. Grid is perfectly translatable by those intervals.
    - Attach Ground to Grid!
    - Now grid is mobile and vars defining 'edge of world' must be refactored.