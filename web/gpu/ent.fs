precision mediump float;

uniform sampler2D image;
uniform sampler2D imageh;
uniform vec2 imageres;
uniform vec4 src;
uniform vec4 mult;

varying vec2 uv;

// vec4 hmapnormal(vec2 UV) {
// 	vec2 pxl = vec2(0.5) / mapres;
// 	vec3 unit = vec3(-1.0, 0.0, 1.0);
// 	float sv = texture2D(tHeight, UV).x;
// 	float sa = texture2D(tHeight, UV + pxl * unit.zz).x;
// 	float sb = texture2D(tHeight, UV + pxl * unit.xz).x;
// 	float sc = texture2D(tHeight, UV + pxl * unit.zx).x;
// 	vec3 va = normalize(vec3(1.0, (sb-sa) * 16.0, 0.0));
// 	vec3 vb = normalize(vec3(0.0, (sc-sa) * 16.0, 1.0));
// 	vec4 N = vec4(vec3(1.0, -1.0, 1.0) * cross(va, vb), sv);
// 	return N;
// }

void main() {
	vec4 t = texture2D(image, (src.xy + uv * src.zw) / imageres);
	gl_FragColor = t * mult;
	// gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}