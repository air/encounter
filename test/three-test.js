var THREE = require('three');
var assert = require("assert");

describe('A THREE constant', function() {
  it('BasicShadowMap should be zero', function() {
    assert.equal(0, THREE.BasicShadowMap);
  })
})