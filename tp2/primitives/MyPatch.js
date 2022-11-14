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
    constructor(scene, id, npointsU, npointsV, divU, divV, controlVerts) {
		super(scene);
        this.scene = scene
        this.degU = npointsU - 1
        this.degV = npointsV - 1
        this.divU = divU
        this.divV = divV
        this.controlVerts = controlVerts;

        this.initBuffers()
    }

    initBuffers() {
        var nurbsSurface = new CGFnurbsSurface(this.degU, this.degV, this.controlVerts)

        this.object = new CGFnurbsObject(this.scene, this.divU, this.divV, nurbsSurface)
    }

    display() {
        this.object.display()
    }
}