import {CGFobject, CGFnurbsSurface, CGFnurbsObject} from '../../lib/CGF.js';

/**
 * Patch
 * @constructor
 * @param scene   - Reference to MyScene object
 * @param npartsU - number of sections in U direction
 * @param npartsV - number of sections in V direction
 * @param controlPoints - control points for the patch
 */
 class Patch extends CGFobject {
	constructor(scene, npartsU, npartsV, npointsU, npointsV, controlPoints) {
        super(scene);
        this.scene   = scene;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.degreeU = npointsU-1;
        this.degreeV = npointsV-1;
        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.controlPoints = JSON.parse(JSON.stringify(controlPoints));
        this.initBuffers();
    }
	initBuffers() {
        for(let u = 0; u < this.npointsU; ++u){
            for(let v = 0; v < this.npointsV; ++v){
                this.controlPoints[u][v].push(1);
            }
        }
        let nurbsSurface = new CGFnurbsSurface(this.degreeU, this.degreeV, this.controlPoints);
        this.nurbsObject = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface);
    }
    display(){
        this.nurbsObject.display();
    }
}