uniform vec2 res;
uniform vec4 pos;
uniform float rot;

attribute vec3 vertices;
attribute vec2 uvs;
varying vec2 uv;

void main() {
	uv = uvs;
	mat2 rm = mat2(0.0);
	rm[0].x = cos(rot);
	rm[0].y = -sin(rot);
	rm[1].x = sin(rot);
	rm[1].y = cos(rot);
	gl_Position = vec4((vertices.xy * pos.zw * rm + pos.xy) / res, 1.0, 1.0);
}
