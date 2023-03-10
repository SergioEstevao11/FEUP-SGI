import { CGFappearance, CGFcamera, CGFcameraOrtho, CGFtexture, CGFXMLreader } from '../lib/CGF.js';
import { MyRectangle } from './primitives/MyRectangle.js';
import { MyCylinder } from './primitives/MyCylinder.js';
import { MySphere } from './primitives/MySphere.js';
import { MyTorus } from './primitives/MyTorus.js';
import { MyTriangle } from './primitives/MyTriangle.js';
import { MyPatch } from './primitives/MyPatch.js';
import { MyMainBoard } from './primitives/MyMainBoard.js';
import { MySupportBoard } from './primitives/MySupportBoard.js';
import { MyComponent } from './MyComponent.js';
import { MyKeyframeAnimation } from './animations/MyKeyframeAnimation.js';
import { MyKeyframe } from './animations/MyKeyframe.js';


// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var ANIMATIONS_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
export class MySceneGraph {
    /**
     * @constructor
     */
    constructor(scene, filename) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        this.scene.graph = this;

        this.keysPressed=false;

        this.nodes = [];
        this.views = [];
        this.shaderComponents = [];
        this.scene.displayShader = null;


        this.idRoot = null;

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.graph = this;

        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "sxs")
            return "root tag <sxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        console.log(nodes)
        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");
            
            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }



        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block.
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        this.selectedView = null;
        this.cameraIds = {}
        this.selectedView = -1;




        var default_name = this.reader.getString(viewsNode, 'default')
        if (default_name == null)
            return "no default view defined"

        var camera_node, camera_id, camera_near, camera_far, camera_angle, camera_from, camera_to, camera_up, camera

        for(let i=0; i<viewsNode.children.length; i++){
            camera_node = viewsNode.children[i];
            if (camera_node.nodeName == "perspective"){
                camera_id = this.reader.getString(camera_node, 'id');
                if (camera_id == null){
                    this.onXMLMinorError("Camera id not defined");
                }
                camera_near = this.reader.getFloat(camera_node, 'near');
                camera_far = this.reader.getFloat(camera_node, 'far');
                camera_angle = this.reader.getFloat(camera_node, 'angle');

                camera_from = this.parseCoordinates3D(camera_node.children[0]);
                camera_to = this.parseCoordinates3D(camera_node.children[1]);

                if(camera_from==null || camera_to==null){
                    this.onXMLMinorError("Camera specs not defined");
                }
                camera = new CGFcamera(camera_angle*Math.PI/180, camera_near, camera_far, vec3.fromValues(...camera_from), vec3.fromValues(...camera_to))
                this.views.push(camera)

            }
            else if (camera_node.nodeName == "ortho"){
                camera_id = this.reader.getString(camera_node, 'id');
                if (camera_id == null){
                    this.onXMLMinorError("Camera id not defined");
                }
                camera_near = this.reader.getFloat(camera_node, 'near');
                camera_far = this.reader.getFloat(camera_node, 'far');
                let camera_left = this.reader.getFloat(camera_node, 'left');
                let camera_right = this.reader.getFloat(camera_node, 'right');
                let camera_top = this.reader.getFloat(camera_node, 'top');
                let camera_bottom = this.reader.getFloat(camera_node, 'bottom');

                camera_from = this.parseCoordinates3D(camera_node.children[0]);
                camera_to = this.parseCoordinates3D(camera_node.children[1]);
                camera_up = this.parseCoordinates3D(camera_node.children[2]);

                if(camera_from==null || camera_to==null || camera_up==null){
                    this.onXMLMinorError("Camera specs not defined");
                }

                camera = new CGFcameraOrtho(camera_left, camera_right, camera_bottom, camera_top, camera_near, camera_far,
                    vec3.fromValues(...camera_from), vec3.fromValues(...camera_to), vec3.fromValues(...camera_up))
                this.views.push(camera)


            }
            else{
                this.onXMLMinorError("View not defined");
            }

            this.cameraIds[camera_id] = i;


        }




        this.log("Parsed views");
        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName == "omni") {
                attributeNames = ["location", "ambient", "diffuse", "specular", "attenuation"];
                attributeTypes = ["position", "color", "color", "color", "attenuation"];
            }
            else if( children[i].nodeName == "spot"){
                attributeNames = ["location", "target", "ambient", "diffuse", "specular", "attenuation"];
                attributeTypes = ["position", "position", "color", "color", "color", "attenuation"];
            }
            else {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }


            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // get light enable/disable
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (aux != true && aux != false)
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
            //Add enabled boolean and type name to light info

            global.push(aux);

            if (children[i].nodeName == "omni") {
                global.push("omni");
            }
            else if( children[i].nodeName == "spot"){
                global.push("spot")
            }


            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }
            var aux,target;
            var push = true;
            for (var j = 0; j < attributeNames.length; j++) {
                    push = true;
                    if (attributeTypes[j] == "position"){
                        if(attributeNames[j] == "target"){
                            target = this.parseCoordinates4D(grandChildren[j], "light position for ID" + lightId);
                            push = false;
                        }
                        else{
                            aux = this.parseCoordinates4D(grandChildren[j], "light position for ID" + lightId);
                        }
                    }
                    else if(attributeTypes[j] == "attenuation"){
                        aux = this.parseAttenuation(grandChildren[j], "light attenuation for ID" + lightId);
                    }
                    else if(attributeTypes[j] == "color"){
                        aux = this.parseColor(grandChildren[j], attributeNames[j] + " illumination for ID" + lightId);
                    }

                    if (push){
                        global.push(aux);
                    }
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;
                global.push(angle);
                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;
                global.push(exponent);
                global.push(target);
            }

            this.log(global)
            this.lights[lightId] = global;
            numLights++;
        }

        console.log("all of the lights: ", this.lights);
        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");


        this.log("Parsed lights");
        return null;
    }
    parseAttenuation(node, messageError) {

        // constant
        var constant = this.reader.getFloat(node, 'constant');
        if (!(constant != null && !isNaN(constant) && constant >= 0 && constant <= 1))
            return "unable to parse constant component of the " + messageError;

        // linear
        var linear = this.reader.getFloat(node, 'linear');
        if (!(linear != null && !isNaN(linear) && linear >= 0 && linear <= 1))
            return "unable to parse linear component of the " + messageError;

        // quadratic
        var quadratic = this.reader.getFloat(node, 'quadratic');
        if (!(quadratic != null && !isNaN(quadratic) && quadratic >= 0 && quadratic <= 1))
            return "unable to parse quadratic component of the " + messageError;

        var components = [constant, linear, quadratic]
        var cp = false;
        for (var i in components){
            if(components[i] != 0){
                if (cp){
                    this.onXMLMinorError("Only one of the light attenuation compponents can be different from 0!")
                }
                cp = true;
            }
        }
        return components;
    }
    /**
     * Parses the <textures> block.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        this.textures=[];
        //For each texture in textures block, check ID and file URL
        for (let i=0; i< texturesNode.children.length; i++){
            var texture = texturesNode.children[i];
            this.textures[texture.id] = new CGFtexture(this.scene, this.reader.getString(texture, 'file'));
        }
        this.log("Parsed textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            var material = new CGFappearance(this.scene);

            //do something with vars id, shininess etc
            var shininess = this.reader.getString(children[i], 'shininess');
            if (shininess == null){
                return "no shininess defined for material";
            }



            grandChildren = children[i].children;
            for (let i=0; i<grandChildren.length; i++){
                var gc = grandChildren[i];
                if (gc.nodeName == "emission"){
                    material.emissive = this.parseColor(gc,"emission");
                }
                else if (gc.nodeName == "ambient"){
                    material.ambient = this.parseColor(gc,"ambient");
                }
                else if (gc.nodeName == "diffuse"){
                    material.diffuse = this.parseColor(gc,"diffuse");
                }
                else if (gc.nodeName == "specular"){
                    material.specular = this.parseColor(gc,"specular");
                }
                else{
                    this.onXMLMinorError(gc.nodeName + "material component not defined");
                }
            }
            this.materials[materialID] = material;
        }
        this.scene.materials = this.materials;

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = this.getTransformationMatrix(grandChildren, transformationID);

            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Function that returns a matrix with the sum of all transformations in the transformation block
     * @returns
     */
    getTransformationMatrix(grandChildren, transformationID){
        var transfMatrix = mat4.create();
        for (var j = 0; j < grandChildren.length; j++) {
            switch (grandChildren[j].nodeName) {
                case 'translate':
                    var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                    if (!Array.isArray(coordinates))
                        return coordinates;

                    transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                    break;
                case 'scale':
                    var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                    if (!Array.isArray(coordinates))
                        return coordinates;

                    transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                    break;

                case 'rotate':
                    if (transformationID == "move_right")
                        console.log("animation rotate");
                    var axis = this.reader.getString(grandChildren[j], 'axis');
                    if (!(axis != null))
                        return "unable to parse axis of the transformation for ID = " + transformationID;

                    var angle = this.reader.getFloat(grandChildren[j], 'angle');
                    if (!(angle != null))
                        return "unable to parse angle of the transformation for ID = " + transformationID;

                    angle = angle * Math.PI / 180 //parse to rads

                    switch(axis){
                        case "x":
                            mat4.rotateX(transfMatrix, transfMatrix, angle);
                            break;

                        case "y":
                            mat4.rotateY(transfMatrix, transfMatrix, angle);
                            break;

                        case "z":
                            mat4.rotateZ(transfMatrix, transfMatrix, angle);
                            break;
                    }

            }
        }

        return transfMatrix;
    }


    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus' && grandChildren[0].nodeName != 'patch' &&
                    grandChildren[0].nodeName != 'mainboard' && grandChildren[0].nodeName != 'supportboard')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere, torus or patch)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;


                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }

            else if (primitiveType == 'triangle'){
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

                var triangle = new MyTriangle(this.scene, primitiveId, x1, x2, x3, y1, y2, y3, z1, z2, z3);

                this.primitives[primitiveId] = triangle;
            }

            else if (primitiveType == 'cylinder'){
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var cylinder = new MyCylinder(this.scene, base, top, height, slices, stacks);

                this.primitives[primitiveId] = cylinder;
            }

            else if(primitiveType == 'sphere'){
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var sphere = new MySphere(this.scene, radius, slices, stacks);

                this.primitives[primitiveId] = sphere;
            }

            else if (primitiveType == 'torus'){
                // inner
                let inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner)))
                    return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;

                // outer
                let outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

                // slices
                let slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // x2
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;

                let torus = new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);

                this.primitives[primitiveId] = torus;
            }
            else if(primitiveType == 'patch'){
                let controlVertsNodes = grandChildren[0].children;
                let degree_u = this.reader.getFloat(grandChildren[0], 'degree_u');
                if (!(degree_u != null && !isNaN(degree_u)))
                    return "unable to parse degree_u of the primitive coordinates for ID = " + primitiveId;

                let parts_u = this.reader.getFloat(grandChildren[0], 'parts_u');
                if (!(parts_u != null && !isNaN(parts_u)))
                    return "unable to parse parts_u of the primitive coordinates for ID = " + primitiveId;

                let degree_v = this.reader.getFloat(grandChildren[0], 'degree_v');
                if (!(degree_v != null && !isNaN(degree_v)))
                    return "unable to parse degree_v of the primitive coordinates for ID = " + primitiveId;
                
                    
                let parts_v = this.reader.getFloat(grandChildren[0], 'parts_v');
                if (!(parts_v != null && !isNaN(parts_v)))
                    return "unable to parse parts_v of the primitive coordinates for ID = " + primitiveId;

                if((degree_u+1) * (degree_v+1) != controlVertsNodes.length){
                    return "degree_u and degree_v don??t match number of control points for ID = " + primitiveId;
                }

                let controlVerts = []
                for(let i = 0; i <= degree_u; i++){
                    var vline = [];
                    for(let j = 0; j <= degree_v; j++){
                        let controlPoint = controlVertsNodes[i*(degree_v+1)+j]
                        let coordinates = this.parseCoordinates3D(controlPoint, "Invalid controlpoint coordinates")
                        coordinates.push(1)
                        vline.push(coordinates)
                    }
                    controlVerts.push(vline)
                }
                let patch = new MyPatch(this.scene, degree_u, degree_v, parts_u, parts_v, controlVerts);
                this.primitives[primitiveId] = patch;

                console.log(patch)

            }
            else if(primitiveType == 'mainboard'){
                let mainboard = new MyMainBoard(this.scene);
                this.primitives[primitiveId] = mainboard;
            }
            else if(primitiveType == 'supportboard'){
                let supportboard = new MySupportBoard(this.scene);
                this.primitives[primitiveId] = supportboard;
            }

            else {
                console.warn("To do: Parse other primitives.");
            }
        }

        this.log("Parsed primitives");
        return null;
    }

    parseKeyframeAnimations(grandChildren, keyframeAnimationID) {
        let translateCoordinates = [0,0,0]
        let scaleCoordinates = [1,1,1]
        let rotateCoordinates = [0,0,0]
        for (var j = 0; j < grandChildren.length; j++) {
            switch (grandChildren[j].nodeName) {
                case 'translate':
                    translateCoordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + keyframeAnimationID);
                    if (!Array.isArray(translateCoordinates))
                        return translateCoordinates;

                    break;
                case 'scale':
                    scaleCoordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + keyframeAnimationID);
                    if (!Array.isArray(scaleCoordinates))
                        return scaleCoordinates;

                    break;

                case 'rotate':
                    var axis = this.reader.getString(grandChildren[j], 'axis');
                    if (!(axis != null))
                        return "unable to parse axis of the transformation for ID = " + keyframeAnimationID;

                    var angle = this.reader.getFloat(grandChildren[j], 'angle');
                    if (!(angle != null))
                        return "unable to parse angle of the transformation for ID = " + keyframeAnimationID;

                    angle = angle * Math.PI / 180 //parse to rads

                    switch(axis){
                        case "x":
                            rotateCoordinates[0] = angle
                            break;

                        case "y":
                            rotateCoordinates[1] = angle
                            break;

                        case "z":
                            rotateCoordinates[2] = angle
                            break;
                    }

            }
        }
        let keyframe = new MyKeyframe(translateCoordinates[0], translateCoordinates[1], translateCoordinates[2], rotateCoordinates[0], rotateCoordinates[1], rotateCoordinates[2], scaleCoordinates[0], scaleCoordinates[1], scaleCoordinates[2], 0)
        return keyframe
    }


    parseAnimations(animationsNode) {
        var children = animationsNode.children;
        this.animations = {}

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "keyframeanim") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var keyframeanimID = this.reader.getString(children[i], 'id');
            if (keyframeanimID == null)
                return "no ID defined for keyframeanimID";

            // Checks for repeated IDs.
            if (this.animations[keyframeanimID] != null)
                return "ID must be unique for each component (conflict: ID = " + keyframeanimID + ")";
            let grandChildren = children[i].children; //keyframes

            let keyframes = [];

            for(let j = 0; j < grandChildren.length; j++){
                if (grandChildren[j].nodeName != "keyframe") {
                    this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + ">");
                    continue;
                }

                let instant = this.reader.getFloat(grandChildren[j], 'instant');
                if (!(instant != null && !isNaN(instant)))
                    return "unable to parse instant of the primitive coordinates for ID = " + keyframeanimID;

                let keyframe = this.parseKeyframeAnimations(grandChildren[j].children, keyframeanimID)
                keyframe.instant = instant
                keyframes.push(keyframe);
            }

            let animation = new MyKeyframeAnimation(this.scene, keyframeanimID, keyframes);
            
            this.animations[keyframeanimID] = animation;
        }

    }


    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children; //components

        this.components = {};

        var grandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {


            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;



            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var animationIndex = nodeNames.indexOf("animation");
            var childrenIndex = nodeNames.indexOf("children");
            var highlightedIndex = nodeNames.indexOf("highlighted");

            let component = new MyComponent(this.scene, componentID);

            // Transformations

            let transformation = grandChildren[transformationIndex] //tr block


            if(transformation == null){
                return "transformation parameters missing in component " + componentID;
            }

            if(transformation.children.length != 0){
                let Tnodenames = []
                for (var j = 0; j < transformation.children.length; j++) {
                    Tnodenames.push(transformation.children[j].nodeName);
                }

                if(Tnodenames.indexOf("transformationref") > 0){
                    return "conflict: transformationref and other transformation are present in component " + componentID;
                }


                if(Tnodenames.indexOf("transformationref") == 0){
                    let transformationID = this.reader.getString(transformation.children[0], 'id');
                    if (this.transformations[transformationID] == null){
                        return "No transformation with that id " + transformationID;
                    }

                    component.addTransformation(this.transformations[transformationID])
                }
                else{
                    component.addTransformation(this.getTransformationMatrix(transformation.children, componentID));

                }
            }




            // Materials


            let componentMaterials = grandChildren[materialsIndex];

            if (componentMaterials.children.length < 1){
                return "No materials in component " + componentID;
            }

            for(let m=0; m < componentMaterials.children.length; m++){
                let materialId = this.reader.getString(componentMaterials.children[m], 'id');

                if (materialId == "inherit"){
                    component.addMaterial(materialId);
                }
                else{
                    if (this.materials[materialId] == null){
                        return "Invalid material ID in component " + componentID;
                    }

                    component.addMaterial(this.materials[materialId]);
                }
            }




            // Texture

            let componentTextures = grandChildren[textureIndex];


            let textureId = this.reader.getString(componentTextures, 'id');
            if (textureId == "inherit" || textureId == "none"){

                component.setTexture(textureId);

            }
            else{
                let length_s = this.reader.getFloat(componentTextures, 'length_s');
                let length_t = this.reader.getFloat(componentTextures, 'length_t');

                if (this.textures[textureId] == null){
                    return "Invalid texture ID in component " + componentID;
                }
                if (length_s == null || length_t == null){
                    return "Invalid texture sizes in component " + componentID;
                }

                component.setTexture(this.textures[textureId], length_s, length_t);

                //component.setTexture(this.textures[textureId]);

            }

            // Animation
            if(animationIndex > -1){
                let animation = grandChildren[animationIndex];
                let animationId = this.reader.getString(animation, 'id');



                if (this.animations[animationId] == null){
                    return "Invalid animation ID in component " + componentID;
                }
    
                component.setAnimation(this.animations[animationId]);
                
            }

            // Children: primitives or other components

            var descendents = grandChildren[childrenIndex].children;

            //this.ComponentChildren[componentID] = [];


            for(let i = 0; i < descendents.length; ++i){
                let descendent = descendents[i];


                if(descendent.nodeName == "primitiveref"){
                    let primitiveRefId = this.reader.getString(descendent, 'id');
                    component.addChild(this.primitives[primitiveRefId]);
                }
                else if(descendent.nodeName == "componentref"){
                    let componentRefId = this.reader.getString(descendent, 'id');
                    component.addChild(this.components[componentRefId])
                }

            }


            //Highlighted

            if (highlightedIndex != -1){
                var highlight = grandChildren[highlightedIndex];

                // R
                var r = this.reader.getFloat(highlight, 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R highlighted component of component " + componentID;

                // G
                var g = this.reader.getFloat(highlight, 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G highlighted component of component " + componentID;

                // B
                var b = this.reader.getFloat(highlight, 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B highlighted component of component " + componentID;
                
                var scale = this.reader.getFloat(highlight, 'scale_h');
                if (!(scale != null && !isNaN(scale) && scale > 0))
                    return "unable to parse scale highlighted component of component " + componentID;
                

                let shaderValues = {r:r, g:g, b:b, scale:scale}

                component.setShaderValues(shaderValues);

                this.scene.displayShader = true;

                this.shaderComponents.push(component);
            }


            this.components[componentID] = component;


        }
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;

        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

        /**
     * Parse the attenuation components from a light node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
         parseAttenuation(node, messageError) {

            // constant
            var constant = this.reader.getFloat(node, 'constant');
            if (!(constant != null && !isNaN(constant) && constant >= 0 && constant <= 1))
                return "unable to parse constant component of the " + messageError;

            // linear
            var linear = this.reader.getFloat(node, 'linear');
            if (!(linear != null && !isNaN(linear) && linear >= 0 && linear <= 1))
                return "unable to parse linear component of the " + messageError;

            // quadratic
            var quadratic = this.reader.getFloat(node, 'quadratic');
            if (!(quadratic != null && !isNaN(quadratic) && quadratic >= 0 && quadratic <= 1))
                return "unable to parse quadratic component of the " + messageError;

            var components = [constant, linear, quadratic]
            var cp = false;
            for (var i in components){
                if(components[i] != 0){
                    if (cp){
                        this.onXMLMinorError("Only one of the light attenuation compponents can be different from 0!")
                    }
                    cp = true;
                }
            }
            return components;
        }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    checkKeys()  {
        var text="Keys pressed: ";

        if (this.scene.interface.isKeyPressed("KeyM")) {
            if(!this.keysPressed){
                for (const [key, value] of Object.entries(this.components)) {
                    this.components[key].incrementMaterialIndex();
                }
                text+="M";
                this.keysPressed = true;
            }
        }
        else{
            this.keysPressed = false
        }

    }

    update(t){
        if(this.startingTime == null){
            this.startingTime = t;
        }
        let secondsElapsed = (t - this.startingTime)/1000;

        this.checkKeys();
        if(this.scene.displayShader)
            this.scene.shader.setUniformsValues({ timeFactor: t / 100 % 100 });
        if (this.components == null)
            return;
        for (const [key, animation] of Object.entries(this.animations)) {
            if (animation.finished != true)
                animation.update(secondsElapsed);
        }
    }


    /**
     * Displays the scene, processing each node, starting in the root node.
     */


    displayScene() {
        this.components['demoRoot'].display(null);
        // let gameboard = new MySupportBoard(this.scene);
        // gameboard.display();
    }
}
