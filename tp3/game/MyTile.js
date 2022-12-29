import {CGFappearance, CGFtexture, CGFobject} from '../../lib/CGF.js';
import { MyPatch } from '../primitives/MyPatch.js';

/**
 * Data Class that holds information about the component
 */
export class MyTile extends CGFobject{
    constructor(orchestrator, id, board, type, x, y, z) {
        super(orchestrator.getScene())
        this.id = id;
        this.gameboard = board;
        this.type = type;
        this.piece = null;
        this.coordinates = [x, y, z];
        this.selectable = true;
        this.orchestrator = orchestrator;

        this.patch = new MyPatch(this.scene, 1, 1, 20, 20, 
            [
                [
                    [0,0,0,1],
                    [0,1,0,1]
                ],
                [
                    [1,0,0,1],
                    [1,1,0,1]
                ]
            ])

        this.black_material = new CGFappearance(this.scene);
        this.black_material.setAmbient(0.01,0.01,0.01,1.0);
        this.black_material.setDiffuse(0.05,0.05,0.05,1.0);
        this.black_material.setSpecular(0.2,0.2,0.2,1.0);
        this.black_material.setShininess(100.0);

        this.white_material = new CGFappearance(this.scene);
        this.white_material.setAmbient(0.01,0.01,0.01,1.0);
        this.white_material.setDiffuse(0.7,0.7,0.7,1.0);
        this.white_material.setSpecular(0.2,0.2,0.2,1.0);
        this.white_material.setShininess(100.0);

        this.selectedMaterial = new CGFappearance(this.scene);
        this.selectedMaterial.setAmbient(0.0,0.0,0.0,1.0);
        this.selectedMaterial.setDiffuse(1.0,0.4,0.0,1.0);
        this.selectedMaterial.setSpecular(1.0,1.0,1.0,1.0);
        this.selectedMaterial.setEmission(1.0,0.4,0.0,0.0);
        this.selectedMaterial.setShininess(100.0);
	}

    setPiece(piece){
        this.piece = piece;
        this.piece.tile = this;
    }

    unsetPiece(){
        this.piece.tile = null;
        this.piece = null;
    }

    getPiece(){
        return this.piece;
    }

    getBoard(){
        return this.gameboard;
    }

    setBoard(){
        this.gameboard = board;
    }

    display(){
        this.scene.pushMatrix();

        // Display tile itself
<<<<<<< HEAD
        if (this.type == "white")
=======
        this.scene.translate(this.coordinates[0], this.coordinates[1], this.coordinates[2]);
        if (this.type == 1){
>>>>>>> feat/board
            this.white_material.apply();
            this.patch.display();
        }
        else if(this.type == 0){
            this.black_material.apply();
            this.patch.display();
        }

<<<<<<< HEAD
        this.scene.translate(this.coordinates[0], this.coordinates[1], 0);
=======
>>>>>>> feat/board
        
        if (this.selectable){
            this.orchestrator.getScene().registerForPick(this.id, this);
            this.patch.display();
            // Display piece
            if (this.piece != null)
                this.piece.display()

            this.scene.popMatrix();

        }

        if (this.selectable)
            this.orchestrator.getScene().clearPickRegistration();
    }
}