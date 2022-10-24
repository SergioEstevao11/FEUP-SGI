import {CGFobject, CGFnurbsSurface, CGFnurbsObject} from '../../lib/CGF.js';

/**
 * Plane
 * @constructor
 * @param scene   - Reference to MyScene object
 * @param npartsU - number of sections in U direction
 * @param npartsV - number of sections in V direction
 */
 class Plane extends CGFobject {
	constructor(scene, npartsU, npartsV) {
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.scene   = scene;
        this.initBuffers();
    }
	initBuffers() {
        let controlPoints = [
            [ // U = 0
                [-0.5, 0.0, +0.5, 1], // V = 0
                [-0.5, 0.0, -0.5, 1], // V = 1
            ],
            [ // U = 1
                [ 0.5, 0.0, +0.5, 1], // V = 0
                [ 0.5, 0.0, -0.5, 1], // V = 1
            ]
        ];
        let nurbsSurface  = new CGFnurbsSurface(1, 1, controlPoints);
        this.nurbsObject   = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface);
    }
    display(){
        this.nurbsObject.display();
    }
}