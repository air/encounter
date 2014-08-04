# Encounter #

One man's mission to remake this 80s gem in WebGL.

Current build status: [![Build Status](https://travis-ci.org/air/encounter.svg)](https://travis-ci.org/air/encounter)

Follow the devlog at http://aaronbell.com

* [Video of the original](http://www.youtube.com/watch?v=_7eCFOpI0SU)
* [Lemon64 entry](http://www.lemon64.com/games/details.php?ID=832)
* [Downloadable D64 image from c64.com](http://www.c64.com/games/351)

# How to play #

[Play the current build on github](http://air.github.io/encounter).

- WSAD or arrows or mobile d-pad to move
- Space or Z or touch to shoot
- P to pause

# Status #

- ![Progress](http://progressed.io/bar/100) Obelisks on an infinite ground plane
- ![Progress](http://progressed.io/bar/100) Controls
- ![Progress](http://progressed.io/bar/100) Sound
- ![Progress](http://progressed.io/bar/60) Accurate sound
- ![Progress](http://progressed.io/bar/100) Shots
- ![Progress](http://progressed.io/bar/100) Basic collisions
- ![Progress](http://progressed.io/bar/50) Perfect collisions
- ![Progress](http://progressed.io/bar/100) Basic enemies and AI
- ![Progress](http://progressed.io/bar/100) Radar
- ![Progress](http://progressed.io/bar/80) Warp level
- ![Progress](http://progressed.io/bar/90) Missile enemies
- ![Progress](http://progressed.io/bar/30) Worlds 2-6
- ![Progress](http://progressed.io/bar/50) Additional enemy AI
- ![Progress](http://progressed.io/bar/80) Lighting and colours
- ![Progress](http://progressed.io/bar/20) Accurate UI overlay

# Original C64 manual

## Game Description

Encounter is a fast-action game in three dimensions. Your view is through the forward command window of a probe vehicle. Your instrument panel combines a radar scanner and warning lights.

You are exploring a vast plain littered with mysterious cylindrical obelisks. Your incursion has triggered a relentless attack of alien saucers and homing missiles. You can move freely over the battlefield, provided you avoid the cylinders, and can fire at will. Shots fired by the saucers, and your own shots, will rebound from the cylinders.

Beware, you can be shot from any angle, including from behind. The homing missiles, which are not stopped by the obelisks, are particularly dangerous.

## Levels

The game can be progressed through eight levels. Each level displays a different landscape and presents you with new enemy strategies. On eliminating all of the enemies at one level, take a 'stargate' to the next level. There is an audible warning. The position of the gate is indicated on your scanner, as a blip. Head towards this quickly, and you will see a black rectangular hole. Line up with the center of this gate and then proceed through.

You will be propelled at high speed through a hail of spheres, which you must avoid hitting, to attain the next level. When the gate appears, an extra shield is awarded (subject to a maximum of nine). If you fail to pass through the gate in time, or fail to negotiate the spheres, you are returned to the previous level and lose one shield. You may re-start at any level that you have completed in the play session, by pressing a number key corresponding to the level required. A buzzing sound acknowledges that this level is accessible to you. Then press the F1 (START) key to begin play at the level selected.

Controls

Select skill level  Press F5
Begin game (*)      Press F7
Fire shots          Joystick fire button 
Travel              See diagram below 
Pause game          Press SPACE BAR
Then to continue    Move joystick
Quit Game           Press F1

* To begin at a previously achieved level, press appropriate NUMBER KEY first

```
                  Forward
Turn Left      _    / \    _    Turn Right
              |\     |     /|
                 \   |   /
                   \ | /
Rotate Left <-----------------> Rotate Right
                   / | \
                 /   |   \
              |/     |     \|
Reverse Turn   -    \ /    -    Reverse Turn
Left              Reverse       Right
```

## Helpful Hints

You are warned of a saucer's presence by a yellow indicator on the instrument panel. A trace on the radar screen identifies the position of the saucer relative to you at the center. A blue light will flash when the saucer fires a shot. Its target is your position. Move at an angle towards or away from the saucer to avoid being hit. You are warned of the approach of a homing missile by a flashing red light and the sound of its low menacing whine, which increases in pitch as it approaches. Its position is shown on your radar screen. Turn towards the missile and back away to gain time, but be wary of hitting cylinders behind you. You must shoot the missile, or it will hit you. Just don't stand still!

## Game Load Instructions

Cassettes have a duplicate copy recorded on the reverse.

Commodore 64/128 (Use joystick Port 2)

CASSETTE
Switch on computer. Insert the cassette into the recorder.
Hold down "SHIFT" key and press "RUN/STOP" key. Press the "PLAY" button as then directed.

DISK
Switch on disk drive first, and then switch on computer.
Insert the game diskette with the label facing up.
Type `LOAD"E", 8` and press RETURN. When the `READY` prompt appears, type `RUN` and press RETURN.

Novagen