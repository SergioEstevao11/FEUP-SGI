export class MyKeyframe{
    constructor(tx, ty, tz, rx, ry, rz, sx, sy, sz, instant){
        this.tx = tx;
        this.ty = ty;
        this.tz = tz;
        this.rx = rx;
        this.ry = ry;
        this.rz = rz;
        this.sx = sx;
        this.sy = sy;
        this.sz = sz;
        this.instant = instant;
    }

    static interpolate(frame1, frame2, r){
		return new Keyframe(
			frame1.tx + r * (frame2.tx - frame1.tx),
			frame1.ty + r * (frame2.ty - frame1.ty),
			frame1.tz + r * (frame2.tz - frame1.tz),
			frame1.rx + r * (frame2.rx - frame1.rx),
			frame1.ry + r * (frame2.ry - frame1.ry),
			frame1.rz + r * (frame2.rz - frame1.rz),
			frame1.sx + r * (frame2.sx - frame1.sx),
			frame1.sy + r * (frame2.sy - frame1.sy),
			frame1.sz + r * (frame2.sz - frame1.sz)
		);
	}

    getMatrix(){
        let matrix = mat4.create();
        mat4.translate(matrix, matrix, vec3.fromValues(this.tx, this.ty, this.tz));
        mat4.rotateX(matrix, matrix, this.rx);
        mat4.rotateY(matrix, matrix, this.ry);
        mat4.rotateZ(matrix, matrix, this.rz);
        mat4.scale(matrix, matrix, vec3.fromValues(this.sx, this.sy, this.sz));
        return matrix;
    }
}