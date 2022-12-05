import { CGFscene, CGFcamera, CGFappearance, CGFaxis, CGFtexture, CGFshader } from "../lib/CGF.js";
import { MyQuad } from "./MyQuad.js";


export class TextScene extends CGFscene
{
	constructor()
    {
		super();
		this.texture = null;
		this.appearance = null;
		this.quad = null;
		this.textShader = null;
	}

	init(application) {
		super.init(application);

		this.initCameras();

		this.initLights();

		this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
		this.gl.clearDepth(1000.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.depthFunc(this.gl.LEQUAL);
		
		this.axis=new CGFaxis(this);
		this.enableTextures(true);
	
		this.appearance = new CGFappearance(this);

		// font texture: 16 x 16 characters
		// http://jens.ayton.se/oolite/files/font-tests/rgba/oolite-font.png
		this.fontTexture = new CGFtexture(this, "textures/oolite-font.trans.png");
		this.appearance.setTexture(this.fontTexture);

		// plane where texture character will be rendered
		this.quad=new MyQuad(this);
		
		// instatiate text shader (used to simplify access via row/column coordinates)
		// check the two files to see how it is done
		this.textShader=new CGFshader(this.gl, "shaders/font.vert", "shaders/font.frag");

		// set number of rows and columns in font texture
		this.textShader.setUniformsValues({'dims': [16, 16]});

	};

	initLights() {

		if (this.lights.length > 0) {
			this.lights[0].setPosition(3,3,3,1);
			this.lights[0].enable();		
			this.lights[0].update();
		}
	};


	initCameras = function () {
		this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(20, 20, 100), vec3.fromValues(0, 0, 0));
	};

	display() 
	{
		// Clear image and depth buffer every time we update the scene
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.gl.enable(this.gl.DEPTH_TEST);

		// Initialize Model-View matrix as identity (no transformation
		this.updateProjectionMatrix();
		this.loadIdentity();

		// An example of how to show something that is not affected by the camera (e.g. a HUP display)
		// here showing the spritesheet
		this.pushMatrix();
			this.translate(-1,1.5,-10);
			this.quad.display();
		this.popMatrix();

		// Apply transformations corresponding to the camera position relative to the origin
		this.applyViewMatrix();
		
		// Update all lights used
		this.lights[0].update();

		// Draw axis
		this.axis.display();	

		// activate shader for rendering text characters
		this.setActiveShaderSimple(this.textShader);

		// Optional: disable depth test so that it is always in front (need to reenable in the end)
		this.gl.disable(this.gl.DEPTH_TEST);

		// activate texture containing the font
		this.appearance.apply();

		this.pushMatrix();
			// 	Reset transf. matrix to draw independent of camera
			this.loadIdentity();

			// transform as needed to place on screen
			this.translate(-1,0,-50);

			// set character to display to be in the Nth column, Mth line (0-based)
			// the shader will take care of computing the correct texture coordinates 
			// of that character inside the font texture (check shaders/font.vert )
			// Homework: This should be wrapped in a function/class for displaying a full string

			this.activeShader.setUniformsValues({'charCoords': [3,5]});	// S
			this.quad.display();

			this.translate(1,0,0);
			this.activeShader.setUniformsValues({'charCoords': [7,4]});	// G
			this.quad.display();

			this.translate(1,0,0);
			this.activeShader.setUniformsValues({'charCoords': [9,4]}); // I
			this.quad.display();

		this.popMatrix();

		// re-enable depth test 
		this.gl.enable(this.gl.DEPTH_TEST);

		// reactivate default shader
		this.setActiveShaderSimple(this.defaultShader);

	}
}