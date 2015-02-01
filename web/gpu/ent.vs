precision mediump float;

uniform vec2 res;
uniform vec4 pos;
uniform vec4 src;
uniform float rot;
uniform vec3 camera;

attribute vec3 vertices;
attribute vec2 uvs;
varying vec2 uv;
varying float zoom;

// vec4 hmapnormal(vec2 UV) {
// 	vec2 pxl = vec2(0.5) / vertres;
// 	vec3 unit = vec3(-1.0, 0.0, 1.0);
// 	float sv = texture2D(vHeight, UV).x;
// 	float sa = texture2D(vHeight, UV + pxl * unit.zz).x;
// 	float sb = texture2D(vHeight, UV + pxl * unit.xz).x;
// 	float sc = texture2D(vHeight, UV + pxl * unit.zx).x;
// 	vec3 va = normalize(vec3(2.0, (sb-sa) * fHeight, 0.0));
// 	vec3 vb = normalize(vec3(0.0, (sc-sa) * fHeight, 2.0));
// 	vec4 N = vec4(vec3(1.0, -1.0, 1.0) * cross(va, vb), sv);
// 	return N;
// }

void main() {
	float hpxl = 0.5 / 1024.0 * camera.y;
	uv = uvs;
	mat2 rm = mat2(0.0);
	rm[0].x = cos(rot);
	rm[0].y = -sin(rot);
	rm[1].x = sin(rot);
	rm[1].y = cos(rot);
	// gl_Position = vec4((vertices.xy * pos.zw * rm + pos.xy) / res, 1.0, 1.0);
	gl_Position = vec4((vertices.xy * src.zw * pos.w * rm - camera.xz + pos.xy) / res * vec2(camera.y, -camera.y), pos.z, 1.0);
	// gl_Position = vec4(vertices.xy * vec2(0.2, -0.2), 1.0, 1.0);
}
