import { CGFscene } from '../lib/CGF.js';
import { CGFaxis,CGFcamera,CGFshader } from '../lib/CGF.js';
import { MyGameOrchestrator } from './MyGameOrchestrator.js';



/**
 * XMLscene class, representing the scene that is to be rendered.
 */
export class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.graph = null;
		this.gameOrchestrator = null
        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        // this.shader1 = new CGFshader(this.gl, "shaders/vertexshader.vert", "shaders/fragshader.frag"),
        // this.shader2 = new CGFshader(this.gl, "shaders/water.vert", "shaders/water.frag"),

        this.initCameras();

        this.initShader();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

		this.startingTime = null;
		
        this.setUpdatePeriod(10);
		this.setPickEnabled(true);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    initShader() {
        this.shader = new CGFshader(this.gl, "shaders/highlight.vert", "shaders/highlight.frag");
        this.shader.setUniformsValues({timeFactor: 0});
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        var folder_lights = this.interface.gui.addFolder("Lights");
        // Lights index.
        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];
                console.log(this.lights[i])

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                this.lights[i].setConstantAttenuation(light[6][0]);
                this.lights[i].setLinearAttenuation(light[6][1]);
                this.lights[i].setQuadraticAttenuation(light[6][2]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[7]);
                    this.lights[i].setSpotExponent(light[8]);
                    this.lights[i].setSpotDirection(light[9][0], light[9][1], light[9][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable(); //update
                else
                    this.lights[i].disable();

                this.lights[i].update();
                folder_lights.add(this.lights[i], 'enabled').name(key);

                i++;
            }
        }

        this.num_lights = i;
    }

    initPieceSpotlight(){
        this.angle = 45;
        this.exponent = 2;
        this.location = [0, 5, 0, 1];
        this.target = [0, 0, 0]; 
        this.ambient = [0.5, 0.5, 0.5, 1];
        this.diffuse = [1, 1, 1, 1];
        this.specular = [1, 1, 1, 1];
        this.attenuation = [0, 0, 0.01]

        this.lights[this.num_lights].setPosition(this.location[0], this.location[1], this.location[2], this.location[3]);
        this.lights[this.num_lights].setAmbient(this.ambient[0], this.ambient[1], this.ambient[2], this.ambient[3]);
        this.lights[this.num_lights].setDiffuse(this.diffuse[0], this.diffuse[1], this.diffuse[2], this.diffuse[3]);
        this.lights[this.num_lights].setSpecular(this.specular[0], this.specular[1], this.specular[2], this.specular[3]);
        this.lights[this.num_lights].setConstantAttenuation(this.attenuation[0]);
        this.lights[this.num_lights].setLinearAttenuation(this.attenuation[1]);
        this.lights[this.num_lights].setQuadraticAttenuation(this.attenuation[2]);
        this.lights[this.num_lights].setSpotCutOff(this.angle);
        this.lights[this.num_lights].setSpotExponent(this.exponent);
        this.lights[this.num_lights].setSpotDirection(this.target[0], this.target[1], this.target[2]);
    }

    updatePieceSpotlight(target){
        this.lights[this.num_lights].setSpotDirection(target[0], target[1], target[2]);
        this.lights[this.num_lights].enable()
        this.lights[this.num_lights].update();
    }

    deactivatePieceSpotlight(){
        this.lights[this.num_lights].disable();
        this.lights[this.num_lights].update();
    }

    initShaderFolderCheckboxes() {
        var folder_shaders = this.interface.gui.addFolder("Shaders");

        for(let i = 0; i < this.graph.shaderComponents.length; i++) {
            let id = this.graph.shaderComponents[i].id;
            folder_shaders.add(this.graph.shaderComponents[i], 'highlighted').name(id);
        }

    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {


        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();


        this.interface.gui.add(this.graph, 'selectedView', this.graph.cameraIds).name('Cameras').onChange(this.updateCamera.bind(this));
        
        this.initShaderFolderCheckboxes();

        // folder_shader.add(this.shader, 'enabled').name(key);
		// this.interface.gui.add(this.graph, 'showHighlight').name('Highlight').onChange(this.setActiveShader(this.shader));   



        this.sceneInited = true;
    }

    /**
     * Updates camera
     */
    updateCamera(){
        this.camera = this.graph.views[this.graph.selectedView]
        // this.updateProjectionMatrix();
        // this.loadIdentity();
        this.interface.setActiveCamera(this.camera);
    }
    
    /**
     * 
     * checks if key M has been pressed
     * updates animations
     */
    update(t){
        
        this.gameOrchestrator.update(t);
    }

    /**
     * Displays the scene.
     */
    display() {
		this.gameOrchestrator.managePick(this.pickMode, this.pickResults);
		this.clearPickRegistration();
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();
        this.axis.display();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(false);
            this.lights[i].update();
        }

        if (this.sceneInited) {
            // Draw axis
            this.setDefaultAppearance();

            // Displays the scene (MySceneGraph function).
            this.gameOrchestrator.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}