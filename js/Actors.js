import { log, error, panic } from '/js/UTIL.js';
import * as THREE from '/lib/three.module.js'

// An Actor has
// - an Object3D for the scene
// - an update() function
// - a Radar type
// FIXME other things that are expected to be in an Actor
// - object3D.shotType
// FIXME are we in fact always storing Meshes, not Object3Ds?
// ---------------------------------------------------------------------------
export class Actor
{
  constructor(object3D, updateFunction, radarType)
  {
    if (!(object3D instanceof THREE.Object3D))
    {
      panic('object3D must be an Object3D');
    }
    else if (typeof updateFunction !== 'function')
    {
      panic('updateFunction must be a function');
    }

    this.object3D = object3D;
    this.update = updateFunction;
    this.radarType = radarType;
  }

  getObject3D()
  {
    return this.object3D;
  }

  getRadarType()
  {
    return this.radarType;
  }

  update()
  {
    panic('prototype update should always be overridden', this);
  }
};

// ActorList is a strongly typed Array of Actor objects. Each Actor is placed in the scene.
export class ActorList
{
  constructor()
  {
    this.list = [];
  }

  add(actor)
  {
    if (!(actor instanceof Actor))
    {
      panic('can only add an Actor', actor);
    }

    this.list.push(actor);
    scene.add(actor.getObject3D());
  }

  remove(actor)
  {
    if (!(actor instanceof Actor))
    {
      panic('can only remove an Actor', actor);
    }

    var index = this.list.indexOf(actor);
    if (index !== -1) {
      this.list.splice(index, 1);
    }
    else
    {
      panic('actor not in list', actor);
    }
    scene.remove(actor.getObject3D());
  }

  reset()
  {
    while (this.list.length > 0)
    {
      var actor = this.list.pop();
      scene.remove(actor.getObject3D());
    }
  }

  update(timeDeltaMillis)
  {
    for (var i = 0; i < this.list.length; i++)
    {
      this.list[i].update(timeDeltaMillis);
    }
  }

  dump()
  {
    for (var i = 0; i<this.list.length; i++)
    {
      console.log(this.list[i]);
    }
  }
}
