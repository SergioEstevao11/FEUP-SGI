class MyBarrel extends CGFobject {
    constructor(scene, base, middle, height, slices, stacks) {
		super(scene);
        this.scene = scene
        this.r = base;
        this.R = middle;
        this.L = height;
        this.slices = slices;
        this.stacks = stacks;

        this.h = (4/3) * this.r
        this.H = (4/3) * (this.R - this.r)
        this.dz = this.L / 3

        
        this.initBuffers()
    }

    initBuffers() {
        this.topControlVerts = [
            [ // P4
                [this.r, 0, 0, 1], // Q1
                [this.r + this.H, 0, this.dz, 1], // Q2
                [this.r + this.H, 0, this.L - this.dz, 1], // Q3
                [this.r, 0, this.L, 1], // Q4
            ],
            [ // P3
                [this.r, this.h, 0, 1], // Q1
                [this.r + this.H, (this.r + this.H) * (4/3), this.dz, 1], // Q2
                [this.r + this.H, (this.r + this.H) * (4/3), this.L - this.dz, 1], // Q3
                [this.r, this.h, this.L, 1], // Q4
            ],
            [ // P2
                [-this.r, this.h, 0, 1], // Q1
                [-this.r - this.H, (this.r + this.H) * (4/3), this.dz, 1], // Q2
                [-this.r - this.H , (this.r + this.H) * (4/3), this.L - this.dz, 1], // Q3 
                [-this.r, this.h, this.L, 1], // Q4
            ],
            [ // P1
                [-this.r, 0, 0, 1], // Q1
                [-this.r - this.H, 0, this.dz, 1], // Q2
                [-this.r - this.H, 0, this.L - this.dz, 1], // Q3
                [-this.r, 0, this.L, 1], // Q4
            ],
        ]

        this.top = new MyPatch(this.scene, 4, 4, this.slices, this.stacks, this.topControlVerts)
    }

    display() {
        this.top.display()
        this.scene.pushMatrix()
        this.scene.rotate(Math.PI, 0, 0, 1)
        this.top.display()
        this.scene.popMatrix()
    }
}