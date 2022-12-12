import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFplane } from "../lib/CGF.js";

/**
* MyScene
* @constructor
*/
export class MyScene extends CGFscene {
    constructor() {
        super();
    }

    init(application) {
      super.init(application);
      this.initCameras();
      this.initLights();

      //Background color
      this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

      this.gl.clearDepth(100.0);
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.enable(this.gl.CULL_FACE);
      this.gl.depthFunc(this.gl.LEQUAL);

      //Initialize scene objects
      this.axis = new CGFaxis(this);

      // the material to render non-pickable objects
      this.nonPickable = new CGFappearance(this);
      this.nonPickable.setAmbient(0.3, 0.3, 0.3, 1);
      this.nonPickable.setDiffuse(0.3, 0.3, 0.3, 1);
      this.nonPickable.setSpecular(0.5, 0.0, 0.0, 1);
      this.nonPickable.setShininess(120);

      // the material to render pickable objects
      this.pickable = new CGFappearance(this);
      this.pickable.setAmbient(0.1, 0.3, 0.1, 1);
      this.pickable.setDiffuse(0.2, 0.7, 0.2, 1);
      this.pickable.setSpecular(0.0, 0.0, 0.0, 1);
      this.pickable.setShininess(120);

      // demo objects
      this.objects = [
        new CGFplane(this),
        new CGFplane(this),
        new CGFplane(this),
        new CGFplane(this),
      ];

      // the activation of picking capabilities in WebCGF
      // will use a shader for picking purposes (lib\shaders\picking\vertex.glsl and lib\shaders\picking\fragment.glsl)
      this.setPickEnabled(true);
    }
    initLights() {
        this.setGlobalAmbientLight(0.3, 0.3, 0.3, 1.0);

        this.lights[0].setPosition(2.0, 2.0, 12.0, 1.0);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].setSpecular(1.0, 1.0, 0.0, 1.0);
        this.lights[0].enable();
        this.lights[0].setVisible(true);
        this.lights[0].update();
    }
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(10, 5, 20), vec3.fromValues(0, 0, 0));
    }

	logPicking()
	{
		if (this.pickMode == false) {
			// results can only be retrieved when picking mode is false
			if (this.pickResults != null && this.pickResults.length > 0) {
				for (var i=0; i< this.pickResults.length; i++) {
					var obj = this.pickResults[i][0];
					if (obj)
					{
						var customId = this.pickResults[i][1];				
						console.log("Picked object: " + obj + ", with pick id " + customId);
					}
				}
				this.pickResults.splice(0,this.pickResults.length);
			}		
		}
	}

    display() {
		// When picking is enabled, the scene's display method is called once for picking, 
		// and then again for rendering.
		// logPicking does nothing in the beginning of the first pass (when pickMode is true)
		// during the first pass, a picking buffer is filled.
		// in the beginning of the second pass (pickMode false), logPicking checks the buffer and
		// collects the id's of the picked object(s) 
		this.logPicking();

		// this resets the picking buffer (association between objects and ids)
		this.clearPickRegistration();
	
		// Clear image and depth buffer every time we update the scene
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.gl.enable(this.gl.DEPTH_TEST);
	
		// Initialize Model-View matrix as identity (no transformation)
		this.updateProjectionMatrix();
		this.loadIdentity();
	
		// Apply transformations corresponding to the camera position relative to the origin
		this.applyViewMatrix();
	
		// Update lights used
		this.lights[0].update();
	
		// Draw axis
		this.axis.display();	
		
		this.rotate(Math.PI/2.0,1,0,0);
	
		// draw objects
		var pickId = 1
		for (var i =0; i<this.objects.length; i++) {
			this.pushMatrix();
			// demo transformation
			this.translate(0, i * 2, 0);
			// in this example, for illustration purposes, we will define the 3rd object in the array
			// to be not pickable => no registerForPick
			if (i === 2) {
				// for illustration purposes use the non-pickable material
				this.nonPickable.apply();
			}
			else {
				// for illustration purposes use the pickable material
				this.pickable.apply();
				// set pick id before drawing. Pick ids are required to be >=1
				// cannot be zero
				this.registerForPick(pickId++, this.objects[1]);
			}
			// render the object
			this.objects[i].display();
			this.popMatrix();
		}
    }
}
