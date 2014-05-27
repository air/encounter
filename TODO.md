# TODO

  - fix 'edge of the world'
  - add original super-cool exit from warp effect
  - further original UFO types
  - sound effects: player move, warp, enemy windup, enemy ticking, missile
  - improve mobile FPS. e.g. merge geometry; shorter draw distance; fog
  - better enemy model. Try more polys against FPS.
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
