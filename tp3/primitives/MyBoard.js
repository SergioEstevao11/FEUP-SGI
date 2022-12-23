import { MyPatch } from "./MyPatch";

export class MyBoard extends CGFobject {
    constructor(scene, id, controlPoints) {
        super(scene);
        this.id = id;
        
        let controlPoints = [];

        this.patch = new MyPatch(scene, 1, 1, 20, 20, controlVerts);
    }

    display() {
        this.patch.display();
    }
}