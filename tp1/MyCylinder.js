import {CGFobject} from '../lib/CGF.js';

 /**
   * MyCylinder
   * @constructor
   * @param scene - MyScene object
   * @param base - base radius
   * @param top - top radius
   * @param height - height of the cylinder
   * @param slices - number of slices around Z axis
   * @param stacks - number of stacks along Z axis
   */
export class MyCylinder extends CGFobject {
  constructor(scene, id, base, top, height, slices, stacks) {
    super(scene);
    this.base = base;
    this.top = top;
    this.height = height;
    this.latDivs = stacks * 2;
    this.longDivs = slices;

    this.initBuffers();
  }

  /**
   * @method initBuffers
   * Initializes the cylinder buffers
   */
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var phi = 0;
    var theta = 0;
    var phiInc = Math.PI / this.latDivs;
    var thetaInc = (2 * Math.PI) / this.longDivs;
    var latVertices = this.longDivs + 1;

    // build an all-around stack at a time, starting on "north pole" and proceeding "south"
    for (let latitude = 0; latitude <= this.latDivs; latitude++) {
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);

      // in each stack, build all the slices around, starting on longitude 0
      theta = 0;
      for (let longitude = 0; longitude <= this.longDivs; longitude++) {
        //--- Vertices coordinates
        var x = Math.cos(theta) * sinPhi;
        var y = cosPhi;
        var z = Math.sin(-theta) * sinPhi;
        this.vertices.push(x, y, z);

        //--- Indices
        if (latitude < this.latDivs && longitude < this.longDivs) {
          var current = latitude * latVertices + longitude;
          var next = current + latVertices;
          // pushing two triangles using indices from this round (current, current+1)
          // and the ones directly south (next, next+1)
          // (i.e. one full round of slices ahead)
          
          this.indices.push( current + 1, current, next);
          this.indices.push( current + 1, next, next +1);
        }

        //--- Normals
        // at each vertex, the direction of the normal is equal to 
        // the vector from the center of the sphere to the vertex.
        // in a sphere of radius equal to one, the vector length is one.
        // therefore, the value of the normal is equal to the position vectro
        this.normals.push(x, y, z);
        theta += thetaInc;

        //--- Texture Coordinates
        // To be done... 
        // May need some additional code also in the beginning of the function.
        this.texCoords.push(longitude/this.longDivs,latitude/this.latDivs);
      }
      phi += phiInc;
    }
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
      /**
     * @method updateTexCoords
     * Updates the list of texture coordinates of the cylinder
     * @param {Array} coords - Array of texture coordinates
     */
    updateTexCoords(coords) {
      this.texCoords = [...coords];
      this.updateTexCoordsGLBuffers();
    }
}