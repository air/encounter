# TODO

  - rename overlay to layers or similar
  - fill below horizon with ground colour
  - move hidden to block/none
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
  - refactor Saucer types
  - add Grid.randomLocationCloserToPlayer(currentPosition)
  - dashboard is midgrey, white text overlay, black highlights
  - saucers enter from white portal
  - Saucer shots that don't depend on FPS
  - L6 horizon effect, lightred between orange and brown
  - rationalise where Player.isAlive is set
  - allow jump to achieved level from title screen
  - end of game: reverts to L1, displays L9 when you exit, L8 once an enemy shows up.
  - warps get harder as levels go on - L8 warp is nearly impossible
  - sounds: reverse-engineer encounter memory
    - look for writing to the SID locations
    - look for reads from the sound data locations
  - sound: C64 oscillator doesn't have SINE, must be sawtooth or triangle
    - see https://github.com/pstoica/web-audio-synth/blob/master/js/sid.js and http://www.igorski.nl/experiment/websid
  - MaterialsC64.js - then clone() all materials from the set
  - replace all newInstance with Object.create? Maybe don't need if no inheritance.
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
  - improve mobile FPS. e.g. merge geometry; shorter draw distance; fog. Measure 'best' FPS with nothing going on.
  - better saucer model, proper geometry. Original is simplified to a diamond from afar.
  - better missile model.
  - work on Timer.js to use everywhere rather than 'startedAt' checks
  - Use a THREE.ArrowHelper for the Pointer class together with a child object
  - rationalise the notion of State.actors (affected by pause) and pause-immune State.actors
  - see if we can improve timestep, e.g. http://gafferongames.com/game-physics/fix-your-timestep/
  - replace direct use of rotation.n.set with rotateOnAxis()
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
    - Remove all obelisk state as objects. They are just modulo points in an infinite grid. They must be identical and they must be in an identically-spaced grid for this approach to work.
    - Translate must just be SPACING. Grid is perfectly translatable by those intervals.
    - Attach Ground to Grid!
    - Now grid is mobile and vars defining 'edge of world' must be refactored.
    - define the size of our grid based on view distance
    - what threshold do we use? as soon as we cross the first line
    - does this change the grid size needed?
