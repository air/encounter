# TODO

  - Vertically center the 3D view into whatever the viewport is. Adjust for dashboard if on/off.
  - Radar iterating over actors is horrible, use every?
  - Feels more like an open field
  - Grid is hex shaped?
  - Move from dat.gui to https://github.com/lo-th/uil
  - Multiple enemy items:
    - Shot.collideWithShips needs to pull Enemies out of Actors (every with instanceof?), otherwise you can only shoot Enemy.current
    - Add a key to run e.g.: for (var i=0; i<20; i++) { var loc = Grid.randomLocationCloseToPlayer(10000, 2000); loc.y = Encounter.CAMERA_HEIGHT; Enemy.spawnGivenTypeAt(Level.current.spawnTable[UTIL.random(1, Level.current.spawnTable.length - 1)], loc); }
    - Enemy can have arbitrary Actor assigned as the target! Player doesn't need to be involved.
    - Replace Enemy.current with Enemy.numberAlive for multiple enemies
    - Gib needs refactored as an Actor
  - candidates for new ctor style: Shot, Asteroid, anything with newInstance
  - tweak overlay sizes for mobile - modes: desktop, mobile-portrait, mobile-landscape
  - L3 saucer: pure cyan. Ticking beep, 16 pips then boom. No usual saucer move/wait sound. Burst of shots in all directions.
  - L5 saucer: cyan/lightgrey. Never goes into waiting state/sound, always moving fast and taking potshots.
  - L6 saucer: yellow/lightgreen. 3 sets of mega shotgun containing 5 rounds with wide spread.
  - L6 saucer: yellow/lightgrey. Sprays a hose of shots arriving on your right and dragging to the left.
  - L6 saucer: cyan/lightgreen. Never moves. Shoots at a moderate rate.
  - L8 saucer: cyan/lightgreen. Never stops moving, shoots chaingun at you, extremely aggressive.
  - L8 saucer: yellow, shoots 7 alternating left and right of you, never dead on
  - edit title screen
    - title screen show readiness once all Inits() are called?
  - saucer shoot noise is the SAME as obelisk rebound
  - refactor Saucer types into something sane, using JSON?
  - true 'snow' effect on shield loss
  - add Grid.randomLocationCloserToPlayer(currentPosition)
  - dashboard is midgrey, white text overlay, black highlights
  - Saucer shots that don't depend on FPS
  - L6 flickering horizon effect, lightred between orange and brown
  - rationalise where Player.isAlive is set
  - AI: enemies much more often circlestrafe the player than go toward/away
  - allow jump to *achieved* level from title screen
  - end of game: reverts to L1, displays L9 when you exit, L8 once an enemy shows up.
  - warps get harder as levels go on - L8 warp is nearly impossible
  - sounds: reverse-engineer encounter memory
    - look for writing to the SID locations
    - look for reads from the sound data locations
  - MaterialsC64.js - then clone() all materials from the set
  - add original super-cool exit from warp effect
  - further original UFO types
  - L1 clouds. L2 stars. Use CSS background image and scroll?
  - L1 10 enemies on NOVICE. Seems to vary weirdly.
  - Saucers despawn after a couple of minutes!
  - If Saucer is killed with shots in flight, the shots are coloured as gibs burning out. Not sure if they kill.
  - thick lines on horizon for L1, L3 and others.
  - 'Sticky' obelisks for extra missile terror
  - Attract mode has a demo of L1, which flips to L2 enemy set (overlay also updates to L2) once saucer appears.
  - It's possible for a Missile to get 'caught' as you back away and match your retreating arc (effectively no strafe)
  - world wraparound. Head away from enemy and they appear in front.
  - record/synth sound effects: player move, warp, enemy ticking, missile
    - http://csdb.dk/forums/index.php?roomid=11&topicid=32097&firstpost=2
    - Just look for executable code with sta $d400. Then see where a is loaded from.
  - improve mobile FPS. e.g. merge geometry; shorter draw distance; fog. Measure 'best' FPS with nothing going on.
  - better saucer model, proper geometry - use threejs editor. Original is simplified to a diamond from afar.
  - better missile model.
  - work on Timer.js to use everywhere rather than 'startedAt' checks
  - see if we can improve timestep, e.g. http://gafferongames.com/game-physics/fix-your-timestep/
  - replace direct use of rotation.n.set with rotateOnAxis()
  - simulate CRT scanlines - may be tricky given mix of threejs and CSS elements

# FIXME

  - shots in play show up in warp
  - shot pointers are incorrect in fly mode. Seem ok in normal mode
  - Y rotation breaks when the camera flips from Simple to FirstPerson.

# OO notes

Inheritance sucks for the Portal -> White/Black variants. Up/down communication is opaque and difficult to follow (is this function in this object, or the superclass, or the supersuperclass?). Better to have composed peer objects that communicate via an API with clear boundaries and hooks for custom behaviour.

  - prototype state = does updating an inherited property .foo update the proto? No, it creates a shadow prop on the object.
    - what about if the change is made IN the proto using this.prop=foo? Cool, this binds to the object (not proto).
  - Why use ctor functions?
    - You get the instanceof operator. Otherwise use isPrototypeOf().
The journey to JS OO.
  - First use pure prototypes with no 'new' stuff, just use Object.create();
  - You will find yourself building factories like newInstance().
  - You will learn property shadowing and using 'this' in the proto to delegate down to the object.
  - Finally learn the ctor function, which does some lifting for you and has a special property 'prototype'. The relationship between the ctor function and the function-prototype object is actually very simple.
    - This explains what the instanceof operator does: looks at obj X, and matches isPrototypeOf() against the .prototype property of the ctor function you give it.
@sporto article is good but not complete. Needs explanation of shadowing and 'this' delegation even when using pure Object.create style.
  - Write your prototype with properties divided into 'actual proto state' and 'will be shadowed in derived objects'. The latter must always be addressed with 'this'.
  - Actually doing inheritance: 1. Your subclass ctor needs <Super>.call(this) for superclass ctor, and 2. Your subclass prototype needs to be made with Object.create(<Super>.prototype).

Better use of composition and closures in Actor. Encapsulate the idea of a thing that 1. Goes in the scene and 2. has some behaviour (a function). That function needs to remember state of its parent - hence a 'self' closure reference.

# Interesting things

  - How I measured the Encounter constants
  - How we figured out the colour cycle per frame. Holding up a palette image against the paused emulator. From the old review of Dragon Breed, 'that colour doesn't exist on the C64, swapping at 60 fps'. Sort of mentioned in http://www.c64.com/interviews/routledge.html. Looking at youtube they achieved a six-segment dragon tail by showing alternating segments on odd frames. Much flickering.
  - Edge of world
    - Remove all obelisk state as objects. They are just modulo points in an infinite grid. They must be identical and they must be in an identically-spaced grid for this approach to work.
    - Translate must just be SPACING. Grid is perfectly translatable by those intervals.
    - Attach Ground to Grid!
    - Now grid is mobile and vars defining 'edge of world' must be refactored.
    - define the size of our grid based on view distance
    - what threshold do we use? as soon as we cross the first line
    - does this change the grid size needed?
  - The update loop is redefined for every State we can be in. This is highly flexible.
  - OO style in Saucer and Portal
    - being able to accidentally change state of prototypes (Portal and Saucer) is a source of bugs
  - Remove portal states from State? There's only combat. Portals have spawn timers.
      - A black portal dictates the state flow. We need a BlackPortal with update()
      - Only a Saucer spawn creates a white portal! Definitely not a State, rather a chained Enemy.
      - A white portal is disconnected from state flow once the enemy emerges. Use COMBAT. The first actor (portal)spawns the second (enemy).
        - The COMBAT loop runs. The WhitePortal's actor update() will spawn Enemy and also clean up itself.
        - The time (ENEMY_ALIVE + Explode.LIFETIME) > Portal.CLOSING.
      - Both portals have a spawn timer, and the first enemy is always a saucer, BUT
        - We still need a spawn time before Missile appears.
        - So two distinct spawn timers (black portal and ANY enemy) are needed.
        - So white portal has no spawn timer after all, created on demand.
