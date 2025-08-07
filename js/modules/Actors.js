'use strict';

// CLAUDE-TODO: These dependencies should be imported from their respective modules when converted
function panic(msg, value) {
  throw new Error(msg + (value ? ': ' + value : ''));
}

// Mock scene object until we have proper scene management
const scene = {
  add: (object3D) => console.log('Scene.add called with:', object3D.constructor.name),
  remove: (object3D) => console.log('Scene.remove called with:', object3D.constructor.name)
};

// An Actor has
// - an Object3D for the scene
// - an update() function
// - a Radar type
// FIXME other things that are expected to be in an Actor
// - object3D.shotType
// FIXME are we in fact always storing Meshes, not Object3Ds?
export function Actor(object3D, updateFunction, radarType) {
  if (!(object3D instanceof window.THREE.Object3D))
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

Actor.prototype = {
  getObject3D: function() {
    return this.object3D;
  },

  getRadarType: function() {
    return this.radarType;
  },

  update: function() {
    panic('prototype update should always be overridden', this);
  },
};

// Actors is a strongly typed Array of Actor objects. Each Actor is placed in the scene.
export function Actors() {
  this.list = [];
}

Actors.prototype = {
  add: function(actor) {
    if (!(actor instanceof Actor))
    {
      panic('can only add an Actor', actor);
    }

    this.list.push(actor);
    scene.add(actor.getObject3D());
  },

  remove: function(actor) {
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
  },

  reset: function() {
    while (this.list.length > 0)
    {
      var actor = this.list.pop();
      scene.remove(actor.getObject3D());
    }
  },

  update: function(timeDeltaMillis) {
    for (var i = 0; i < this.list.length; i++)
    {
      this.list[i].update(timeDeltaMillis);
    }
  },

  dump: function() {
    for (var i = 0; i<this.list.length; i++)
    {
      console.log(this.list[i]);
    }
  }
};

// Export default object for backward compatibility
export default {
  Actor,
  Actors
};