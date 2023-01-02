import { CGFlight } from '../../lib/CGF.js';

export class MyPieceSpotlight{
    constructor(orchestrator, piece) {

        this.scene = orchestrator.scene;
        this.index = this.scene.num_lights;
        this.piece = piece;
        
        this.angle = 10;
        this.exponent = 2;
        this.location = [0, 1, 0, 1];
        this.target = [0, 0, 0]; 
        this.ambient = [0.5, 0.5, 0.5, 1];
        this.diffuse = [0.1, 0.1, 0.1, 1];
        this.specular = [0, 0, 0, 1];
        this.attenuation = [0, 0, 0.01]

        this.scene.lights[this.index].setPosition(this.location[0], this.location[1], this.location[2], this.location[3]);
        this.scene.lights[this.index].setAmbient(this.ambient[0], this.ambient[1], this.ambient[2], this.ambient[3]);
        this.scene.lights[this.index].setDiffuse(this.diffuse[0], this.diffuse[1], this.diffuse[2], this.diffuse[3]);
        this.scene.lights[this.index].setSpecular(this.specular[0], this.specular[1], this.specular[2], this.specular[3]);
        this.scene.lights[this.index].setConstantAttenuation(this.attenuation[0]);
        this.scene.lights[this.index].setLinearAttenuation(this.attenuation[1]);
        this.scene.lights[this.index].setQuadraticAttenuation(this.attenuation[2]);
        this.scene.lights[this.index].setSpotCutOff(this.angle);
        this.scene.lights[this.index].setSpotExponent(this.exponent);
        this.scene.lights[this.index].setSpotDirection(this.target[0], this.target[1], this.target[2]);
        this.scene.lights[this.index].enable();
        

    }

    /**
     * Update function, called periodically, which calculates the values of the camera at a given moment
     * @param {Integer} elapsedTime - the time elapsed since the last call
     */
    update(currentTransformation) {
        
        let tile = this.piece.tile;
        let x = tile.coordinates[0]- 4 + 0.5 + currentTransformation.tx;
        let z = -tile.coordinates[1] + 4 - 0.5 - currentTransformation.ty;
        // if (this.piece.type == "black"){
        //     z -= 6
        // }
        console.log([x, 0, z], tile.coordinates, currentTransformation.tx, currentTransformation.ty)
        // this.scene.lights[this.index].setPosition(this.location[0], this.location[1], this.location[2], this.location[3]);
        this.scene.lights[this.index].setPosition(x, 1, z, 1);
        this.scene.lights[this.index].setSpotDirection(x, 0, z);
        this.scene.lights[this.index].update();
    }

    deactivate() {
        this.scene.lights[this.index].disable();
        this.scene.lights[this.index].update();
    }

    /**
     * Applies the current camera to the scene, if the animation if active
     */
}