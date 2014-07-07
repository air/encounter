# TODO

  - darkblue line on horizon
  - yellow UFO with 1x yellow shots in L1
  - cyan/lightgrey UFO with same 3x shots in L1
  - lightgrey crosshairs
  - gibs from saucers. They start white and fade through warm colours to dark
  - saucers enter from white portal
  - players shots don't kill player
  - don't spawn missiles too close to player
  - Saucer shots that don't depend on FPS
  - add indicators: red missile, yellow entry portal/active saucer, blue shots flying (does warp portal light up?)
  - fix 'edge of the world'
  - add original super-cool exit from warp effect
  - further original UFO types
  - clouds
  - dashboard is midgrey, white text overlay, black highlights
  - sound effects: player move, warp, enemy windup, enemy ticking, missile
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
  - How we figured out the colour cycle per frame. Holding up a palette image against the paused emulator.