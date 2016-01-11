var THREE = require('three');
var assert = require('assert');

describe('The MY3.FlickeringBasicMaterial object', function() {
  it('should translate hex input correctly into an array of Color objects', function() {
    var hexData = ['0x151515', '0x202020', '0x303030'];
    var material = new MY3.FlickeringBasicMaterial(hexData, 1);
    assert.equal('THREE.Color', typeof material.colorArray[0]);
    assert.equal('THREE.Color', typeof material.colorArray[1]);
    assert.equal('THREE.Color', typeof material.colorArray[2]);
    expect(material.colorArray[0].getHex().to.equal(hexData[0]);
    expect(material.colorArray[1].getHex().to.equal(hexData[1]);
    expect(material.colorArray[2].getHex().to.equal(hexData[2]);
  })
})
