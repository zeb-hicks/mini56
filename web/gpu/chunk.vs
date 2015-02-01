uniform vec2 res;
uniform vec4 pos;

uniform vec3 camera;

attribute vec3 vertices;
attribute vec2 uvs;
varying vec2 uv;
varying float zoom;

void main() {
	float hpxl = 0.5 / 1024.0 * camera.y;
	uv = uvs * (1.0 - hpxl * 2.0) + hpxl; // Boundary rounding error fix.
	zoom = camera.y;
	// gl_Position = vec4((vertices.xy * vec2(pos.z, -pos.w) * camera.y + vec2(pos.x, -pos.y) - vec2(camera.x, -camera.z) * camera.y) / res, 1.0, 1.0);
	gl_Position = vec4((vertices.xy * pos.zw - camera.xz + pos.xy) / res * vec2(camera.y, -camera.y), 1.0, 1.0);
}
