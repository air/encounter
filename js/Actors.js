'use strict';

var Actor = function(object3D, updateFunction, radarType)
{
  this.object3D = object3D;
  this.update = updateFunction;
  this.radarType = radarType;
};

Actor.prototype = {
  getObject3D: function()
  {
    return this.object3D;
  },

  getRadarType: function()
  {
    return radarType;
  },

  update: function()
  {
    panic('prototype update should always be overridden', this);
  },
};

var Actors = function()
{
  this.list = [];
};

Actors.prototype = {
  add: function(actor)
  {
    if (!(actor instanceof Actor))
    {
      panic('can only add an Actor', actor);
    }

    this.list.push(actor);
    scene.add(actor.getObject3D());
  },

  remove: function(actor)
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
  },

  reset: function()
  {
    while (this.list.length > 0)
    {
      var actor = this.list.pop();
      scene.remove(actor);
    }
  },

  update: function(timeDeltaMillis)
  {
    for (var i = 0; i < this.list.length; i++)
    {
      this.list[i].update(timeDeltaMillis);
    }
  },

  dump: function()
  {
    for (var i = 0; i<this.list.length; i++)
    {
      console.log(this.list[i]);
    }
  }
};