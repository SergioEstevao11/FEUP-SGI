import {CGFobject, CGFnurbsSurface, CGFnurbsObject} from '../../lib/CGF.js';

/**
 * Patch
 * @constructor
 * @param scene   - Reference to MyScene object
 * @param npointsU - number of sections in U direction
 * @param npointsV - number of sections in V direction
 * @param controlVerts- control points for the patch
 * @param divU - num of division in U direction
 * @param divV - num of division in V direction
 * @param controlVerts - control vertices
 * 
 */
 export class MyPatch extends CGFobject {
    constructor(scene, degreeU, degreeV, divU, divV, controlVerts) {
		super(scene);
        this.scene = scene
        this.degU = degreeU
        this.degV = degreeV
        this.divU = divU
        this.divV = divV
        this.controlVerts = controlVerts;
        this.object = null;
        this.initBuffers();
    }

    initBuffers() {

        console.log(this.controlVerts)
        console.log(this.degU)
        console.log(this.degV)
        var nurbsSurface = new CGFnurbsSurface(this.degU, this.degV, this.controlVerts)
        this.object = new CGFnurbsObject(this.scene, this.divU, this.divV, nurbsSurface)
    }

    display() {
        this.object.display()
    }
}